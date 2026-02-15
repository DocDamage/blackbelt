/**
 * Instructor Dashboard Component
 * 
 * Dashboard for instructors to manage students, view progress, and grade assignments.
 */

import React, { useState } from 'react';
import './InstructorDashboard.css';

interface Student {
    id: string;
    name: string;
    email: string;
    belt: string;
    progress: number;
    lastActive: Date;
    quizAverage: number;
    completedModules: number;
}

interface Assignment {
    id: string;
    title: string;
    dueDate: Date;
    submitted: number;
    total: number;
    avgScore?: number;
}

interface InstructorDashboardProps {
    students?: Student[];
    assignments?: Assignment[];
}

const DEMO_STUDENTS: Student[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', belt: 'green', progress: 75, lastActive: new Date(), quizAverage: 85, completedModules: 12 },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', belt: 'yellow', progress: 45, lastActive: new Date(Date.now() - 86400000), quizAverage: 72, completedModules: 8 },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com', belt: 'green', progress: 82, lastActive: new Date(), quizAverage: 91, completedModules: 15 },
    { id: '4', name: 'Dan Wilson', email: 'dan@example.com', belt: 'white', progress: 20, lastActive: new Date(Date.now() - 172800000), quizAverage: 65, completedModules: 4 },
    { id: '5', name: 'Eva Martinez', email: 'eva@example.com', belt: 'yellow', progress: 55, lastActive: new Date(Date.now() - 86400000), quizAverage: 78, completedModules: 9 },
];

const DEMO_ASSIGNMENTS: Assignment[] = [
    { id: '1', title: 'DMAIC Project Report', dueDate: new Date(Date.now() + 604800000), submitted: 12, total: 25, avgScore: 82 },
    { id: '2', title: 'Statistical Analysis Quiz', dueDate: new Date(Date.now() + 172800000), submitted: 18, total: 25 },
    { id: '3', title: 'Process Mapping Exercise', dueDate: new Date(Date.now() - 86400000), submitted: 22, total: 25, avgScore: 88 },
];

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
    students = DEMO_STUDENTS,
    assignments = DEMO_ASSIGNMENTS
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments' | 'analytics'>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBelt, setSelectedBelt] = useState('all');

    const stats = {
        totalStudents: students.length,
        activeToday: students.filter(s => {
            const today = new Date();
            return s.lastActive.toDateString() === today.toDateString();
        }).length,
        avgProgress: Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length),
        avgQuizScore: Math.round(students.reduce((sum, s) => sum + s.quizAverage, 0) / students.length)
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBelt = selectedBelt === 'all' || s.belt === selectedBelt;
        return matchesSearch && matchesBelt;
    });

    const getBeltColor = (belt: string) => {
        const colors: Record<string, string> = {
            white: '#f5f5f5',
            yellow: '#ffd700',
            green: '#28a745',
            black: '#1a1a1a'
        };
        return colors[belt] || '#ccc';
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const renderOverview = () => (
        <div className="dashboard-overview">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.totalStudents}</span>
                        <span className="stat-label">Total Students</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.activeToday}</span>
                        <span className="stat-label">Active Today</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.avgProgress}%</span>
                        <span className="stat-label">Avg Progress</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.avgQuizScore}%</span>
                        <span className="stat-label">Avg Quiz Score</span>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h3>Recent Assignments</h3>
                <div className="activity-list">
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="activity-item">
                            <div className="activity-info">
                                <span className="activity-title">{assignment.title}</span>
                                <span className="activity-meta">Due: {formatDate(assignment.dueDate)}</span>
                            </div>
                            <div className="activity-stats">
                                <span className="submission-count">{assignment.submitted}/{assignment.total}</span>
                                <div className="submission-bar">
                                    <div
                                        className="submission-fill"
                                        style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="top-students">
                <h3>Top Performers</h3>
                <div className="top-list">
                    {[...students].sort((a, b) => b.quizAverage - a.quizAverage).slice(0, 5).map((student, index) => (
                        <div key={student.id} className="top-item">
                            <span className="rank">#{index + 1}</span>
                            <span className="student-name">{student.name}</span>
                            <span className="student-score">{student.quizAverage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStudents = () => (
        <div className="students-view">
            <div className="students-controls">
                <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedBelt}
                    onChange={(e) => setSelectedBelt(e.target.value)}
                    className="belt-filter"
                >
                    <option value="all">All Belts</option>
                    <option value="white">White Belt</option>
                    <option value="yellow">Yellow Belt</option>
                    <option value="green">Green Belt</option>
                    <option value="black">Black Belt</option>
                </select>
            </div>

            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Belt</th>
                            <th>Progress</th>
                            <th>Quiz Avg</th>
                            <th>Modules</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.id}>
                                <td>
                                    <div className="student-info">
                                        <span className="student-avatar">{student.name.charAt(0)}</span>
                                        <div>
                                            <span className="student-name">{student.name}</span>
                                            <span className="student-email">{student.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="belt-badge" style={{ backgroundColor: getBeltColor(student.belt) }}>
                                        {student.belt}
                                    </span>
                                </td>
                                <td>
                                    <div className="progress-cell">
                                        <div className="progress-mini-bar">
                                            <div className="progress-mini-fill" style={{ width: `${student.progress}%` }} />
                                        </div>
                                        <span>{student.progress}%</span>
                                    </div>
                                </td>
                                <td>{student.quizAverage}%</td>
                                <td>{student.completedModules}</td>
                                <td>{formatDate(student.lastActive)}</td>
                                <td>
                                    <button className="action-btn">View</button>
                                    <button className="action-btn">Message</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAssignments = () => (
        <div className="assignments-view">
            <div className="assignments-header">
                <h3>All Assignments</h3>
                <button className="create-btn">+ Create Assignment</button>
            </div>
            <div className="assignments-list">
                {assignments.map(assignment => (
                    <div key={assignment.id} className="assignment-card">
                        <div className="assignment-info">
                            <h4>{assignment.title}</h4>
                            <p>Due: {formatDate(assignment.dueDate)}</p>
                        </div>
                        <div className="assignment-stats">
                            <div className="submission-info">
                                <span className="big-number">{assignment.submitted}</span>
                                <span className="label">of {assignment.total} submitted</span>
                            </div>
                            {assignment.avgScore && (
                                <div className="score-info">
                                    <span className="big-number">{assignment.avgScore}%</span>
                                    <span className="label">avg score</span>
                                </div>
                            )}
                        </div>
                        <div className="assignment-actions">
                            <button className="grade-btn">Grade Submissions</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="analytics-view">
            <h3>Class Analytics</h3>
            <div className="analytics-grid">
                <div className="analytics-card">
                    <h4>Progress Distribution</h4>
                    <div className="distribution-chart">
                        {['0-25%', '26-50%', '51-75%', '76-100%'].map((range, i) => {
                            const count = students.filter(s => {
                                if (i === 0) return s.progress <= 25;
                                if (i === 1) return s.progress > 25 && s.progress <= 50;
                                if (i === 2) return s.progress > 50 && s.progress <= 75;
                                return s.progress > 75;
                            }).length;
                            return (
                                <div key={range} className="distribution-bar">
                                    <div className="bar-fill" style={{ height: `${(count / students.length) * 100}%` }} />
                                    <span className="bar-label">{range}</span>
                                    <span className="bar-value">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="analytics-card">
                    <h4>Belt Distribution</h4>
                    <div className="belt-distribution">
                        {['white', 'yellow', 'green', 'black'].map(belt => {
                            const count = students.filter(s => s.belt === belt).length;
                            return (
                                <div key={belt} className="belt-row">
                                    <span className="belt-dot" style={{ backgroundColor: getBeltColor(belt) }} />
                                    <span className="belt-name">{belt}</span>
                                    <div className="belt-bar-container">
                                        <div className="belt-bar" style={{ width: `${(count / students.length) * 100}%`, backgroundColor: getBeltColor(belt) }} />
                                    </div>
                                    <span className="belt-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="instructor-dashboard">
            <div className="dashboard-header">
                <h1>👨‍🏫 Instructor Dashboard</h1>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                    onClick={() => setActiveTab('students')}
                >
                    👥 Students
                </button>
                <button
                    className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('assignments')}
                >
                    📝 Assignments
                </button>
                <button
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    📈 Analytics
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'students' && renderStudents()}
                {activeTab === 'assignments' && renderAssignments()}
                {activeTab === 'analytics' && renderAnalytics()}
            </div>
        </div>
    );
};

export default InstructorDashboard;