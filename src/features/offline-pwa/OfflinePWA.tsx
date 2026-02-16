/**
 * Offline PWA Component
 * 
 * Manage downloads and offline content
 */

import { useState, useEffect, useCallback } from 'react';
import {
    queueContentForDownload,
    startDownload,
    getDownloadedContent,
    removeDownloadedContent,
    processOfflineQueue,
    getStorageStats,
    isOnline,
    addNetworkListeners,
    registerServiceWorker,
    StorageStats,
} from './offlineManager';
import { Loading } from '../../components/common/Loading/Loading';
import './OfflinePWA.css';

const USER_ID = 'current-user';

// Mock available content for download
const AVAILABLE_CONTENT = [
    {
        id: 'lesson-1',
        type: 'lesson' as const,
        title: 'DMAIC Overview - Complete Course',
        url: '/content/dmaic-overview',
        estimatedSize: 15 * 1024 * 1024, // 15 MB
    },
    {
        id: 'lesson-2',
        type: 'lesson' as const,
        title: 'Statistical Process Control',
        url: '/content/spc',
        estimatedSize: 25 * 1024 * 1024, // 25 MB
    },
    {
        id: 'lesson-3',
        type: 'lesson' as const,
        title: 'Hypothesis Testing Masterclass',
        url: '/content/hypothesis-testing',
        estimatedSize: 30 * 1024 * 1024, // 30 MB
    },
    {
        id: 'quiz-1',
        type: 'quiz' as const,
        title: 'Black Belt Practice Exam A',
        url: '/quiz/practice-a',
        estimatedSize: 2 * 1024 * 1024, // 2 MB
    },
    {
        id: 'quiz-2',
        type: 'quiz' as const,
        title: 'Black Belt Practice Exam B',
        url: '/quiz/practice-b',
        estimatedSize: 2 * 1024 * 1024, // 2 MB
    },
];

export function OfflinePWA() {
    const [downloadedContent, setDownloadedContent] = useState<any[]>([]);
    const [stats, setStats] = useState<StorageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(!isOnline());
    const [swRegistered, setSwRegistered] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [activeTab, setActiveTab] = useState<'downloads' | 'available'>('downloads');

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const content = await getDownloadedContent(USER_ID);
            const storageStats = await getStorageStats(USER_ID);
            setDownloadedContent(content);
            setStats(storageStats);
        } catch (error) {
            console.error('Failed to load offline data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        
        // Set up network status listeners
        const cleanup = addNetworkListeners(
            () => {
                setIsOffline(false);
                // Auto-sync when coming back online
                handleSync();
            },
            () => setIsOffline(true)
        );
        
        return cleanup;
    }, [loadData]);

    const handleRegisterSW = async () => {
        const result = await registerServiceWorker();
        setSwRegistered(result);
    };

    const handleDownload = async (content: typeof AVAILABLE_CONTENT[0]) => {
        try {
            await queueContentForDownload(USER_ID, content);
            await loadData();
            await startDownload(content.id);
            await loadData();
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleRemove = async (contentId: string) => {
        try {
            await removeDownloadedContent(contentId);
            await loadData();
        } catch (error) {
            console.error('Failed to remove content:', error);
        }
    };

    const handleSync = async () => {
        if (!isOnline()) return;
        
        setSyncing(true);
        try {
            const result = await processOfflineQueue(USER_ID);
            if (result.success > 0) {
                alert(`Synced ${result.success} items!`);
            }
            await loadData();
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setSyncing(false);
        }
    };

    const formatSize = (bytes: number): string => {
        const mb = bytes / (1024 * 1024);
        if (mb < 1) return `${Math.round(bytes / 1024)} KB`;
        return `${Math.round(mb * 10) / 10} MB`;
    };

    const getStatusIcon = (status: string): string => {
        switch (status) {
            case 'completed': return '✅';
            case 'downloading': return '⬇️';
            case 'pending': return '⏳';
            case 'failed': return '❌';
            default: return '📦';
        }
    };

    if (loading) {
        return <Loading message="Loading offline content..." />;
    }

    const availableToDownload = AVAILABLE_CONTENT.filter(
        content => !downloadedContent.some(d => d.id === content.id)
    );

    return (
        <div className="offline-container">
            <div className="offline-header">
                <h1 className="offline-title">📱 Offline Mode</h1>
                <p className="offline-subtitle">Download content to study without internet</p>
            </div>

            {/* Status Bar */}
            <div className={`offline-status ${isOffline ? 'offline' : 'online'}`}>
                <div className="offline-status-indicator">
                    {isOffline ? '🔴 Offline' : '🟢 Online'}
                </div>
                {!swRegistered && (
                    <button className="offline-btn-primary" onClick={handleRegisterSW}>
                        Enable Offline Mode
                    </button>
                )}
                {stats && stats.queueLength > 0 && !isOffline && (
                    <button
                        className="offline-btn-primary"
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        {syncing ? 'Syncing...' : `Sync ${stats.queueLength} pending`}
                    </button>
                )}
            </div>

            {/* Storage Stats */}
            {stats && (
                <div className="offline-stats">
                    <div className="offline-stat-card">
                        <span className="offline-stat-value">{stats.completedItems}</span>
                        <span className="offline-stat-label">Downloaded</span>
                    </div>
                    <div className="offline-stat-card">
                        <span className="offline-stat-value">{formatSize(stats.estimatedStorageUsed * 1024 * 1024)}</span>
                        <span className="offline-stat-label">Storage Used</span>
                    </div>
                    <div className="offline-stat-card">
                        <span className="offline-stat-value">{stats.queueLength}</span>
                        <span className="offline-stat-label">Pending Sync</span>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="offline-tabs">
                <button
                    className={`offline-tab ${activeTab === 'downloads' ? 'active' : ''}`}
                    onClick={() => setActiveTab('downloads')}
                >
                    My Downloads ({downloadedContent.length})
                </button>
                <button
                    className={`offline-tab ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    Available ({availableToDownload.length})
                </button>
            </div>

            {/* Downloads List */}
            {activeTab === 'downloads' && (
                <div className="offline-content-list">
                    {downloadedContent.length === 0 ? (
                        <div className="offline-empty">
                            <p>No downloads yet.</p>
                            <button
                                className="offline-btn-primary"
                                        onClick={() => setActiveTab('available')}
                            >
                                Browse Available Content
                            </button>
                        </div>
                    ) : (
                        downloadedContent.map(item => (
                            <div key={item.id} className="offline-content-item">
                                <span className="offline-content-icon">
                                    {getStatusIcon(item.downloadStatus)}
                                </span>
                                <div className="offline-content-info">
                                    <h4 className="offline-content-title">{item.title}</h4>
                                    <div className="offline-content-meta">
                                        <span>{item.type}</span>
                                        {item.fileSize && (
                                            <span>{formatSize(item.fileSize)}</span>
                                        )}
                                        {item.downloadStatus === 'downloading' && (
                                            <span>{item.downloadProgress}%</span>
                                        )}
                                    </div>
                                    {item.downloadStatus === 'downloading' && (
                                        <div className="offline-progress-bar">
                                            <div
                                                className="offline-progress-fill"
                                                style={{ width: `${item.downloadProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {item.downloadStatus === 'completed' && (
                                    <button
                                        className="offline-btn-remove"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Available Content */}
            {activeTab === 'available' && (
                <div className="offline-content-list">
                    {availableToDownload.length === 0 ? (
                        <div className="offline-empty">
                            <p>All available content has been downloaded!</p>
                        </div>
                    ) : (
                        availableToDownload.map(content => (
                            <div key={content.id} className="offline-content-item">
                                <span className="offline-content-icon">📦</span>
                                <div className="offline-content-info">
                                    <h4 className="offline-content-title">{content.title}</h4>
                                    <div className="offline-content-meta">
                                        <span>{content.type}</span>
                                        <span>{formatSize(content.estimatedSize || 0)}</span>
                                    </div>
                                </div>
                                <button
                                    className="offline-btn-download"
                                    onClick={() => handleDownload(content)}
                                    disabled={!isOnline()}
                                >
                                    Download
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default OfflinePWA;
