/**
 * Tests for Webhook Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { webhookService, WebhookConfig } from './webhookService';

describe('WebhookService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        // Reset the singleton by reloading webhooks
        (webhookService as any).webhooks = [];
        (webhookService as any).logs = [];
    });

    describe('Webhook Management', () => {
        it('registers a new webhook', () => {
            const config: Omit<WebhookConfig, 'id' | 'createdAt'> = {
                name: 'Test Webhook',
                url: 'https://example.com/webhook',
                events: ['user.created', 'quiz.passed'],
                active: true,
            };

            const webhook = webhookService.registerWebhook(config);

            expect(webhook.id).toBeDefined();
            expect(webhook.name).toBe('Test Webhook');
            expect(webhook.url).toBe('https://example.com/webhook');
            expect(webhook.events).toEqual(['user.created', 'quiz.passed']);
            expect(webhook.active).toBe(true);
            expect(webhook.createdAt).toBeInstanceOf(Date);
        });

        it('registers webhook with secret', () => {
            const config: Omit<WebhookConfig, 'id' | 'createdAt'> = {
                name: 'Secure Webhook',
                url: 'https://example.com/webhook',
                secret: 'my-secret-key',
                events: ['certificate.earned'],
                active: true,
            };

            const webhook = webhookService.registerWebhook(config);

            expect(webhook.secret).toBe('my-secret-key');
        });

        it('updates existing webhook', () => {
            const webhook = webhookService.registerWebhook({
                name: 'Original',
                url: 'https://example.com/original',
                events: ['user.created'],
                active: true,
            });

            const updated = webhookService.updateWebhook(webhook.id, {
                name: 'Updated',
                url: 'https://example.com/updated',
            });

            expect(updated?.name).toBe('Updated');
            expect(updated?.url).toBe('https://example.com/updated');
            expect(updated?.events).toEqual(['user.created']); // Unchanged
        });

        it('returns null when updating non-existent webhook', () => {
            const result = webhookService.updateWebhook('non-existent', {
                name: 'Updated',
            });

            expect(result).toBeNull();
        });

        it('deletes webhook', () => {
            const webhook = webhookService.registerWebhook({
                name: 'To Delete',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            const deleted = webhookService.deleteWebhook(webhook.id);

            expect(deleted).toBe(true);
            expect(webhookService.getWebhook(webhook.id)).toBeUndefined();
        });

        it('returns false when deleting non-existent webhook', () => {
            const result = webhookService.deleteWebhook('non-existent');
            expect(result).toBe(false);
        });

        it('gets webhook by id', () => {
            const webhook = webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            const retrieved = webhookService.getWebhook(webhook.id);

            expect(retrieved?.id).toBe(webhook.id);
            expect(retrieved?.name).toBe('Test');
        });

        it('returns undefined for non-existent webhook', () => {
            const result = webhookService.getWebhook('non-existent');
            expect(result).toBeUndefined();
        });

        it('gets all webhooks', () => {
            webhookService.registerWebhook({
                name: 'Webhook 1',
                url: 'https://example.com/1',
                events: ['user.created'],
                active: true,
            });

            webhookService.registerWebhook({
                name: 'Webhook 2',
                url: 'https://example.com/2',
                events: ['quiz.passed'],
                active: false,
            });

            const webhooks = webhookService.getWebhooks();

            expect(webhooks).toHaveLength(2);
        });
    });

    describe('Webhook Triggering', () => {
        beforeEach(() => {
            global.fetch = vi.fn();
        });

        it('triggers webhook for event', async () => {
            (fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
            });

            webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            await webhookService.trigger('user.created', {
                userId: '123',
                email: 'test@example.com',
            });

            expect(fetch).toHaveBeenCalled();
            const fetchCall = (fetch as any).mock.calls[0];
            expect(fetchCall[0]).toBe('https://example.com/webhook');
        });

        it('does not trigger inactive webhooks', async () => {
            webhookService.registerWebhook({
                name: 'Inactive',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: false,
            });

            await webhookService.trigger('user.created', {});

            expect(fetch).not.toHaveBeenCalled();
        });

        it('handles webhook failure', async () => {
            (fetch as any).mockRejectedValue(new Error('Network error'));

            webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            // Should not throw
            await expect(webhookService.trigger('user.created', {})).resolves.not.toThrow();
        });

        it('includes signature when secret is set', async () => {
            (fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
            });

            webhookService.registerWebhook({
                name: 'Secure',
                url: 'https://example.com/webhook',
                secret: 'my-secret',
                events: ['user.created'],
                active: true,
            });

            await webhookService.trigger('user.created', { test: 'data' });

            const fetchCall = (fetch as any).mock.calls[0];
            const headers = fetchCall[1].headers;

            expect(headers['X-Webhook-Signature']).toBeDefined();
        });

        it('includes event type in headers', async () => {
            (fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
            });

            webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['quiz.passed'],
                active: true,
            });

            await webhookService.trigger('quiz.passed', { score: 85 });

            const fetchCall = (fetch as any).mock.calls[0];
            const headers = fetchCall[1].headers;

            expect(headers['X-Webhook-Event']).toBe('quiz.passed');
        });
    });

    describe('Webhook Logs', () => {
        it('logs successful webhook calls', async () => {
            (fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
            });

            const webhook = webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            await webhookService.trigger('user.created', {});

            const logs = webhookService.getLogs(webhook.id);
            expect(logs).toHaveLength(1);
            expect(logs[0]!.event).toBe('user.created');
            expect(logs[0]!.status).toBe('success');
            expect(logs[0]!.statusCode).toBe(200);
        });

        it('logs failed webhook calls', async () => {
            (fetch as any).mockRejectedValue(new Error('Failed'));

            const webhook = webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            await webhookService.trigger('user.created', {});

            const logs = webhookService.getLogs(webhook.id);
            expect(logs).toHaveLength(1);
            expect(logs[0]!.status).toBe('failed');
        });

        it('gets all logs when no webhookId provided', async () => {
            (fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
            });

            webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            await webhookService.trigger('user.created', {});
            await webhookService.trigger('user.created', {});

            const allLogs = webhookService.getLogs();
            expect(allLogs).toHaveLength(2);
        });
    });

    describe('Test Webhook', () => {
        it('tests webhook successfully', async () => {
            (fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
            });

            const webhook = webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            const result = await webhookService.testWebhook(webhook.id);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Webhook test successful');
        });

        it('returns error for non-existent webhook', async () => {
            const result = await webhookService.testWebhook('non-existent');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Webhook not found');
        });

        it('returns error message on test failure', async () => {
            (fetch as any).mockRejectedValue(new Error('Connection refused'));

            const webhook = webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            const result = await webhookService.testWebhook(webhook.id);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Connection refused');
        });

        it('returns HTTP status on non-ok response', async () => {
            (fetch as any).mockResolvedValue({
                ok: false,
                status: 404,
            });

            const webhook = webhookService.registerWebhook({
                name: 'Test',
                url: 'https://example.com/webhook',
                events: ['user.created'],
                active: true,
            });

            const result = await webhookService.testWebhook(webhook.id);

            expect(result.success).toBe(false);
            expect(result.message).toBe('HTTP 404');
        });
    });

    describe('Retry Failed', () => {
        it('returns count of retried webhooks', async () => {
            const result = await webhookService.retryFailed();
            expect(typeof result).toBe('number');
        });
    });
});
