import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Module, BeltLevel, Lesson, Certificate } from '../../types';
import { whiteBeltModules, whiteBeltFinalExam, getWhiteBeltLessonCount, getWhiteBeltTotalMinutes } from '../../content/whiteBelt/modules';
import { yellowBeltModules, yellowBeltFinalExam, getYellowBeltLessonCount, getYellowBeltTotalMinutes } from '../../content/yellowBelt/modules';
import { greenBeltModules, greenBeltFinalExam, getGreenBeltLessonCount, getGreenBeltTotalMinutes } from '../../content/greenBelt/modules';
import { blackBeltModules, blackBeltFinalExam, getBlackBeltLessonCount, getBlackBeltTotalMinutes } from '../../content/blackBelt/modules';
import { masterBlackBeltModules, masterBlackBeltFinalExam, getMasterBlackBeltLessonCount, getMasterBlackBeltTotalMinutes } from '../../content/masterBlackBelt/modules';
import { getBeltProgress, getCertificateByBelt } from '../../utils/db';
import { LessonViewer } from '../../components/features/LessonViewer/LessonViewer';
import { QuizEngine } from '../../components/features/QuizEngine/QuizEngine';
import { ModuleStats } from '../../components/features/ModuleStats/ModuleStats';
import './BeltPage.css';

interface BeltConfig {
    id: BeltLevel;
    name: string;
    icon: string;
    description: string;
    color: string;
    modules: Module[];
    finalExam: typeof whiteBeltFinalExam;
    getTotalLessons: () => number;
    getTotalMinutes: () => number;
}

const beltConfigs: Record<BeltLevel, BeltConfig> = {
    white: {
        id: 'white',
        name: 'White Belt',
        icon: '⬜',
        description: 'Foundation level introducing Six Sigma basics, key terminology, and the role of team members in quality improvement. Build awareness and understanding to participate effectively in improvement projects.',
        color: 'white',
        modules: whiteBeltModules,
        finalExam: whiteBeltFinalExam,
        getTotalLessons: getWhiteBeltLessonCount,
        getTotalMinutes: getWhiteBeltTotalMinutes,
    },
    yellow: {
        id: 'yellow',
        name: 'Yellow Belt',
        icon: '🟨',
        description: 'Learn DMAIC in depth, process mapping, VOC/CTQ, root cause analysis, and effective team participation. Build skills to support improvement projects.',
        color: 'yellow',
        modules: yellowBeltModules,
        finalExam: yellowBeltFinalExam,
        getTotalLessons: getYellowBeltLessonCount,
        getTotalMinutes: getYellowBeltTotalMinutes,
    },
    green: {
        id: 'green',
        name: 'Green Belt',
        icon: '🟩',
        description: 'Master statistical analysis, hypothesis testing, SPC, DOE basics, and lead improvement projects to deliver measurable results.',
        color: 'green',
        modules: greenBeltModules,
        finalExam: greenBeltFinalExam,
        getTotalLessons: getGreenBeltLessonCount,
        getTotalMinutes: getGreenBeltTotalMinutes,
    },
    black: {
        id: 'black',
        name: 'Black Belt',
        icon: '⬛',
        description: 'Master advanced statistics, regression, DOE, MSA, and lead organizational change initiatives.',
        color: 'black',
        modules: blackBeltModules,
        finalExam: blackBeltFinalExam,
        getTotalLessons: getBlackBeltLessonCount,
        getTotalMinutes: getBlackBeltTotalMinutes,
    },
    master: {
        id: 'master',
        name: 'Master Black Belt',
        icon: '👑',
        description: 'Lead enterprise deployment, mentor Black Belts, master DFSS, and drive strategic quality transformation.',
        color: 'master',
        modules: masterBlackBeltModules,
        finalExam: masterBlackBeltFinalExam,
        getTotalLessons: getMasterBlackBeltLessonCount,
        getTotalMinutes: getMasterBlackBeltTotalMinutes,
    },
};

interface WhiteBeltPageProps {
    belt: BeltLevel;
    onProgressUpdate?: () => void;
}

export function WhiteBeltPage({ belt, onProgressUpdate }: WhiteBeltPageProps) {
    const { moduleId: _moduleId } = useParams();
    const navigate = useNavigate();

    const config = beltConfigs[belt];
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([config.modules[0]?.id]));
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [showQuiz, setShowQuiz] = useState<{ quiz: typeof whiteBeltFinalExam; moduleId: string } | null>(null);
    const [showFinalExam, setShowFinalExam] = useState(false);
    const [certificate, setCertificate] = useState<Certificate | undefined>(undefined);

    // Load progress from IndexedDB
    useEffect(() => {
        async function loadProgress() {
            const progress = await getBeltProgress(belt);
            const completed = new Set<string>();
            progress.forEach(p => {
                if (p.completed) {
                    completed.add(p.lessonId);
                }
            });
            setCompletedLessons(completed);

            // Check for certificate
            const cert = await getCertificateByBelt(belt);
            setCertificate(cert);
        }
        loadProgress();
    }, [belt]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    const openLesson = (lesson: Lesson, modId: string) => {
        setActiveLesson(lesson);
        setActiveModuleId(modId);
        setShowQuiz(null);
        setShowFinalExam(false);
    };

    const closeLesson = () => {
        setActiveLesson(null);
        setActiveModuleId(null);
    };

    const handleLessonComplete = (lessonId: string) => {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        onProgressUpdate?.();
    };

    const openModuleQuiz = (quiz: typeof whiteBeltFinalExam, modId: string) => {
        setShowQuiz({ quiz, moduleId: modId });
        setActiveLesson(null);
        setShowFinalExam(false);
    };

    const getModuleStatus = (module: Module): 'not-started' | 'in-progress' | 'completed' => {
        const lessonIds = module.lessons.map(l => l.id);
        const completedCount = lessonIds.filter(id => completedLessons.has(id)).length;

        if (completedCount === 0) return 'not-started';
        if (completedCount === lessonIds.length) return 'completed';
        return 'in-progress';
    };

    const totalLessons = config.getTotalLessons();
    const completedCount = completedLessons.size;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // If no modules yet (other belts), show coming soon
    if (config.modules.length === 0) {
        return (
            <div className="page-container">
                <div className="belt-page">
                    <div className="belt-header">
                        <div className={`belt-icon-large ${config.color}`}>{config.icon}</div>
                        <div className="belt-info">
                            <h1 className="belt-title">{config.name} Training</h1>
                            <p className="belt-description">{config.description}</p>
                        </div>
                    </div>
                    <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
                        <div style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--space-4)' }}>🚧</div>
                        <h2>Coming Soon</h2>
                        <p className="text-muted">This belt level is currently being developed. Check back soon!</p>
                    </div>
                </div>
            </div>
        );
    }

    // If viewing a lesson
    if (activeLesson && activeModuleId) {
        return (
            <LessonViewer
                key={activeLesson.id}
                lesson={activeLesson}
                moduleId={activeModuleId}
                beltLevel={belt}
                isCompleted={completedLessons.has(activeLesson.id)}
                onComplete={handleLessonComplete}
                onClose={closeLesson}
                onNext={() => {
                    // Find next lesson
                    const module = config.modules.find(m => m.id === activeModuleId);
                    if (!module) return;
                    const currentIndex = module.lessons.findIndex(l => l.id === activeLesson.id);
                    if (currentIndex < module.lessons.length - 1) {
                        setActiveLesson(module.lessons[currentIndex + 1]);
                    } else {
                        // End of module, maybe open quiz
                        if (module.quiz) {
                            openModuleQuiz(module.quiz, activeModuleId);
                        } else {
                            closeLesson();
                        }
                    }
                }}
            />
        );
    }

    // If taking a quiz
    if (showQuiz) {
        return (
            <QuizEngine
                quiz={showQuiz.quiz}
                beltLevel={belt}
                onComplete={(passed, _score) => {
                    setShowQuiz(null);
                    if (passed) {
                        onProgressUpdate?.();
                    }
                }}
                onClose={() => setShowQuiz(null)}
            />
        );
    }

    // If taking final exam
    if (showFinalExam) {
        return (
            <QuizEngine
                quiz={config.finalExam}
                beltLevel={belt}
                isFinalExam
                onComplete={(passed, _score) => {
                    setShowFinalExam(false);
                    if (passed) {
                        onProgressUpdate?.();
                        // Certificate generation handled by certificates page
                    }
                }}
                onClose={() => setShowFinalExam(false)}
            />
        );
    }

    return (
        <div className="page-container">
            <div className="belt-page">
                {/* Header */}
                <div className="belt-header">
                    <div className={`belt-icon-large ${config.color}`}>{config.icon}</div>
                    <div className="belt-info">
                        <h1 className="belt-title">{config.name} Training</h1>
                        <p className="belt-description">{config.description}</p>
                        <div className="belt-meta">
                            <div className="belt-meta-item">
                                <span>📚</span>
                                <span><strong>{config.modules.length}</strong> Modules</span>
                            </div>
                            <div className="belt-meta-item">
                                <span>📖</span>
                                <span><strong>{totalLessons}</strong> Lessons</span>
                            </div>
                            <div className="belt-meta-item">
                                <span>⏱️</span>
                                <span><strong>{Math.round(config.getTotalMinutes() / 60)}</strong> Hours</span>
                            </div>
                        </div>
                    </div>
                    <div className="belt-progress-section">
                        <div className="belt-progress-label">Your Progress</div>
                        <div className="belt-progress-value">{progressPercent}%</div>
                        <div className="progress-bar" style={{ marginTop: 'var(--space-2)' }}>
                            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </div>

                {/* Modules */}
                <section className="modules-section">
                    <h2 className="section-title mb-6">Training Modules</h2>
                    <div className="modules-grid">
                        {config.modules.map((module, index) => {
                            const isExpanded = expandedModules.has(module.id);
                            const status = getModuleStatus(module);

                            return (
                                <div key={module.id} className="module-card">
                                    <div className="module-header" onClick={() => toggleModule(module.id)}>
                                        <div className="module-header-left">
                                            <div className={`module-number ${status === 'completed' ? 'completed' : ''}`}>
                                                {status === 'completed' ? '✓' : index + 1}
                                            </div>
                                            <div>
                                                <div className="module-title">{module.title}</div>
                                                <div className="module-description">{module.description}</div>
                                            </div>
                                        </div>
                                        <div className="module-header-right">
                                            <div className="module-time">⏱️ {module.estimatedMinutes} min</div>
                                            <div className={`module-status ${status}`}>
                                                {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Not Started'}
                                            </div>
                                            <span className={`module-expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="module-lessons">
                                            <ModuleStats
                                                moduleId={module.id}
                                                totalLessons={module.lessons.length}
                                                estimatedMinutes={module.estimatedMinutes}
                                            />
                                            {module.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className={`lesson-item ${activeLesson?.id === lesson.id ? 'active' : ''}`}
                                                    onClick={() => openLesson(lesson, module.id)}
                                                >
                                                    <div className={`lesson-checkbox ${completedLessons.has(lesson.id) ? 'completed' : ''}`}>
                                                        {completedLessons.has(lesson.id) && '✓'}
                                                    </div>
                                                    <div className="lesson-info">
                                                        <div className="lesson-title">{lesson.title}</div>
                                                        <div className="lesson-meta">
                                                            <span>⏱️ {lesson.estimatedMinutes} min</span>
                                                            {lesson.videoUrl && <span>📹 Video included</span>}
                                                        </div>
                                                    </div>
                                                    <div className="lesson-action">Start →</div>
                                                </div>
                                            ))}

                                            {/* Module Quiz */}
                                            {module.quiz && (
                                                <div
                                                    className="lesson-item quiz-card"
                                                    onClick={() => openModuleQuiz(module.quiz!, module.id)}
                                                >
                                                    <div className="quiz-info">
                                                        <span className="quiz-icon">📝</span>
                                                        <div>
                                                            <div className="quiz-title">{module.quiz.title}</div>
                                                            <div className="quiz-meta">{module.quiz.questions.length} questions • {module.quiz.passingScore}% to pass</div>
                                                        </div>
                                                    </div>
                                                    <div className="lesson-action">Take Quiz →</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Final Exam */}
                <div className="final-exam-card">
                    <div className="final-exam-icon">🏆</div>
                    <h2 className="final-exam-title">{config.name} Certification Exam</h2>

                    {certificate ? (
                        <div className="certificate-earned-message text-center">
                            <p className="text-xl mb-4">🎉 Congratulations! You have already earned this certificate.</p>
                            <p className="text-muted mb-6">Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/certificates')}
                            >
                                View My Certificate
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="final-exam-description">
                                Complete all modules and pass this final exam to earn your {config.name} certification.
                            </p>
                            <div className="final-exam-requirements">
                                <div className="requirement">
                                    <div className="requirement-value">{config.finalExam.questions.length}</div>
                                    <div className="requirement-label">Questions</div>
                                </div>
                                <div className="requirement">
                                    <div className="requirement-value">{config.finalExam.passingScore}%</div>
                                    <div className="requirement-label">Passing Score</div>
                                </div>
                                <div className="requirement">
                                    <div className="requirement-value">{config.finalExam.timeLimit || 30}</div>
                                    <div className="requirement-label">Minutes</div>
                                </div>
                            </div>
                            <button
                                className="btn btn-gold btn-lg"
                                onClick={() => setShowFinalExam(true)}
                                disabled={progressPercent < 80}
                            >
                                {progressPercent < 80 ? `Complete ${80 - progressPercent}% more to unlock` : 'Start Certification Exam'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
