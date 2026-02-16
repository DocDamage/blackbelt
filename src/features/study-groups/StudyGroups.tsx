/**
 * Study Groups Component
 * 
 * Collaborative learning spaces for peer study
 */

import { useState, useEffect, useCallback } from 'react';
import { StudyGroup, SharedResource } from '../../utils/db.schema';
import type { BeltLevel } from '../../types';
import {
    getAllStudyGroups,
    getUserGroups,
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
} from './studyGroups.db';
import { Loading } from '../../components/common/Loading/Loading';
import './StudyGroups.css';

const USER_ID = 'current-user';
const USER_NAME = 'You';
const USER_BELT: BeltLevel = 'green'; // TODO: Get from user profile

export function StudyGroups() {
    const [groups, setGroups] = useState<StudyGroup[]>([]);
    const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'browse' | 'my-groups'>('browse');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loadGroups = useCallback(async () => {
        setLoading(true);
        try {
            const allGroups = await getAllStudyGroups();
            const userGroups = await getUserGroups(USER_ID);
            setGroups(allGroups);
            setMyGroups(userGroups);
        } catch (error) {
            console.error('Failed to load study groups:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            const newGroup = await createStudyGroup(
                USER_ID,
                USER_NAME,
                USER_BELT,
                {
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    maxMembers: parseInt(formData.get('maxMembers') as string) || 6,
                }
            );
            setGroups(prev => [newGroup, ...prev]);
            setMyGroups(prev => [newGroup, ...prev]);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };

    const handleJoinGroup = async (groupId: string) => {
        try {
            const updated = await joinStudyGroup(USER_ID, USER_NAME, USER_BELT, groupId);
            if (updated) {
                await loadGroups();
            }
        } catch (error) {
            console.error('Failed to join group:', error);
        }
    };

    const handleLeaveGroup = async (groupId: string) => {
        try {
            await leaveStudyGroup(USER_ID, groupId);
            await loadGroups();
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(null);
            }
        } catch (error) {
            console.error('Failed to leave group:', error);
        }
    };

    const isMember = (group: StudyGroup): boolean => {
        return group.members.some(m => m.userId === USER_ID);
    };

    const getInitials = (name: string): string => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(new Date(date));
    };

    if (loading) {
        return <Loading message="Loading study groups..." />;
    }

    if (selectedGroup) {
        return (
            <GroupDetail
                group={selectedGroup}
                isMember={isMember(selectedGroup)}
                onBack={() => setSelectedGroup(null)}
                onJoin={() => handleJoinGroup(selectedGroup.id)}
                onLeave={() => handleLeaveGroup(selectedGroup.id)}
                getInitials={getInitials}
                formatDate={formatDate}
            />
        );
    }

    const displayGroups = activeTab === 'browse' ? groups : myGroups;

    return (
        <div className="study-groups-container">
            <div className="study-groups-header">
                <div>
                    <h1 className="study-groups-title">Study Groups</h1>
                    <p className="study-groups-subtitle">Learn together with peers on the same journey</p>
                </div>
                <button
                    className="study-groups-create-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Create Group
                </button>
            </div>

            <div className="study-groups-tabs">
                <button
                    className={`study-groups-tab ${activeTab === 'browse' ? 'active' : ''}`}
                    onClick={() => setActiveTab('browse')}
                >
                    Browse Groups
                </button>
                <button
                    className={`study-groups-tab ${activeTab === 'my-groups' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-groups')}
                >
                    My Groups ({myGroups.length})
                </button>
            </div>

            {displayGroups.length === 0 ? (
                <div className="study-groups-empty">
                    <div className="study-groups-empty-icon">👥</div>
                    <h3>{activeTab === 'browse' ? 'No groups yet' : 'You haven\'t joined any groups'}</h3>
                    <p>
                        {activeTab === 'browse'
                            ? 'Be the first to create a study group!'
                            : 'Browse available groups and join one to start collaborating.'}
                    </p>
                    {activeTab === 'my-groups' && (
                        <button
                            className="study-groups-create-btn"
                            onClick={() => setActiveTab('browse')}
                        >
                            Browse Groups
                        </button>
                    )}
                </div>
            ) : (
                <div className="study-groups-grid">
                    {displayGroups.map(group => (
                        <div
                            key={group.id}
                            className="study-group-card"
                            onClick={() => setSelectedGroup(group)}
                        >
                            <div className="study-group-header">
                                <div>
                                    <h3 className="study-group-name">{group.name}</h3>
                                    <span className="study-group-members-count">
                                        {group.members.length} / {group.maxMembers} members
                                    </span>
                                </div>
                                <div className="study-group-avatar-stack">
                                    {group.members.slice(0, 3).map((member, idx) => (
                                        <div
                                            key={member.id}
                                            className="study-group-avatar"
                                            style={{ zIndex: 3 - idx }}
                                        >
                                            {getInitials(member.name)}
                                        </div>
                                    ))}
                                    {group.members.length > 3 && (
                                        <div className="study-group-more">
                                            +{group.members.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="study-group-description">{group.description}</p>
                            <div className="study-group-footer">
                                <span className="study-group-created">
                                    Created {formatDate(group.createdAt)}
                                </span>
                                <button
                                    className="study-group-join-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        isMember(group)
                                            ? setSelectedGroup(group)
                                            : handleJoinGroup(group.id);
                                    }}
                                    disabled={!isMember(group) && group.members.length >= group.maxMembers}
                                >
                                    {isMember(group) ? 'View' : 'Join'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <div className="study-group-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="study-group-modal" onClick={e => e.stopPropagation()}>
                        <h2>Create Study Group</h2>
                        <form onSubmit={handleCreateGroup}>
                            <div className="study-group-form-group">
                                <label>Group Name</label>
                                <input name="name" required placeholder="e.g., Black Belt Study Squad" />
                            </div>
                            <div className="study-group-form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="What will your group focus on?"
                                />
                            </div>
                            <div className="study-group-form-group">
                                <label>Max Members</label>
                                <select name="maxMembers" defaultValue="6">
                                    <option value="4">4 members</option>
                                    <option value="6">6 members</option>
                                    <option value="8">8 members</option>
                                    <option value="10">10 members</option>
                                </select>
                            </div>
                            <div className="study-group-modal-actions">
                                <button
                                    type="button"
                                    className="study-group-btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="study-group-btn-primary">
                                    Create Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Group Detail Component
interface GroupDetailProps {
    group: StudyGroup;
    isMember: boolean;
    onBack: () => void;
    onJoin: () => void;
    onLeave: () => void;
    getInitials: (name: string) => string;
    formatDate: (date: Date) => string;
}

function GroupDetail({
    group,
    isMember,
    onBack,
    onJoin,
    onLeave,
    getInitials,
    formatDate,
}: GroupDetailProps) {
    const [resources, setResources] = useState<SharedResource[]>([]);

    useEffect(() => {
        // Load resources
        setResources(group.sharedResources || []);
    }, [group]);

    return (
        <div className="study-groups-container">
            <div className="study-group-detail">
                <div className="study-group-detail-header">
                    <button className="study-group-detail-back" onClick={onBack}>
                        ← Back to Groups
                    </button>
                    <h1 className="study-group-detail-name">{group.name}</h1>
                    <p className="study-group-detail-desc">{group.description}</p>
                </div>

                <div className="study-group-detail-content">
                    {/* Members Section */}
                    <div className="study-group-section">
                        <h3>Members ({group.members.length}/{group.maxMembers})</h3>
                        <div className="study-group-members-list">
                            {group.members.map(member => (
                                <div key={member.id} className="study-group-member">
                                    <div className="study-group-member-avatar">
                                        {getInitials(member.name)}
                                    </div>
                                    <div className="study-group-member-info">
                                        <div className="study-group-member-name">
                                            {member.name}
                                            {member.userId === USER_ID && ' (You)'}
                                        </div>
                                        <div className="study-group-member-role">
                                            {member.role} • Joined {formatDate(member.joinedAt)}
                                        </div>
                                    </div>
                                    <span className="study-group-member-belt">
                                        {member.beltLevel} Belt
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shared Resources */}
                    <div className="study-group-section">
                        <h3>Shared Resources</h3>
                        {resources.length === 0 ? (
                            <p>No resources shared yet.</p>
                        ) : (
                            <div className="study-group-resources-list">
                                {resources.map(resource => (
                                    <div key={resource.id} className="study-group-resource">
                                        <span className="study-group-resource-icon">
                                            {resource.type === 'flashcards' && '🗂️'}
                                            {resource.type === 'notes' && '📝'}
                                            {resource.type === 'quiz' && '❓'}
                                            {resource.type === 'link' && '🔗'}
                                        </span>
                                        <div className="study-group-resource-content">
                                            <div className="study-group-resource-title">
                                                {resource.title}
                                            </div>
                                            <div className="study-group-resource-meta">
                                                Shared by {resource.sharedBy} • {formatDate(resource.sharedAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {!isMember ? (
                        <button
                            className="study-groups-create-btn"
                            onClick={onJoin}
                            disabled={group.members.length >= group.maxMembers}
                        >
                            Join Group
                        </button>
                    ) : (
                        <button
                            className="study-group-btn-secondary"
                            onClick={onLeave}
                            style={{ color: '#ef4444' }}
                        >
                            Leave Group
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudyGroups;
