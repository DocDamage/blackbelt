/**
 * Practice Mode Component
 * 
 * Untimed quiz practice with hints and explanations.
 */

import React, { useState, useMemo } from 'react';
import './PracticeMode.css';

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    hint?: string;
    explanation?: string;
    topic?: string;
}

interface PracticeModeProps {
    questions: Question[];
    title?: string;
    onComplete?: (score: number, total: number) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
    questions,
    title = 'Practice Mode',
    onComplete
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answers, setAnswers] = useState<Record<string, { selected: number; correct: boolean }>>({});
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = questions[currentIndex]!;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const stats = useMemo(() => {
        const answered = Object.keys(answers).length;
        const correct = Object.values(answers).filter((a) => a.correct).length;
        return { answered, correct, total: questions.length };
    }, [answers, questions.length]);

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null) return; // Already answered
        setSelectedAnswer(index);
    };

    const handleCheckAnswer = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: { selected: selectedAnswer, correct: isCorrect }
        }));
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setShowHint(false);
            setShowExplanation(false);
        } else {
            setIsComplete(true);
            if (onComplete) {
                const correct = Object.values(answers).filter((a) => a.correct).length;
                onComplete(correct, questions.length);
            }
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            const prevQuestion = questions[currentIndex - 1]!;
            const prevAnswer = answers[prevQuestion.id];
            if (prevAnswer) {
                setSelectedAnswer(prevAnswer.selected);
                setShowExplanation(true);
            } else {
                setSelectedAnswer(null);
                setShowExplanation(false);
            }
            setShowHint(false);
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowHint(false);
        setShowExplanation(false);
        setAnswers({});
        setIsComplete(false);
    };

    const getOptionClass = (index: number): string => {
        if (selectedAnswer === null) {
            return 'practice-option';
        }
        if (index === currentQuestion.correctAnswer) {
            return 'practice-option correct';
        }
        if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
            return 'practice-option incorrect';
        }
        return 'practice-option disabled';
    };

    if (isComplete) {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        return (
            <div className="practice-mode">
                <div className="practice-complete">
                    <h2>🎉 Practice Complete!</h2>
                    <div className="practice-score">
                        <div className="score-circle">
                            <span className="score-percentage">{percentage}%</span>
                        </div>
                        <p>
                            You got <strong>{stats.correct}</strong> out of <strong>{stats.total}</strong> questions correct
                        </p>
                    </div>
                    <div className="practice-summary">
                        {percentage >= 80 ? (
                            <p className="summary-message success">Great job! You're well prepared!</p>
                        ) : percentage >= 60 ? (
                            <p className="summary-message warning">Good effort! Review the topics you missed.</p>
                        ) : (
                            <p className="summary-message info">Keep practicing! You'll improve.</p>
                        )}
                    </div>
                    <button className="restart-btn" onClick={handleRestart}>
                        🔄 Practice Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="practice-mode">
            <div className="practice-header">
                <h2>{title}</h2>
                <div className="practice-info">
                    <span className="question-counter">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="practice-stats">
                        ✅ {stats.correct} | ❌ {stats.answered - stats.correct}
                    </span>
                </div>
                <div className="practice-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {currentQuestion.topic && (
                <div className="question-topic">
                    <span>📚 {currentQuestion.topic}</span>
                </div>
            )}

            <div className="practice-question">
                <p>{currentQuestion.question}</p>
            </div>

            <div className="practice-options">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        className={getOptionClass(index)}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                    >
                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                        <span className="option-text">{option}</span>
                        {showExplanation && index === currentQuestion.correctAnswer && (
                            <span className="option-indicator">✓</span>
                        )}
                        {showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <span className="option-indicator">✗</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Hint Section */}
            {currentQuestion.hint && !showExplanation && (
                <div className="hint-section">
                    {showHint ? (
                        <div className="hint-content">
                            <span className="hint-icon">💡</span>
                            <p>{currentQuestion.hint}</p>
                        </div>
                    ) : (
                        <button className="hint-btn" onClick={() => setShowHint(true)}>
                            💡 Show Hint
                        </button>
                    )}
                </div>
            )}

            {/* Explanation Section */}
            {showExplanation && currentQuestion.explanation && (
                <div className="explanation-section">
                    <h4>
                        {selectedAnswer === currentQuestion.correctAnswer
                            ? '✅ Correct!'
                            : '❌ Incorrect'}
                    </h4>
                    <p>{currentQuestion.explanation}</p>
                </div>
            )}

            <div className="practice-actions">
                <button
                    className="nav-btn secondary"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    ← Previous
                </button>

                {selectedAnswer === null ? (
                    <button className="nav-btn secondary" onClick={handleSkip}>
                        Skip →
                    </button>
                ) : !showExplanation ? (
                    <button className="nav-btn primary" onClick={handleCheckAnswer}>
                        Check Answer
                    </button>
                ) : (
                    <button className="nav-btn primary" onClick={handleNext}>
                        {currentIndex === questions.length - 1 ? 'Finish' : 'Next →'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PracticeMode;