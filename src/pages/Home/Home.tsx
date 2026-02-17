import { Link } from 'react-router-dom';
import { BeltLevel } from '../../types';
import { ProgressDashboard } from '../../components/features/ProgressDashboard';
import { StudyStreak } from '../../components/features/Gamification';
import './Home.css';

interface BeltCardData {
    id: BeltLevel;
    name: string;
    icon: string;
    hours: string;
    modules: number;
    description: string;
    color: string;
}

const belts: BeltCardData[] = [
    {
        id: 'white',
        name: 'White Belt',
        icon: '⬜',
        hours: '4-6 hours',
        modules: 5,
        description: 'Foundation level introducing Six Sigma basics, key terminology, and the role of team members in quality improvement.',
        color: 'white',
    },
    {
        id: 'yellow',
        name: 'Yellow Belt',
        icon: '🟨',
        hours: '8-12 hours',
        modules: 7,
        description: 'Learn DMAIC fundamentals, basic quality tools, process mapping, and effective team participation.',
        color: 'yellow',
    },
    {
        id: 'green',
        name: 'Green Belt',
        icon: '🟩',
        hours: '40+ hours',
        modules: 10,
        description: 'Complete DMAIC mastery, statistical process control, Lean principles, and project leadership skills.',
        color: 'green',
    },
    {
        id: 'black',
        name: 'Black Belt',
        icon: '⬛',
        hours: '80+ hours',
        modules: 11,
        description: 'Advanced statistics, DOE, hypothesis testing, MSA, DFSS, and organizational change leadership.',
        color: 'black',
    },
    {
        id: 'master',
        name: 'Master Black Belt',
        icon: '👑',
        hours: '100+ hours',
        modules: 5,
        description: 'Enterprise deployment, mentoring excellence, advanced analytics, and strategic quality leadership.',
        color: 'master',
    },
];

const features = [
    { icon: '📚', title: 'Comprehensive Content', description: 'Real certification-level curriculum sourced from ASQ standards', link: '/belts/white' },
    { icon: '🎯', title: 'Interactive Quizzes', description: 'Test your knowledge with practice exams and assessments', link: '/belts/white?tab=quiz' },
    { icon: '📊', title: 'Statistical Tools', description: 'Built-in calculators for SPC, DOE, and capability analysis', link: '/tools/capability' },
    { icon: '🏆', title: 'Certificates', description: 'Earn certificates upon completing each belt level', link: '/certificates' },
    { icon: '📹', title: 'Video Lessons', description: 'Learn from embedded video content and tutorials', link: '/belts/white' },
    { icon: '💾', title: 'Progress Tracking', description: 'Your progress is saved locally and persists between sessions', link: '/' },
];

interface HomeProps {
    beltProgress: Record<BeltLevel, number>;
}

export function Home({ beltProgress }: HomeProps) {
    return (
        <div className="home-page">
            {/* Progress Dashboard with Study Streak */}
            <div className="dashboard-row">
                <ProgressDashboard />
                <StudyStreak />
            </div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">🎓 Complete Certification Training</span>
                    <h1 className="hero-title">Six Sigma Academy</h1>
                    <p className="hero-subtitle">
                        Master the Six Sigma methodology from White Belt to Master Black Belt.
                        Comprehensive training focused on Compliance and Plastics manufacturing.
                    </p>
                    <div className="hero-actions">
                        <Link to="/belts/white" className="btn btn-primary btn-lg">
                            Start Learning
                        </Link>
                        <Link to="/tools/control-charts" className="btn btn-secondary btn-lg">
                            Explore Tools
                        </Link>
                    </div>
                </div>
            </section>

            {/* Belt Cards */}
            <section className="belt-cards-section">
                <div className="section-header">
                    <h2 className="section-title">Certification Path</h2>
                </div>
                <div className="belt-cards-grid">
                    {belts.map((belt) => (
                        <Link
                            key={belt.id}
                            to={`/belts/${belt.id}`}
                            className={`belt-card ${belt.color}`}
                        >
                            <div className="belt-card-header">
                                <div className={`belt-icon ${belt.color}`}>{belt.icon}</div>
                                <div>
                                    <div className="belt-card-title">{belt.name}</div>
                                    <div className="belt-card-hours">{belt.hours}</div>
                                </div>
                            </div>
                            <p className="belt-card-description">{belt.description}</p>
                            <div className="belt-card-stats">
                                <div className="belt-stat">
                                    <div className="belt-stat-value">{belt.modules}</div>
                                    <div className="belt-stat-label">Modules</div>
                                </div>
                                <div className="belt-stat">
                                    <div className="belt-stat-value">{belt.hours.split(' ')[0]}</div>
                                    <div className="belt-stat-label">Hours</div>
                                </div>
                            </div>
                            <div className="belt-card-progress">
                                <div className="belt-progress-label">
                                    <span>Progress</span>
                                    <span>{beltProgress[belt.id] || 0}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${beltProgress[belt.id] || 0}%` }}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Platform Features</h2>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <Link key={index} to={feature.link} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Industry Focus */}
            <section className="industry-section">
                <div className="section-header">
                    <h2 className="section-title">Industry Specialization</h2>
                </div>
                <div className="industry-cards">
                    <Link to="/industry/compliance" className="industry-card">
                        <div className="industry-icon">📋</div>
                        <div className="industry-content">
                            <h3 className="industry-title">Compliance & Regulatory</h3>
                            <p className="industry-description">
                                Learn Six Sigma applications in regulatory environments including ISO, FDA, and automotive standards.
                            </p>
                            <div className="industry-topics">
                                <span className="industry-topic">ISO 9001</span>
                                <span className="industry-topic">IATF 16949</span>
                                <span className="industry-topic">FDA Compliance</span>
                                <span className="industry-topic">Auditing</span>
                            </div>
                        </div>
                    </Link>
                    <Link to="/industry/plastics" className="industry-card">
                        <div className="industry-icon">🏭</div>
                        <div className="industry-content">
                            <h3 className="industry-title">Plastics Manufacturing</h3>
                            <p className="industry-description">
                                Specialized content for injection molding, extrusion, and plastics process optimization.
                            </p>
                            <div className="industry-topics">
                                <span className="industry-topic">Injection Molding</span>
                                <span className="industry-topic">SPC for Plastics</span>
                                <span className="industry-topic">Mold DOE</span>
                                <span className="industry-topic">Defect Analysis</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
