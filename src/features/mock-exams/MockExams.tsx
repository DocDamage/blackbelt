/**
 * Mock Certification Exams Component
 * 
 * Full-length ASQ CSSBB practice exams with timer, bookmarking, and detailed results
 */

import { useState, useEffect } from 'react';
import { MockExam, ExamQuestion } from '../../utils/db.schema';
import {
    createMockExam,
    getExamQuestionsForExam,
    saveAnswer,
    toggleBookmark,
    submitExam,
    getExamStatistics,
    getCompletedExams,
    getInProgressExam,
} from './mockExams.db';
import { Loading } from '../../components/common/Loading/Loading';
import './MockExams.css';

const USER_ID = 'current-user'; // TODO: Get from auth context

export function MockExams() {
    const [view, setView] = useState<'setup' | 'exam' | 'results' | 'history'>('setup');
    const [exam, setExam] = useState<MockExam | null>(null);
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{
        totalExams: number;
        passed: number;
        averageScore: number;
        bestScore: number;
    } | null>(null);
    const [examHistory, setExamHistory] = useState<MockExam[]>([]);

    // Check for in-progress exam on load
    useEffect(() => {
        checkInProgressExam();
    }, []);

    const checkInProgressExam = async () => {
        setLoading(true);
        try {
            const inProgress = await getInProgressExam(USER_ID);
            if (inProgress) {
                const examQuestions = await getExamQuestionsForExam(inProgress.id);
                setExam(inProgress);
                setQuestions(examQuestions);
                setView('exam');
            } else {
                // Load stats and history
                const examStats = await getExamStatistics(USER_ID);
                setStats({
                    totalExams: examStats.totalExams,
                    passed: examStats.passed,
                    averageScore: examStats.averageScore,
                    bestScore: examStats.bestScore,
                });
                const history = await getCompletedExams(USER_ID);
                setExamHistory(history.slice(0, 5));
            }
        } catch (error) {
            console.error('Failed to check exam status:', error);
        } finally {
            setLoading(false);
        }
    };

    const startNewExam = async () => {
        setLoading(true);
        try {
            const newExam = await createMockExam(USER_ID, {
                certificationBody: 'asq',
                beltLevel: 'black',
                questionCount: 50, // Smaller for demo; use 165 for full exam
                timeLimit: 90, // 1.5 hours for demo; use 270 for full
            });
            const examQuestions = await getExamQuestionsForExam(newExam.id);
            setExam(newExam);
            setQuestions(examQuestions);
            setView('exam');
        } catch (error) {
            console.error('Failed to start exam:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!exam) return;
        
        if (confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
            setLoading(true);
            try {
                const completedExam = await submitExam(exam.id);
                setExam(completedExam);
                setView('results');
            } catch (error) {
                console.error('Failed to submit exam:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <Loading message="Loading exam..." />;
    }

    if (view === 'setup') {
        return (
            <div className="exams-container">
                <div className="exams-header">
                    <h1 className="exams-title">Mock Certification Exams</h1>
                    <p className="exams-subtitle">
                        Practice with full-length exams simulating the ASQ CSSBB certification
                    </p>
                </div>

                <div className="exam-setup">
                    <h2 className="exam-setup-title">ASQ Certified Six Sigma Black Belt</h2>
                    
                    <div className="exam-info">
                        <div className="exam-info-item">
                            <span>Questions</span>
                            <span>50 (Demo) / 165 (Full)</span>
                        </div>
                        <div className="exam-info-item">
                            <span>Time Limit</span>
                            <span>1.5 hours (Demo) / 4.5 hours (Full)</span>
                        </div>
                        <div className="exam-info-item">
                            <span>Passing Score</span>
                            <span>70%</span>
                        </div>
                        <div className="exam-info-item">
                            <span>Calculator</span>
                            <span>Allowed (on-screen)</span>
                        </div>
                    </div>

                    {stats && stats.totalExams > 0 && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                                Your Progress:
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                                <div>
                                    <strong>{stats.totalExams}</strong> Exams Taken
                                </div>
                                <div>
                                    <strong>{stats.passed}</strong> Passed
                                </div>
                                <div>
                                    <strong>{stats.averageScore}%</strong> Average
                                </div>
                                <div>
                                    <strong>{stats.bestScore}%</strong> Best
                                </div>
                            </div>
                        </div>
                    )}

                    <button className="exam-start-btn" onClick={startNewExam}>
                        Start Practice Exam
                    </button>

                    {examHistory.length > 0 && (
                        <div className="exam-history">
                            <h3 className="exam-history-title">Recent Exams</h3>
                            <div className="exam-history-list">
                                {examHistory.map((pastExam) => (
                                    <div
                                        key={pastExam.id}
                                        className={`exam-history-item ${pastExam.passed ? 'passed' : 'failed'}`}
                                    >
                                        <div className="exam-history-info">
                                            <span className="exam-history-date">
                                                {pastExam.completedAt && 
                                                    new Date(pastExam.completedAt).toLocaleDateString()}
                                            </span>
                                            <span>ASQ CSSBB Practice</span>
                                        </div>
                                        <span className="exam-history-score">
                                            {pastExam.score}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (view === 'exam' && exam) {
        return (
            <ExamSession
                exam={exam}
                questions={questions}
                onSubmit={handleSubmit}
                onUpdate={(updated) => setExam(updated)}
            />
        );
    }

    if (view === 'results' && exam) {
        return (
            <ExamResults
                exam={exam}
                onRetake={() => {
                    setExam(null);
                    setView('setup');
                    checkInProgressExam();
                }}
            />
        );
    }

    return null;
}

// Exam Session Component
interface ExamSessionProps {
    exam: MockExam;
    questions: ExamQuestion[];
    onSubmit: () => void;
    onUpdate: (exam: MockExam) => void;
}

function ExamSession({ exam, questions, onSubmit, onUpdate }: ExamSessionProps) {
    const [currentIndex, setCurrentIndex] = useState(exam.currentQuestion);
    const [timeRemaining, setTimeRemaining] = useState(exam.timeRemaining);
    const currentQuestion = questions[currentIndex] ?? questions[0];

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    onSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onSubmit]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = async (optionIndex: number) => {
        if (!currentQuestion) return;
        await saveAnswer(exam.id, currentQuestion.id, optionIndex);
        const updated = { ...exam, answers: { ...exam.answers, [currentQuestion.id]: optionIndex } };
        onUpdate(updated);
    };

    const handleBookmark = async () => {
        if (!currentQuestion) return;
        await toggleBookmark(exam.id, currentQuestion.id);
        const isBookmarked = exam.bookmarkedQuestions.includes(currentQuestion.id);
        const updatedBookmarks = isBookmarked
            ? exam.bookmarkedQuestions.filter(id => id !== currentQuestion.id)
            : [...exam.bookmarkedQuestions, currentQuestion.id];
        onUpdate({ ...exam, bookmarkedQuestions: updatedBookmarks });
    };

    const handleNavigate = (index: number) => {
        setCurrentIndex(index);
        onUpdate({ ...exam, currentQuestion: index });
    };

    const isBookmarked = currentQuestion ? exam.bookmarkedQuestions.includes(currentQuestion.id) : false;
    const selectedAnswer = currentQuestion ? exam.answers[currentQuestion.id] : undefined;

    return (
        <div className="exams-container">
            <div className="exam-interface">
                <div className="exam-header">
                    <span className="exam-progress-info">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <div className={`exam-timer ${timeRemaining < 300 ? 'danger' : timeRemaining < 600 ? 'warning' : ''}`}>
                        ⏱️ {formatTime(timeRemaining)}
                    </div>
                </div>

                <div className="exam-main">
                    <div className="exam-question">
                        {currentQuestion ? (
                        <>
                        <div className="exam-question-header">
                            <span className="exam-question-number">
                                {currentQuestion.phase.toUpperCase()} Phase
                            </span>
                            <button
                                className={`exam-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                                onClick={handleBookmark}
                            >
                                {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
                            </button>
                        </div>

                        <div className="exam-question-text">
                            {currentQuestion.question}
                        </div>

                        <div className="exam-options-list">
                            {currentQuestion.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`exam-option-item ${selectedAnswer === index ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        checked={selectedAnswer === index}
                                        onChange={() => handleAnswer(index)}
                                        style={{ display: 'none' }}
                                    />
                                    <span className="exam-option-letter">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="exam-option-text">{option}</span>
                                </label>
                            ))}
                        </div>
                        </>
                    ) : (
                        <div>No question available</div>
                    )}
                    </div>

                    <div className="exam-nav">
                        <div className="exam-nav-title">Questions</div>
                        <div className="exam-nav-grid">
                            {questions.map((q, index) => {
                                const isAnswered = exam.answers[q.id] !== undefined;
                                const isCurrent = index === currentIndex;
                                const isBookmarked = exam.bookmarkedQuestions.includes(q.id);

                                return (
                                    <button
                                        key={q.id}
                                        className={`exam-nav-item ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''} ${isBookmarked ? 'bookmarked' : ''}`}
                                        onClick={() => handleNavigate(index)}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="exam-nav-legend">
                            <div className="exam-nav-legend-item">
                                <div className="exam-nav-legend-dot answered"></div>
                                <span>Answered</span>
                            </div>
                            <div className="exam-nav-legend-item">
                                <div className="exam-nav-legend-dot current"></div>
                                <span>Current</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="exam-controls">
                    <button
                        className="exam-nav-btn"
                        onClick={() => handleNavigate(Math.max(0, currentIndex - 1))}
                        disabled={currentIndex === 0}
                    >
                        ← Previous
                    </button>
                    <button
                        className="exam-nav-btn"
                        onClick={() => handleNavigate(Math.min(questions.length - 1, currentIndex + 1))}
                        disabled={currentIndex === questions.length - 1}
                    >
                        Next →
                    </button>
                    <button className="exam-submit-btn" onClick={onSubmit}>
                        Submit Exam
                    </button>
                </div>
            </div>
        </div>
    );
}

// Exam Results Component
interface ExamResultsProps {
    exam: MockExam;
    onRetake: () => void;
}

function ExamResults({ exam, onRetake }: ExamResultsProps) {
    const passed = exam.passed ?? false;
    const score = exam.score ?? 0;

    return (
        <div className="exams-container">
            <div className={`exam-results ${passed ? 'exam-results-passed' : 'exam-results-failed'}`}>
                <div className="exam-results-header">
                    <div className="exam-results-icon">{passed ? '🎉' : '📚'}</div>
                    <h2 className="exam-results-title">
                        {passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
                    </h2>
                </div>

                <div className="exam-results-score">
                    {score}%
                </div>

                <p className="exam-results-message">
                    {passed
                        ? `Great job! You exceeded the 70% passing score.`
                        : `You scored ${score}%. The passing score is 70%. Review your weak areas and try again!`}
                </p>

                {exam.domainScores && (
                    <div className="exam-domains">
                        <h3 className="exam-domains-title">Performance by DMAIC Phase</h3>
                        {Object.entries(exam.domainScores).map(([phase, data]) => (
                            <div key={phase} className="exam-domain-item">
                                <span className="exam-domain-name">{phase}</span>
                                <div className="exam-domain-bar">
                                    <div
                                        className={`exam-domain-fill ${data.percentage >= 70 ? 'pass' : 'fail'}`}
                                        style={{ width: `${data.percentage}%` }}
                                    />
                                    <span className="exam-domain-value">{data.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="exam-start-btn" onClick={onRetake}>
                    {passed ? 'Take Another Practice Exam' : 'Try Again'}
                </button>
            </div>
        </div>
    );
}

export default MockExams;
