/**
 * Mentorship Database Operations
 * 
 * Connects learners with certified mentors
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { BeltLevel } from '../../types';

interface MentorshipDBSchema extends DBSchema {
    mentorProfiles: {
        key: string;
        value: {
            id: string;
            userId: string;
            name: string;
            certifications: string[];
            expertise: string[];
            industry: string;
            yearsExperience: number;
            bio: string;
            availability: 'high' | 'medium' | 'low';
            maxMentees: number;
            currentMentees: number;
            rating: number;
            reviewCount: number;
            createdAt: Date;
        };
        indexes: {
            'by-user': string;
        };
    };
    mentorships: {
        key: string;
        value: {
            id: string;
            menteeId: string;
            mentorId: string;
            status: 'pending' | 'active' | 'completed' | 'cancelled';
            startedAt?: Date;
            endedAt?: Date;
            goals: string[];
            notes: string;
        };
        indexes: {
            'by-mentee': string;
            'by-mentor': string;
        };
    };
    mentorshipMessages: {
        key: string;
        value: {
            id: string;
            mentorshipId: string;
            senderId: string;
            content: string;
            timestamp: Date;
        };
        indexes: {
            'by-mentorship': string;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<MentorshipDBSchema> | null = null;

export async function getMentorshipDB(): Promise<IDBPDatabase<MentorshipDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<MentorshipDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('mentorProfiles')) {
                const store = db.createObjectStore('mentorProfiles', { keyPath: 'id' });
                store.createIndex('by-user', 'userId');
            }
            if (!db.objectStoreNames.contains('mentorships')) {
                const store = db.createObjectStore('mentorships', { keyPath: 'id' });
                store.createIndex('by-mentee', 'menteeId');
                store.createIndex('by-mentor', 'mentorId');
            }
            if (!db.objectStoreNames.contains('mentorshipMessages')) {
                const store = db.createObjectStore('mentorshipMessages', { keyPath: 'id' });
                store.createIndex('by-mentorship', 'mentorshipId');
            }
        },
    });

    return dbInstance;
}

// ============================================
// Mentor Profiles
// ============================================

export async function createMentorProfile(
    userId: string,
    data: {
        name: string;
        certifications: string[];
        expertise: string[];
        industry: string;
        yearsExperience: number;
        bio: string;
        availability: 'high' | 'medium' | 'low';
        maxMentees: number;
    }
): Promise<void> {
    const db = await getMentorshipDB();
    
    await db.put('mentorProfiles', {
        id: `mentor-${Date.now()}`,
        userId,
        name: data.name,
        certifications: data.certifications,
        expertise: data.expertise,
        industry: data.industry,
        yearsExperience: data.yearsExperience,
        bio: data.bio,
        availability: data.availability,
        maxMentees: data.maxMentees,
        currentMentees: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
    });
}

export async function getMentorProfile(userId: string) {
    const db = await getMentorshipDB();
    const index = db.transaction('mentorProfiles').store.index('by-user');
    return await index.get(userId);
}

export async function getAllMentors() {
    const db = await getMentorshipDB();
    return await db.getAll('mentorProfiles');
}

// ============================================
// Mentorship Matching
// ============================================

export interface MatchScore {
    mentorId: string;
    score: number;
    reasons: string[];
}

export async function findMentorMatches(
    menteeId: string,
    preferences: {
        targetBelt: BeltLevel;
        industry?: string;
        expertise?: string[];
    }
): Promise<MatchScore[]> {
    const db = await getMentorshipDB();
    const mentors = await db.getAll('mentorProfiles');
    
    // Get existing mentorships to filter out already connected mentors
    const mentorshipIndex = db.transaction('mentorships').store.index('by-mentee');
    const existingMentorships = await mentorshipIndex.getAll(menteeId);
    const existingMentorIds = new Set(existingMentorships.map(m => m.mentorId));
    
    const matches: MatchScore[] = [];
    
    for (const mentor of mentors) {
        // Skip if already mentoring this user or at capacity
        if (existingMentorIds.has(mentor.userId)) continue;
        if (mentor.currentMentees >= mentor.maxMentees) continue;
        
        let score = 0;
        const reasons: string[] = [];
        
        // Check belt level compatibility
        if (mentor.certifications.includes('Black Belt')) {
            score += 30;
            reasons.push('Certified Black Belt');
        } else if (mentor.certifications.includes('Green Belt')) {
            score += 20;
            reasons.push('Certified Green Belt');
        }
        
        // Check industry match
        if (preferences.industry && mentor.industry === preferences.industry) {
            score += 25;
            reasons.push(`Works in ${mentor.industry}`);
        }
        
        // Check expertise overlap
        if (preferences.expertise) {
            const overlap = mentor.expertise.filter(e => 
                preferences.expertise?.some(pe => e.toLowerCase().includes(pe.toLowerCase()))
            );
            if (overlap.length > 0) {
                score += overlap.length * 10;
                reasons.push(`Expertise in ${overlap[0]}`);
            }
        }
        
        // Experience bonus
        if (mentor.yearsExperience >= 5) {
            score += 15;
            reasons.push(`${mentor.yearsExperience} years experience`);
        }
        
        // Availability bonus
        if (mentor.availability === 'high') {
            score += 10;
            reasons.push('High availability');
        }
        
        // Rating bonus
        if (mentor.rating >= 4.5) {
            score += 10;
            reasons.push(`⭐ ${mentor.rating} rating`);
        }
        
        if (score > 0) {
            matches.push({
                mentorId: mentor.userId,
                score,
                reasons,
            });
        }
    }
    
    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
}

// ============================================
// Mentorship Management
// ============================================

export async function requestMentorship(
    menteeId: string,
    mentorId: string,
    goals: string[]
): Promise<string> {
    const db = await getMentorshipDB();
    
    const id = `mentorship-${Date.now()}`;
    await db.put('mentorships', {
        id,
        menteeId,
        mentorId,
        status: 'pending',
        goals,
        notes: '',
    });
    
    return id;
}

export async function acceptMentorship(mentorshipId: string): Promise<void> {
    const db = await getMentorshipDB();
    const mentorship = await db.get('mentorships', mentorshipId);
    
    if (!mentorship) return;
    
    mentorship.status = 'active';
    mentorship.startedAt = new Date();
    
    await db.put('mentorships', mentorship);
    
    // Update mentor's mentee count
    const mentorProfile = await getMentorProfile(mentorship.mentorId);
    if (mentorProfile) {
        mentorProfile.currentMentees++;
        await db.put('mentorProfiles', mentorProfile);
    }
}

export async function endMentorship(
    mentorshipId: string,
    reason?: string
): Promise<void> {
    const db = await getMentorshipDB();
    const mentorship = await db.get('mentorships', mentorshipId);
    
    if (!mentorship) return;
    
    mentorship.status = 'completed';
    mentorship.endedAt = new Date();
    if (reason) {
        mentorship.notes += `\nEnded: ${reason}`;
    }
    
    await db.put('mentorships', mentorship);
    
    // Update mentor's mentee count
    const mentorProfile = await getMentorProfile(mentorship.mentorId);
    if (mentorProfile) {
        mentorProfile.currentMentees = Math.max(0, mentorProfile.currentMentees - 1);
        await db.put('mentorProfiles', mentorProfile);
    }
}

export async function getMyMentorships(userId: string, asMentor: boolean = false) {
    const db = await getMentorshipDB();
    const indexName = asMentor ? 'by-mentor' : 'by-mentee';
    const index = db.transaction('mentorships').store.index(indexName);
    return await index.getAll(userId);
}

// ============================================
// Messaging
// ============================================

export async function sendMessage(
    mentorshipId: string,
    senderId: string,
    content: string
): Promise<void> {
    const db = await getMentorshipDB();
    
    await db.put('mentorshipMessages', {
        id: `msg-${Date.now()}`,
        mentorshipId,
        senderId,
        content,
        timestamp: new Date(),
    });
}

export async function getMessages(mentorshipId: string) {
    const db = await getMentorshipDB();
    const index = db.transaction('mentorshipMessages').store.index('by-mentorship');
    return await index.getAll(mentorshipId);
}

// ============================================
// Mock Data
// ============================================

export async function seedMentorData(): Promise<void> {
    const db = await getMentorshipDB();
    const existing = await db.getAll('mentorProfiles');
    if (existing.length > 0) return; // Already seeded
    
    const mockMentors = [
        {
            id: 'mentor-1',
            userId: 'mentor-user-1',
            name: 'Dr. Sarah Chen',
            certifications: ['Master Black Belt', 'ASQ CSSBB'],
            expertise: ['DMAIC', 'Design of Experiments', 'Lean Manufacturing'],
            industry: 'Manufacturing',
            yearsExperience: 12,
            bio: 'Former quality director at Fortune 500 company. Passionate about mentoring next generation of Black Belts.',
            availability: 'high' as const,
            maxMentees: 3,
            currentMentees: 1,
            rating: 4.9,
            reviewCount: 23,
            createdAt: new Date(),
        },
        {
            id: 'mentor-2',
            userId: 'mentor-user-2',
            name: 'Michael Rodriguez',
            certifications: ['Black Belt', 'PMP'],
            expertise: ['Process Mapping', 'Healthcare', 'Project Management'],
            industry: 'Healthcare',
            yearsExperience: 8,
            bio: 'Healthcare quality improvement specialist. Expert in applying Six Sigma to clinical processes.',
            availability: 'medium' as const,
            maxMentees: 2,
            currentMentees: 0,
            rating: 4.7,
            reviewCount: 15,
            createdAt: new Date(),
        },
        {
            id: 'mentor-3',
            userId: 'mentor-user-3',
            name: 'Jennifer Park',
            certifications: ['Black Belt', 'ITIL'],
            expertise: ['IT Service Management', 'Data Analysis', 'Agile'],
            industry: 'Technology',
            yearsExperience: 6,
            bio: 'IT consultant specializing in process automation and service delivery optimization.',
            availability: 'high' as const,
            maxMentees: 4,
            currentMentees: 2,
            rating: 4.8,
            reviewCount: 18,
            createdAt: new Date(),
        },
        {
            id: 'mentor-4',
            userId: 'mentor-user-4',
            name: 'Robert Johnson',
            certifications: ['Master Black Belt'],
            expertise: ['Supply Chain', 'Logistics', 'Change Management'],
            industry: 'Logistics',
            yearsExperience: 15,
            bio: 'Supply chain executive with global experience. Focus on end-to-end process excellence.',
            availability: 'low' as const,
            maxMentees: 2,
            currentMentees: 2,
            rating: 5.0,
            reviewCount: 31,
            createdAt: new Date(),
        },
    ];
    
    for (const mentor of mockMentors) {
        await db.put('mentorProfiles', mentor);
    }
}
