import { useState, useEffect } from 'react';
import { Lesson, BeltLevel } from '../../../types';
import { markLessonComplete, updateLessonTime } from '../../../utils/db';
import './LessonViewer.css';

interface LessonViewerProps {
    lesson: Lesson;
    moduleId: string;
    beltLevel: BeltLevel;
    isCompleted: boolean;
    onComplete: (lessonId: string) => void;
    onClose: () => void;
    onNext: () => void;
}

export function LessonViewer({
    lesson,
    moduleId,
    beltLevel,
    isCompleted,
    onComplete,
    onClose,
    onNext,
}: LessonViewerProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [startTime] = useState(Date.now());

    // Track time spent on lesson
    useEffect(() => {
        return () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            updateLessonTime(lesson.id, moduleId, beltLevel, timeSpent);
        };
    }, [lesson.id, moduleId, beltLevel, startTime]);

    const handleMarkComplete = async () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        await markLessonComplete(lesson.id, moduleId, beltLevel, timeSpent);
        setCompleted(true);
        onComplete(lesson.id);
    };

    const handleNextLesson = () => {
        if (!completed) {
            handleMarkComplete();
        }
        onNext();
    };

    return (
        <div className="lesson-viewer">
            {/* Header */}
            <header className="lesson-header">
                <div className="lesson-header-left">
                    <button className="lesson-back-btn" onClick={onClose}>
                        ← Back to Modules
                    </button>
                    <div className="lesson-breadcrumb">
                        <span>{lesson.title}</span>
                    </div>
                </div>
                <div className="lesson-actions">
                    {completed && (
                        <span className="lesson-complete-badge">✓ Completed</span>
                    )}
                </div>
            </header>

            {/* Content */}
            <div className="lesson-container">
                <div className="lesson-title-section">
                    <h1 className="lesson-main-title">{lesson.title}</h1>
                    <span className="lesson-time-badge">
                        ⏱️ {lesson.estimatedMinutes} minutes
                    </span>
                </div>

                {/* Video Section */}
                {lesson.videoUrl && (
                    <div className="lesson-video">
                        <div className="video-container">
                            <iframe
                                src={lesson.videoUrl}
                                title={lesson.videoTitle || lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        {lesson.videoTitle && (
                            <div className="video-title">
                                📹 {lesson.videoTitle}
                            </div>
                        )}
                    </div>
                )}

                {/* Lesson Content */}
                <div
                    className="lesson-content"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                />

                {/* Footer */}
                <div className="lesson-footer">
                    <div>
                        {!completed ? (
                            <button className="btn btn-secondary" onClick={handleMarkComplete}>
                                ✓ Mark as Complete
                            </button>
                        ) : (
                            <span className="lesson-complete-badge">✓ Lesson Completed</span>
                        )}
                    </div>
                    <div className="lesson-nav-buttons">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Back to Modules
                        </button>
                        <button className="btn btn-primary" onClick={handleNextLesson}>
                            {completed ? 'Next Lesson →' : 'Complete & Continue →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
