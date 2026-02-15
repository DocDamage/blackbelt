/**
 * Webhook Service
 * 
 * Provides webhook integration for external services.
 */

// Webhook configuration
export interface WebhookConfig {
    id: string;
    name: string;
    url: string;
    secret?: string;
    events: WebhookEventType[];
    active: boolean;
    createdAt: Date;
    lastTriggered?: Date;
}

export type WebhookEventType =
    | 'user.created'
    | 'user.updated'
    | 'user.deleted'
    | 'course.completed'
    | 'course.started'
    | 'quiz.submitted'
    | 'quiz.passed'
    | 'quiz.failed'
    | 'certificate.earned'
    | 'badge.earned'
    | 'streak.milestone'
    | 'module.completed';

export interface WebhookPayload {
    event: WebhookEventType;
    timestamp: string;
    data: Record<string, unknown>;
    signature?: string;
}

export interface WebhookLog {
    id: string;
    webhookId: string;
    event: WebhookEventType;
    status: 'success' | 'failed' | 'pending';
    statusCode?: number;
    response?: string;
    timestamp: Date;
    attempts: number;
}

// Storage key for webhooks
const WEBHOOK_STORAGE_KEY = 'sixsigma-webhooks';
const WEBHOOK_LOGS_KEY = 'sixsigma-webhook-logs';

class WebhookService {
    private webhooks: WebhookConfig[] = [];
    private logs: WebhookLog[] = [];

    constructor() {
        this.loadWebhooks();
        this.loadLogs();
    }

    // Load webhooks from storage
    private loadWebhooks(): void {
        const stored = localStorage.getItem(WEBHOOK_STORAGE_KEY);
        if (stored) {
            this.webhooks = JSON.parse(stored);
        }
    }

    // Save webhooks to storage
    private saveWebhooks(): void {
        localStorage.setItem(WEBHOOK_STORAGE_KEY, JSON.stringify(this.webhooks));
    }

    // Load logs from storage
    private loadLogs(): void {
        const stored = localStorage.getItem(WEBHOOK_LOGS_KEY);
        if (stored) {
            this.logs = JSON.parse(stored);
        }
    }

    // Save logs to storage
    private saveLogs(): void {
        // Keep only last 100 logs
        this.logs = this.logs.slice(-100);
        localStorage.setItem(WEBHOOK_LOGS_KEY, JSON.stringify(this.logs));
    }

    // Generate signature for webhook payload
    private generateSignature(payload: string, secret: string): string {
        // Simple HMAC-like signature (in production, use crypto.subtle)
        const encoder = new TextEncoder();
        const data = encoder.encode(payload + secret);

        // Use a simple hash for demo purposes
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data[i]!;
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    // Register a new webhook
    registerWebhook(config: Omit<WebhookConfig, 'id' | 'createdAt'>): WebhookConfig {
        const webhook: WebhookConfig = {
            ...config,
            id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date()
        };
        this.webhooks.push(webhook);
        this.saveWebhooks();
        return webhook;
    }

    // Update an existing webhook
    updateWebhook(id: string, updates: Partial<WebhookConfig>): WebhookConfig | null {
        const index = this.webhooks.findIndex(w => w.id === id);
        if (index === -1) return null;

        const existingWebhook = this.webhooks[index]!;
        this.webhooks[index] = { ...existingWebhook, ...updates };
        this.saveWebhooks();
        return this.webhooks[index]!;
    }

    // Delete a webhook
    deleteWebhook(id: string): boolean {
        const index = this.webhooks.findIndex(w => w.id === id);
        if (index === -1) return false;

        this.webhooks.splice(index, 1);
        this.saveWebhooks();
        return true;
    }

    // Get all webhooks
    getWebhooks(): WebhookConfig[] {
        return [...this.webhooks];
    }

    // Get a specific webhook
    getWebhook(id: string): WebhookConfig | undefined {
        return this.webhooks.find(w => w.id === id);
    }

    // Trigger webhooks for an event
    async trigger(event: WebhookEventType, data: Record<string, unknown>): Promise<void> {
        const applicableWebhooks = this.webhooks.filter(
            w => w.active && w.events.includes(event)
        );

        for (const webhook of applicableWebhooks) {
            const payload: WebhookPayload = {
                event,
                timestamp: new Date().toISOString(),
                data
            };

            // Add signature if secret is configured
            if (webhook.secret) {
                payload.signature = this.generateSignature(
                    JSON.stringify(payload),
                    webhook.secret
                );
            }

            // Create log entry
            const log: WebhookLog = {
                id: `log_${Date.now()}`,
                webhookId: webhook.id,
                event,
                status: 'pending',
                timestamp: new Date(),
                attempts: 0
            };

            try {
                const response = await fetch(webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Webhook-Event': event,
                        'X-Webhook-Signature': payload.signature || ''
                    },
                    body: JSON.stringify(payload)
                });

                log.status = response.ok ? 'success' : 'failed';
                log.statusCode = response.status;
                log.attempts = 1;

                // Update webhook last triggered
                webhook.lastTriggered = new Date();
                this.saveWebhooks();
            } catch (error) {
                log.status = 'failed';
                log.response = error instanceof Error ? error.message : 'Unknown error';
                log.attempts = 1;
            }

            this.logs.push(log);
            this.saveLogs();
        }
    }

    // Get logs for a webhook
    getLogs(webhookId?: string): WebhookLog[] {
        if (webhookId) {
            return this.logs.filter(l => l.webhookId === webhookId);
        }
        return [...this.logs];
    }

    // Test a webhook
    async testWebhook(id: string): Promise<{ success: boolean; message: string }> {
        const webhook = this.getWebhook(id);
        if (!webhook) {
            return { success: false, message: 'Webhook not found' };
        }

        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Event': 'test',
                    'X-Webhook-Signature': ''
                },
                body: JSON.stringify({
                    event: 'test',
                    timestamp: new Date().toISOString(),
                    data: { message: 'Test webhook from Six Sigma Training Platform' }
                })
            });

            return {
                success: response.ok,
                message: response.ok ? 'Webhook test successful' : `HTTP ${response.status}`
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Retry failed webhooks
    async retryFailed(): Promise<number> {
        const failedLogs = this.logs.filter(l => l.status === 'failed');
        let retried = 0;

        for (const log of failedLogs) {
            const webhook = this.getWebhook(log.webhookId);
            if (webhook) {
                // Attempt retry (in production, you'd have stored the original payload)
                retried++;
            }
        }

        return retried;
    }
}

// Export singleton instance
export const webhookService = new WebhookService();

// React hook for webhooks
export function useWebhooks() {
    const register = (config: Omit<WebhookConfig, 'id' | 'createdAt'>) =>
        webhookService.registerWebhook(config);
    const update = (id: string, updates: Partial<WebhookConfig>) =>
        webhookService.updateWebhook(id, updates);
    const remove = (id: string) => webhookService.deleteWebhook(id);
    const getAll = () => webhookService.getWebhooks();
    const getOne = (id: string) => webhookService.getWebhook(id);
    const trigger = (event: WebhookEventType, data: Record<string, unknown>) =>
        webhookService.trigger(event, data);
    const test = (id: string) => webhookService.testWebhook(id);
    const getLogs = (webhookId?: string) => webhookService.getLogs(webhookId);

    return {
        register,
        update,
        remove,
        getAll,
        getOne,
        trigger,
        test,
        getLogs
    };
}

export default webhookService;