import { useState, useEffect, useCallback } from 'react';
import { Quiz, BeltLevel } from '../../../types';
import { saveQuizAttempt, saveCertificate, generateCertificateId } from '../../../utils/db';
import './QuizEngine.css';

interface QuizEngineProps {
    quiz: Quiz;
    beltLevel: BeltLevel;
    isFinalExam?: boolean;
    userName?: string; // Optional user name for certificates
    onComplete: (passed: boolean, score: number) => void;
    onClose: () => void;
}

// Default user name when not provided
const DEFAULT_USER_NAME = 'Six Sigma Student';

export function QuizEngine({
    quiz,
    beltLevel,
    isFinalExam = false,
    userName = DEFAULT_USER_NAME,
    onComplete,
    onClose,
}: QuizEngineProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
    const [startTime] = useState(Date.now());
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const answeredCount = Object.keys(answers).length;

    const calculateScore = useCallback(() => {
        let correct = 0;
        let totalPoints = 0;
        let earnedPoints = 0;

        quiz.questions.forEach(q => {
            totalPoints += q.points;
            if (answers[q.id] === q.correctAnswer) {
                correct++;
                earnedPoints += q.points;
            }
        });

        const percentage = Math.round((earnedPoints / totalPoints) * 100);
        return {
            correct,
            total: totalQuestions,
            earnedPoints,
            totalPoints,
            percentage,
            passed: percentage >= quiz.passingScore,
        };
    }, [answers, quiz, totalQuestions]);

    // Memoized submit handler for timer dependency - must be defined before useEffect that uses it
    const handleSubmitQuiz = useCallback(async () => {
        const results = calculateScore();
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        // Save quiz attempt
        await saveQuizAttempt({
            quizId: quiz.id,
            answers,
            score: results.earnedPoints,
            totalPoints: results.totalPoints,
            percentage: results.percentage,
            passed: results.passed,
            completedAt: new Date(),
            timeSpent,
        });

        // If passed final exam, generate certificate
        if (isFinalExam && results.passed) {
            const certId = generateCertificateId();
            await saveCertificate({
                id: certId,
                beltLevel,
                userName, // Uses prop or DEFAULT_USER_NAME
                issueDate: new Date(),
                score: results.percentage,
                verificationCode: certId,
            });
        }

        setQuizCompleted(true);
        onComplete(results.passed, results.percentage);
    }, [calculateScore, startTime, quiz.id, answers, isFinalExam, beltLevel, onComplete]);

    // Timer - with proper dependency on memoized handleSubmitQuiz
    useEffect(() => {
        if (!quiz.timeLimit || quizCompleted || isTimerPaused) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz.timeLimit, quizCompleted, isTimerPaused, handleSubmitQuiz]);

    // Pause timer when tab loses focus (prevents cheating)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsTimerPaused(true);
            } else {
                setIsTimerPaused(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const handleSelectAnswer = (questionId: string, answerIndex: number) => {
        if (showExplanation) return;
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleNextQuestion = () => {
        setShowExplanation(false);
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        setShowExplanation(false);
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleCheckAnswer = () => {
        setShowExplanation(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerClass = () => {
        if (!quiz.timeLimit) return '';
        const totalSeconds = quiz.timeLimit * 60;
        const percentRemaining = (timeRemaining / totalSeconds) * 100;
        if (percentRemaining <= 10) return 'danger';
        if (percentRemaining <= 25) return 'warning';
        return '';
    };

    // Guard: ensure currentQuestion exists (must be after all hooks)
    if (!currentQuestion) {
        return (
            <div className="quiz-engine">
                <header className="quiz-header">
                    <div className="quiz-header-left">
                        <button className="quiz-back-btn" onClick={onClose}>
                            ← Back to Modules
                        </button>
                        <span className="quiz-title-header">{quiz.title}</span>
                    </div>
                </header>
                <div className="quiz-container">
                    <div className="question-card">
                        <p>Loading question...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Results screen
    if (quizCompleted) {
        const results = calculateScore();

        return (
            <div className="quiz-engine">
                <header className="quiz-header">
                    <div className="quiz-header-left">
                        <button className="quiz-back-btn" onClick={onClose}>
                            ← Back to Modules
                        </button>
                        <span className="quiz-title-header">{quiz.title} - Results</span>
                    </div>
                </header>

                <div className="quiz-container">
                    <div className="quiz-results">
                        <div className="results-card">
                            <div className="results-icon">
                                {results.passed ? '🎉' : '📚'}
                            </div>
                            <h1 className={`results-title ${results.passed ? 'passed' : 'failed'}`}>
                                {results.passed ? 'Congratulations!' : 'Keep Learning!'}
                            </h1>
                            <div className="results-score">{results.percentage}%</div>
                            <div className="results-score-label">Your Score</div>

                            <div className="results-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{results.correct}/{results.total}</div>
                                    <div className="result-stat-label">Correct Answers</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value">{results.earnedPoints}/{results.totalPoints}</div>
                                    <div className="result-stat-label">Points Earned</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value">{quiz.passingScore}%</div>
                                    <div className="result-stat-label">Passing Score</div>
                                </div>
                            </div>

                            <p className="results-message">
                                {results.passed
                                    ? isFinalExam
                                        ? `Excellent work! You've passed the ${beltLevel.charAt(0).toUpperCase() + beltLevel.slice(1)} Belt certification exam. Your certificate is now available!`
                                        : "Great job! You've mastered this module. Keep up the excellent work!"
                                    : `You needed ${quiz.passingScore}% to pass. Review the material and try again when you're ready.`}
                            </p>

                            <div className="results-actions">
                                <button className="btn btn-secondary" onClick={onClose}>
                                    Back to Modules
                                </button>
                                {results.passed && isFinalExam && (
                                    <button className="btn btn-gold">
                                        View Certificate 🏆
                                    </button>
                                )}
                                {!results.passed && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setAnswers({});
                                            setCurrentQuestionIndex(0);
                                            setQuizCompleted(false);
                                            setShowExplanation(false);
                                            setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
                                        }}
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz in progress
    return (
        <div className="quiz-engine">
            <header className="quiz-header">
                <div className="quiz-header-left">
                    <button className="quiz-back-btn" onClick={onClose}>
                        ← Exit Quiz
                    </button>
                    <span className="quiz-title-header">{quiz.title}</span>
                </div>
                {quiz.timeLimit && (
                    <div className={`quiz-timer ${getTimerClass()}`}>
                        {isTimerPaused ? '⏸️ PAUSED' : `⏱️ ${formatTime(timeRemaining)}`}
                    </div>
                )}
            </header>

            <div className="quiz-container">
                {/* Progress */}
                <div className="quiz-progress">
                    <div className="quiz-progress-info">
                        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                        <span>{answeredCount} answered</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="question-card">
                    <span className="question-number">
                        Question {currentQuestionIndex + 1}
                    </span>
                    <p className="question-text">{currentQuestion.question}</p>
                    <p className="question-points">({currentQuestion.points} points)</p>

                    <div className="answer-options">
                        {currentQuestion.options?.map((option, index) => {
                            const isSelected = answers[currentQuestion.id] === index;
                            const isCorrect = showExplanation && index === currentQuestion.correctAnswer;
                            const isIncorrect = showExplanation && isSelected && index !== currentQuestion.correctAnswer;

                            return (
                                <div
                                    key={index}
                                    className={`answer-option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${showExplanation ? 'disabled' : ''}`}
                                    onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                                >
                                    <span className="answer-letter">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="answer-label">{option}</span>
                                    <div className="answer-radio">
                                        {isSelected && !showExplanation && '●'}
                                        {isCorrect && '✓'}
                                        {isIncorrect && '✗'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                        <div className="question-explanation">
                            <div className="explanation-header">💡 Explanation</div>
                            <p className="explanation-text">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="quiz-navigation">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        ← Previous
                    </button>

                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        {!showExplanation && answers[currentQuestion.id] !== undefined && (
                            <button className="btn btn-secondary" onClick={handleCheckAnswer}>
                                Check Answer
                            </button>
                        )}

                        {currentQuestionIndex < totalQuestions - 1 ? (
                            <button
                                className="btn btn-primary"
                                onClick={handleNextQuestion}
                                disabled={answers[currentQuestion.id] === undefined}
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                className="btn btn-gold"
                                onClick={handleSubmitQuiz}
                                disabled={answeredCount < totalQuestions}
                            >
                                Submit Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
