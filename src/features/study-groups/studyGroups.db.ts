/**
 * Study Groups Database Operations
 * 
 * Collaborative learning spaces for peer study
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { StudyGroup, SharedResource } from '../../utils/db.schema';
import type { BeltLevel } from '../../types';

interface StudyGroupsDBSchema extends DBSchema {
    studyGroups: {
        key: string;
        value: StudyGroup;
        indexes: {
            'by-creator': string;
        };
    };
    groupMemberships: {
        key: string;
        value: {
            id: string;
            userId: string;
            groupId: string;
            joinedAt: Date;
            role: 'admin' | 'member';
        };
        indexes: {
            'by-user': string;
            'by-group': string;
        };
    };
    sharedResources: {
        key: string;
        value: SharedResource & { groupId: string };
        indexes: {
            'by-group': string;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<StudyGroupsDBSchema> | null = null;

export async function getStudyGroupsDB(): Promise<IDBPDatabase<StudyGroupsDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<StudyGroupsDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('studyGroups')) {
                const groupStore = db.createObjectStore('studyGroups', { keyPath: 'id' });
                groupStore.createIndex('by-creator', 'createdBy');
            }
            if (!db.objectStoreNames.contains('groupMemberships')) {
                const memberStore = db.createObjectStore('groupMemberships', { keyPath: 'id' });
                memberStore.createIndex('by-user', 'userId');
                memberStore.createIndex('by-group', 'groupId');
            }
            if (!db.objectStoreNames.contains('sharedResources')) {
                const resourceStore = db.createObjectStore('sharedResources', { keyPath: 'id' });
                resourceStore.createIndex('by-group', 'groupId');
            }
        },
    });

    return dbInstance;
}

// ============================================
// Group Management
// ============================================

export async function createStudyGroup(
    creatorId: string,
    creatorName: string,
    creatorBelt: BeltLevel,
    data: {
        name: string;
        description: string;
        maxMembers: number;
    }
): Promise<StudyGroup> {
    const db = await getStudyGroupsDB();
    
    const group: StudyGroup = {
        id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        description: data.description,
        maxMembers: data.maxMembers,
        createdBy: creatorId,
        createdAt: new Date(),
        members: [{
            id: creatorId,
            userId: creatorId,
            name: creatorName,
            beltLevel: creatorBelt,
            role: 'admin',
            joinedAt: new Date(),
        }],
        sessions: [],
        sharedResources: [],
    };
    
    await db.put('studyGroups', group);
    
    // Create membership record
    await db.put('groupMemberships', {
        id: `membership-${Date.now()}`,
        userId: creatorId,
        groupId: group.id,
        joinedAt: new Date(),
        role: 'admin',
    });
    
    return group;
}

export async function getStudyGroup(groupId: string): Promise<StudyGroup | undefined> {
    const db = await getStudyGroupsDB();
    return await db.get('studyGroups', groupId);
}

export async function getAllStudyGroups(): Promise<StudyGroup[]> {
    const db = await getStudyGroupsDB();
    return await db.getAll('studyGroups');
}

export async function getUserGroups(userId: string): Promise<StudyGroup[]> {
    const db = await getStudyGroupsDB();
    const index = db.transaction('groupMemberships').store.index('by-user');
    const memberships = await index.getAll(userId);
    
    const groups: StudyGroup[] = [];
    for (const membership of memberships) {
        const group = await getStudyGroup(membership.groupId);
        if (group) groups.push(group);
    }
    
    return groups;
}

// ============================================
// Membership
// ============================================

export async function joinStudyGroup(
    userId: string,
    userName: string,
    userBelt: BeltLevel,
    groupId: string
): Promise<StudyGroup | null> {
    const db = await getStudyGroupsDB();
    const group = await getStudyGroup(groupId);
    
    if (!group) return null;
    if (group.members.length >= group.maxMembers) return null;
    if (group.members.some(m => m.userId === userId)) return group; // Already member
    
    // Add member
    group.members.push({
        id: userId,
        userId,
        name: userName,
        beltLevel: userBelt,
        role: 'member',
        joinedAt: new Date(),
    });
    
    await db.put('studyGroups', group);
    
    // Create membership record
    await db.put('groupMemberships', {
        id: `membership-${Date.now()}`,
        userId,
        groupId,
        joinedAt: new Date(),
        role: 'member',
    });
    
    return group;
}

export async function leaveStudyGroup(userId: string, groupId: string): Promise<void> {
    const db = await getStudyGroupsDB();
    const group = await getStudyGroup(groupId);
    
    if (!group) return;
    
    // Remove member
    group.members = group.members.filter(m => m.userId !== userId);
    await db.put('studyGroups', group);
    
    // Remove membership record
    const index = db.transaction('groupMemberships').store.index('by-user');
    const memberships = await index.getAll(userId);
    const membership = memberships.find(m => m.groupId === groupId);
    if (membership) {
        await db.delete('groupMemberships', membership.id);
    }
}

// ============================================
// Shared Resources
// ============================================

export async function shareResource(
    groupId: string,
    userId: string,
    resource: Omit<SharedResource, 'id' | 'sharedAt'>
): Promise<void> {
    const db = await getStudyGroupsDB();
    const group = await getStudyGroup(groupId);
    
    if (!group) return;
    
    const newResource: SharedResource & { groupId: string } = {
        id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        groupId,
        ...resource,
        sharedBy: userId,
        sharedAt: new Date(),
    };
    
    await db.put('sharedResources', newResource);
    
    // Update group's resource list
    group.sharedResources.push({
        id: newResource.id,
        type: resource.type,
        title: resource.title,
        content: resource.content,
        sharedBy: userId,
        sharedAt: new Date(),
    });
    await db.put('studyGroups', group);
}

export async function getGroupResources(groupId: string): Promise<SharedResource[]> {
    const db = await getStudyGroupsDB();
    const index = db.transaction('sharedResources').store.index('by-group');
    const resources = await index.getAll(groupId);
    return resources.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        content: r.content,
        sharedBy: r.sharedBy,
        sharedAt: r.sharedAt,
    }));
}

// ============================================
// Study Sessions
// ============================================

export async function startStudySession(
    groupId: string,
    lessonId: string,
    lessonTitle: string,
    userId: string
): Promise<void> {
    const db = await getStudyGroupsDB();
    const group = await getStudyGroup(groupId);
    
    if (!group) return;
    
    group.sessions.push({
        id: `session-${Date.now()}`,
        lessonId,
        lessonTitle,
        startedAt: new Date(),
        participants: [userId],
        isSyncPlayback: true,
    });
    
    await db.put('studyGroups', group);
}

export async function joinStudySession(
    groupId: string,
    sessionId: string,
    userId: string
): Promise<void> {
    const db = await getStudyGroupsDB();
    const group = await getStudyGroup(groupId);
    
    if (!group) return;
    
    const session = group.sessions.find(s => s.id === sessionId);
    if (session && !session.participants.includes(userId)) {
        session.participants.push(userId);
        await db.put('studyGroups', group);
    }
}
