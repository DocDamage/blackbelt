/**
 * Offline PWA Manager
 * 
 * Manages offline content downloads and sync
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineContentDBSchema extends DBSchema {
    downloadedContent: {
        key: string;
        value: {
            id: string;
            userId: string;
            type: 'video' | 'lesson' | 'quiz' | 'document';
            title: string;
            contentUrl: string;
            localData?: string; // For text content
            downloadStatus: 'pending' | 'downloading' | 'completed' | 'failed';
            downloadProgress: number;
            fileSize?: number;
            downloadedAt?: Date;
            lastAccessed: Date;
        };
        indexes: {
            'by-user': string;
            'by-status': string;
        };
    };
    offlineQueue: {
        key: string;
        value: {
            id: string;
            userId: string;
            action: 'quiz_attempt' | 'progress_update' | 'note_create';
            data: string;
            createdAt: Date;
            retryCount: number;
        };
        indexes: {
            'by-user': string;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<OfflineContentDBSchema> | null = null;

export async function getOfflineDB(): Promise<IDBPDatabase<OfflineContentDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<OfflineContentDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('downloadedContent')) {
                const store = db.createObjectStore('downloadedContent', { keyPath: 'id' });
                store.createIndex('by-user', 'userId');
                store.createIndex('by-status', 'downloadStatus');
            }
            if (!db.objectStoreNames.contains('offlineQueue')) {
                const store = db.createObjectStore('offlineQueue', { keyPath: 'id' });
                store.createIndex('by-user', 'userId');
            }
        },
    });

    return dbInstance;
}

// ============================================
// Content Download Management
// ============================================

export interface DownloadableContent {
    id: string;
    type: 'video' | 'lesson' | 'quiz' | 'document';
    title: string;
    url: string;
    estimatedSize?: number;
}

export async function queueContentForDownload(
    userId: string,
    content: DownloadableContent
): Promise<void> {
    const db = await getOfflineDB();
    
    await db.put('downloadedContent', {
        id: content.id,
        userId,
        type: content.type,
        title: content.title,
        contentUrl: content.url,
        downloadStatus: 'pending',
        downloadProgress: 0,
        fileSize: content.estimatedSize,
        lastAccessed: new Date(),
    });
}

export async function startDownload(contentId: string): Promise<void> {
    const db = await getOfflineDB();
    const content = await db.get('downloadedContent', contentId);
    
    if (!content) return;
    
    // Update status to downloading
    content.downloadStatus = 'downloading';
    await db.put('downloadedContent', content);
    
    try {
        // Simulate download with progress
        for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 500));
            content.downloadProgress = progress;
            await db.put('downloadedContent', content);
        }
        
        // Mark as completed
        content.downloadStatus = 'completed';
        content.downloadedAt = new Date();
        await db.put('downloadedContent', content);
    } catch (error) {
        content.downloadStatus = 'failed';
        await db.put('downloadedContent', content);
        throw error;
    }
}

export async function getDownloadedContent(userId: string) {
    const db = await getOfflineDB();
    const index = db.transaction('downloadedContent').store.index('by-user');
    return await index.getAll(userId);
}

export async function removeDownloadedContent(contentId: string): Promise<void> {
    const db = await getOfflineDB();
    await db.delete('downloadedContent', contentId);
}

export async function isContentDownloaded(contentId: string): Promise<boolean> {
    const db = await getOfflineDB();
    const content = await db.get('downloadedContent', contentId);
    return content?.downloadStatus === 'completed';
}

// ============================================
// Offline Queue Management
// ============================================

export async function queueOfflineAction(
    userId: string,
    action: 'quiz_attempt' | 'progress_update' | 'note_create',
    data: unknown
): Promise<void> {
    const db = await getOfflineDB();
    
    await db.put('offlineQueue', {
        id: `queue-${Date.now()}`,
        userId,
        action,
        data: JSON.stringify(data),
        createdAt: new Date(),
        retryCount: 0,
    });
}

export async function getOfflineQueue(userId: string) {
    const db = await getOfflineDB();
    const index = db.transaction('offlineQueue').store.index('by-user');
    return await index.getAll(userId);
}

export async function processOfflineQueue(userId: string): Promise<{
    success: number;
    failed: number;
}> {
    const db = await getOfflineDB();
    const queue = await getOfflineQueue(userId);
    
    let success = 0;
    let failed = 0;
    
    for (const item of queue) {
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Remove from queue on success
            await db.delete('offlineQueue', item.id);
            success++;
        } catch (error) {
            // Increment retry count
            item.retryCount++;
            if (item.retryCount > 3) {
                // Remove if max retries reached
                await db.delete('offlineQueue', item.id);
                failed++;
            } else {
                await db.put('offlineQueue', item);
            }
        }
    }
    
    return { success, failed };
}

export async function clearOfflineQueue(userId: string): Promise<void> {
    const db = await getOfflineDB();
    const queue = await getOfflineQueue(userId);
    
    for (const item of queue) {
        await db.delete('offlineQueue', item.id);
    }
}

// ============================================
// Storage Statistics
// ============================================

export interface StorageStats {
    totalItems: number;
    completedItems: number;
    pendingItems: number;
    estimatedStorageUsed: number; // in MB
    queueLength: number;
}

export async function getStorageStats(userId: string): Promise<StorageStats> {
    const content = await getDownloadedContent(userId);
    const queue = await getOfflineQueue(userId);
    
    const completedItems = content.filter(c => c.downloadStatus === 'completed');
    const pendingItems = content.filter(c => c.downloadStatus === 'pending' || c.downloadStatus === 'downloading');
    
    const estimatedStorageUsed = completedItems.reduce((total, item) => {
        return total + (item.fileSize || 0);
    }, 0) / (1024 * 1024); // Convert to MB
    
    return {
        totalItems: content.length,
        completedItems: completedItems.length,
        pendingItems: pendingItems.length,
        estimatedStorageUsed: Math.round(estimatedStorageUsed * 100) / 100,
        queueLength: queue.length,
    };
}

// ============================================
// Network Status
// ============================================

export function isOnline(): boolean {
    return navigator.onLine;
}

export function addNetworkListeners(
    onOnline: () => void,
    onOffline: () => void
): () => void {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    
    // Return cleanup function
    return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
    };
}

// ============================================
// Service Worker Registration
// ============================================

export async function registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
        console.log('Service workers not supported');
        return false;
    }
    
    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return true;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        return false;
    }
}

export async function unregisterServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false;
    
    const registration = await navigator.serviceWorker.ready;
    const result = await registration.unregister();
    return result;
}
