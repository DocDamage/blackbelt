/**
 * Mentorship Component
 * 
 * Connects learners with certified Black Belt mentors
 */

import { useState, useEffect, useCallback } from 'react';
import {
    getAllMentors,
    findMentorMatches,
    requestMentorship,
    getMyMentorships,
    seedMentorData,
} from './mentorship.db';

import { Loading } from '../../components/common/Loading/Loading';
import './Mentorship.css';

const USER_ID = 'current-user';

interface Mentor {
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
    createdAt?: Date;
}

export function Mentorship() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [matches, setMatches] = useState<{ mentor: Mentor; score: number; reasons: string[] }[]>([]);
    const [myMentorships, setMyMentorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'find' | 'my-mentors'>('find');
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [showRequestModal, setShowRequestModal] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Seed mock data if needed
            await seedMentorData();
            
            const allMentors = await getAllMentors();
            setMentors(allMentors);
            
            // Find matches
            const matchScores = await findMentorMatches(USER_ID, {
                targetBelt: 'black',
                industry: 'Manufacturing',
            });
            
            const matchedMentors = matchScores
                .map(match => {
                    const mentor = allMentors.find(m => m.userId === match.mentorId);
                    return mentor ? { mentor, score: match.score, reasons: match.reasons } : null;
                })
                .filter((m): m is NonNullable<typeof m> => m !== null);
            
            setMatches(matchedMentors);
            
            // Get my mentorships
            const myActive = await getMyMentorships(USER_ID);
            setMyMentorships(myActive);
        } catch (error) {
            console.error('Failed to load mentorship data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRequestMentorship = async (goals: string[]) => {
        if (!selectedMentor) return;
        
        try {
            await requestMentorship(USER_ID, selectedMentor.userId, goals);
            setShowRequestModal(false);
            setSelectedMentor(null);
            await loadData();
            alert('Mentorship request sent!');
        } catch (error) {
            console.error('Failed to request mentorship:', error);
        }
    };

    const getAvailabilityColor = (availability: string): string => {
        switch (availability) {
            case 'high': return '#22c55e';
            case 'medium': return '#f59e0b';
            case 'low': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getInitials = (name: string): string => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return <Loading message="Finding mentors..." />;
    }

    return (
        <div className="mentorship-container">
            <div className="mentorship-header">
                <div>
                    <h1 className="mentorship-title">Mentorship</h1>
                    <p className="mentorship-subtitle">
                        Connect with certified Black Belts for personalized guidance
                    </p>
                </div>
            </div>

            <div className="mentorship-tabs">
                <button
                    className={`mentorship-tab ${activeTab === 'find' ? 'active' : ''}`}
                    onClick={() => setActiveTab('find')}
                >
                    Find a Mentor
                </button>
                <button
                    className={`mentorship-tab ${activeTab === 'my-mentors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-mentors')}
                >
                    My Mentorships ({myMentorships.length})
                </button>
            </div>

            {activeTab === 'find' && (
                <>
                    {/* Top Matches */}
                    {matches.length > 0 && (
                        <div className="mentorship-section">
                            <h2 className="mentorship-section-title">
                                🎯 Top Matches for You
                            </h2>
                            <div className="mentorship-grid">
                                {matches.slice(0, 3).map(({ mentor, score, reasons }) => (
                                    <div
                                        key={mentor.id}
                                        className="mentor-card featured"
                                        onClick={() => setSelectedMentor(mentor)}
                                    >
                                        <div className="mentor-card-header">
                                            <div className="mentor-avatar">
                                                {getInitials(mentor.name)}
                                            </div>
                                            <div className="mentor-match-score">
                                                {score}% Match
                                            </div>
                                        </div>
                                        <h3 className="mentor-name">{mentor.name}</h3>
                                        <p className="mentor-title">
                                            {mentor.certifications.join(' • ')}
                                        </p>
                                        <div className="mentor-match-reasons">
                                            {reasons.slice(0, 3).map((reason, idx) => (
                                                <span key={idx} className="match-reason">
                                                    ✓ {reason}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mentor-meta">
                                            <span>⭐ {mentor.rating}</span>
                                            <span
                                                className="availability-badge"
                                                style={{
                                                    background: getAvailabilityColor(mentor.availability),
                                                }}
                                            >
                                                {mentor.availability} availability
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Mentors */}
                    <div className="mentorship-section">
                        <h2 className="mentorship-section-title">All Mentors</h2>
                        <div className="mentorship-grid">
                            {mentors.map(mentor => (
                                <div
                                    key={mentor.id}
                                    className="mentor-card"
                                    onClick={() => setSelectedMentor(mentor)}
                                >
                                    <div className="mentor-card-header">
                                        <div className="mentor-avatar">
                                            {getInitials(mentor.name)}
                                        </div>
                                    </div>
                                    <h3 className="mentor-name">{mentor.name}</h3>
                                    <p className="mentor-title">
                                        {mentor.industry} • {mentor.yearsExperience} years
                                    </p>
                                    <div className="mentor-expertise">
                                        {mentor.expertise.slice(0, 3).map(exp => (
                                            <span key={exp} className="expertise-tag">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mentor-meta">
                                        <span>⭐ {mentor.rating} ({mentor.reviewCount})</span>
                                        <span
                                            className="availability-badge"
                                            style={{
                                                background: getAvailabilityColor(mentor.availability),
                                            }}
                                        >
                                            {mentor.availability}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'my-mentors' && (
                <div className="mentorship-section">
                    {myMentorships.length === 0 ? (
                        <div className="mentorship-empty">
                            <div className="mentorship-empty-icon">🤝</div>
                            <h3>No active mentorships</h3>
                            <p>Browse mentors and request guidance for your journey.</p>
                            <button
                                className="mentorship-btn-primary"
                                onClick={() => setActiveTab('find')}
                            >
                                Find a Mentor
                            </button>
                        </div>
                    ) : (
                        <div className="my-mentorships-list">
                            {myMentorships.map(mentorship => (
                                <div key={mentorship.id} className="my-mentorship-card">
                                    <div className="my-mentorship-status">
                                        {mentorship.status}
                                    </div>
                                    <p>Goals: {mentorship.goals.join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Mentor Detail Modal */}
            {selectedMentor && (
                <div className="mentor-modal-overlay" onClick={() => setSelectedMentor(null)}>
                    <div className="mentor-modal" onClick={e => e.stopPropagation()}>
                        <div className="mentor-modal-header">
                            <div className="mentor-modal-avatar">
                                {getInitials(selectedMentor.name)}
                            </div>
                            <div>
                                <h2>{selectedMentor.name}</h2>
                                <p>{selectedMentor.certifications.join(' • ')}</p>
                            </div>
                        </div>
                        
                        <div className="mentor-modal-content">
                            <div className="mentor-modal-section">
                                <h3>Bio</h3>
                                <p>{selectedMentor.bio}</p>
                            </div>
                            
                            <div className="mentor-modal-section">
                                <h3>Expertise</h3>
                                <div className="mentor-expertise">
                                    {selectedMentor.expertise.map(exp => (
                                        <span key={exp} className="expertise-tag">
                                            {exp}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mentor-modal-stats">
                                <div className="mentor-stat">
                                    <span className="mentor-stat-value">
                                        {selectedMentor.yearsExperience}
                                    </span>
                                    <span className="mentor-stat-label">Years Experience</span>
                                </div>
                                <div className="mentor-stat">
                                    <span className="mentor-stat-value">
                                        {selectedMentor.rating}⭐
                                    </span>
                                    <span className="mentor-stat-label">
                                        ({selectedMentor.reviewCount} reviews)
                                    </span>
                                </div>
                                <div className="mentor-stat">
                                    <span className="mentor-stat-value">
                                        {selectedMentor.currentMentees}/{selectedMentor.maxMentees}
                                    </span>
                                    <span className="mentor-stat-label">Mentees</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mentor-modal-actions">
                            <button
                                className="mentorship-btn-secondary"
                                onClick={() => setSelectedMentor(null)}
                            >
                                Close
                            </button>
                            <button
                                className="mentorship-btn-primary"
                                onClick={() => setShowRequestModal(true)}
                                disabled={selectedMentor.currentMentees >= selectedMentor.maxMentees}
                            >
                                {selectedMentor.currentMentees >= selectedMentor.maxMentees
                                    ? 'At Capacity'
                                    : 'Request Mentorship'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Modal */}
            {showRequestModal && selectedMentor && (
                <RequestMentorshipModal
                    mentor={selectedMentor}
                    onClose={() => setShowRequestModal(false)}
                    onSubmit={handleRequestMentorship}
                />
            )}
        </div>
    );
}

// Request Modal Component
interface RequestModalProps {
    mentor: Mentor;
    onClose: () => void;
    onSubmit: (goals: string[]) => void;
}

function RequestMentorshipModal({ mentor, onClose, onSubmit }: RequestModalProps) {
    const [goals, setGoals] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(goals.split('\n').filter(g => g.trim()));
    };

    return (
        <div className="mentor-modal-overlay" onClick={onClose}>
            <div className="mentor-modal" onClick={e => e.stopPropagation()}>
                <h2>Request Mentorship</h2>
                <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                    From <strong>{mentor.name}</strong>
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mentorship-form-group">
                        <label>What are your goals for this mentorship?</label>
                        <textarea
                            value={goals}
                            onChange={e => setGoals(e.target.value)}
                            placeholder="e.g., Prepare for Black Belt certification&#10;Get feedback on my DMAIC project&#10;Improve my statistical analysis skills"
                            rows={5}
                            required
                        />
                    </div>
                    
                    <div className="mentor-modal-actions">
                        <button type="button" className="mentorship-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="mentorship-btn-primary">
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Mentorship;
