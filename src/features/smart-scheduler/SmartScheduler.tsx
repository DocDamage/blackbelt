/**
 * Smart Study Scheduler Component
 * 
 * Creates personalized study plans based on available time and goals
 */

import { useState, useEffect, useCallback } from 'react';

import './SmartScheduler.css';

interface StudySession {
    id: string;
    date: Date;
    duration: number; // minutes
    topics: string[];
    completed: boolean;
}

interface Schedule {
    sessions: StudySession[];
    totalHours: number;
    targetDate: Date;
}

const TOPICS = [
    'Define Phase - Project Charter',
    'Define Phase - SIPOC & VOC',
    'Measure Phase - MSA',
    'Measure Phase - Process Capability',
    'Analyze Phase - Hypothesis Testing',
    'Analyze Phase - Regression',
    'Analyze Phase - DOE',
    'Improve Phase - Solution Selection',
    'Improve Phase - FMEA',
    'Control Phase - SPC',
    'Control Phase - Control Plans',
];

export function SmartScheduler() {
    const [hoursPerWeek, setHoursPerWeek] = useState(5);
    const [targetDate, setTargetDate] = useState('');
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Set default target date to 3 months from now
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 3);
        const dateStr = defaultDate.toISOString().split('T')[0];
        setTargetDate(dateStr ?? '');
    }, []);

    const generateSchedule = useCallback(() => {
        setIsGenerating(true);
        
        // Simulate schedule generation
        setTimeout(() => {
            const sessions: StudySession[] = [];
            const target = new Date(targetDate);
            const today = new Date();
            const daysAvailable = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const totalMinutes = hoursPerWeek * 60 * (daysAvailable / 7);
            const sessionCount = Math.floor(totalMinutes / 60); // 60 min sessions
            
            let currentDate = new Date(today);
            let topicIndex = 0;
            
            for (let i = 0; i < Math.min(sessionCount, 30); i++) {
                // Skip some days (study 4-5 days per week)
                if (Math.random() > 0.7) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                sessions.push({
                    id: `session-${i}`,
                    date: new Date(currentDate),
                    duration: 60,
                    topics: [TOPICS[topicIndex % TOPICS.length] ?? 'Study'],
                    completed: false,
                });
                
                topicIndex++;
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            setSchedule({
                sessions,
                totalHours: Math.floor(totalMinutes / 60),
                targetDate: target,
            });
            setIsGenerating(false);
        }, 500);
    }, [hoursPerWeek, targetDate]);

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    return (
        <div className="scheduler-container">
            <div className="scheduler-header">
                <h1 className="scheduler-title">Smart Study Scheduler</h1>
                <p className="scheduler-subtitle">
                    Generate a personalized study plan based on your availability and certification goals
                </p>
            </div>

            <div className="scheduler-setup">
                <div className="scheduler-form">
                    <div className="scheduler-field">
                        <label>Study Hours Per Week</label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={hoursPerWeek}
                            onChange={e => setHoursPerWeek(parseInt(e.target.value))}
                        />
                        <span className="scheduler-field-value">{hoursPerWeek} hours</span>
                    </div>

                    <div className="scheduler-field">
                        <label>Target Exam Date</label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={e => setTargetDate(e.target.value)}
                        />
                    </div>

                    <button
                        className="scheduler-generate-btn"
                        onClick={generateSchedule}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Schedule'}
                    </button>
                </div>

                {schedule && (
                    <div className="scheduler-summary">
                        <div className="scheduler-stat">
                            <span className="scheduler-stat-value">{schedule.sessions.length}</span>
                            <span className="scheduler-stat-label">Study Sessions</span>
                        </div>
                        <div className="scheduler-stat">
                            <span className="scheduler-stat-value">{schedule.totalHours}</span>
                            <span className="scheduler-stat-label">Total Hours</span>
                        </div>
                        <div className="scheduler-stat">
                            <span className="scheduler-stat-value">
                                {Math.ceil((schedule.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                            <span className="scheduler-stat-label">Days Until Exam</span>
                        </div>
                    </div>
                )}
            </div>

            {schedule && (
                <div className="scheduler-calendar">
                    <h2>Your Study Plan</h2>
                    <div className="scheduler-sessions">
                        {schedule.sessions.map((session, index) => (
                            <div key={session.id} className="scheduler-session">
                                <div className="scheduler-session-date">
                                    <span className="scheduler-session-day">
                                        {formatDate(session.date)}
                                    </span>
                                    <span className="scheduler-session-time">{session.duration} min</span>
                                </div>
                                <div className="scheduler-session-topic">
                                    <span className="scheduler-session-number">#{index + 1}</span>
                                    {session.topics[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SmartScheduler;
