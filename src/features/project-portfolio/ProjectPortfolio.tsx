/**
 * Project Portfolio Component
 * 
 * DMAIC project workspace for tracking real-world improvement projects
 */

import { useState, useEffect, useCallback } from 'react';
import { DMAICProject } from '../../utils/db.schema';
import {
    getUserProjects,
    createProject,
    setCurrentPhase,
    updateChecklistItem,
    updatePhaseNotes,
    getProjectStatistics,
} from './projectPortfolio.db';
import { Loading } from '../../components/common/Loading/Loading';
import './ProjectPortfolio.css';

const USER_ID = 'current-user';
const PHASES: DMAICProject['currentPhase'][] = ['define', 'measure', 'analyze', 'improve', 'control'];

const PHASE_COLORS: Record<string, string> = {
    define: '#3b82f6',
    measure: '#8b5cf6',
    analyze: '#f59e0b',
    improve: '#10b981',
    control: '#ef4444',
};

export function ProjectPortfolio() {
    const [projects, setProjects] = useState<DMAICProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<DMAICProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ total: number; active: number; completed: number } | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loadProjects = useCallback(async () => {
        setLoading(true);
        try {
            const userProjects = await getUserProjects(USER_ID);
            setProjects(userProjects);
            const projectStats = await getProjectStatistics(USER_ID);
            setStats(projectStats);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            const newProject = await createProject(USER_ID, {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                industry: formData.get('industry') as string,
                organization: formData.get('organization') as string,
            });
            setProjects(prev => [newProject, ...prev]);
            setShowCreateModal(false);
            setSelectedProject(newProject);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    if (loading) {
        return <Loading message="Loading projects..." />;
    }

    if (selectedProject) {
        return (
            <ProjectWorkspace
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                onUpdate={(updated) => {
                    setSelectedProject(updated);
                    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
                }}
            />
        );
    }

    return (
        <div className="portfolio-container">
            <div className="portfolio-header">
                <h1 className="portfolio-title">Project Portfolio</h1>
                <p className="portfolio-subtitle">Track your real-world DMAIC improvement projects</p>
            </div>

            {stats && (
                <div className="portfolio-stats">
                    <div className="portfolio-stat-card">
                        <div className="portfolio-stat-value">{stats.total}</div>
                        <div className="portfolio-stat-label">Total Projects</div>
                    </div>
                    <div className="portfolio-stat-card">
                        <div className="portfolio-stat-value">{stats.active}</div>
                        <div className="portfolio-stat-label">Active</div>
                    </div>
                    <div className="portfolio-stat-card">
                        <div className="portfolio-stat-value">{stats.completed}</div>
                        <div className="portfolio-stat-label">Completed</div>
                    </div>
                </div>
            )}

            <div className="portfolio-actions">
                <button
                    className="portfolio-create-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    + New Project
                </button>
            </div>

            <div className="portfolio-grid">
                {projects.length === 0 ? (
                    <div className="portfolio-empty">
                        <p>No projects yet. Create your first DMAIC project!</p>
                    </div>
                ) : (
                    projects.map(project => (
                        <div
                            key={project.id}
                            className="portfolio-card"
                            onClick={() => setSelectedProject(project)}
                            role="button"
                            tabIndex={0}
                        >
                            <div
                                className="portfolio-card-phase"
                                style={{ background: PHASE_COLORS[project.currentPhase] }}
                            >
                                {project.currentPhase.toUpperCase()}
                            </div>
                            <h3 className="portfolio-card-title">{project.title}</h3>
                            <p className="portfolio-card-industry">{project.industry}</p>
                            <p className="portfolio-card-desc">{project.description}</p>
                            <div className="portfolio-card-meta">
                                <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                                <span className={`portfolio-status ${project.status}`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreateModal && (
                <div className="portfolio-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="portfolio-modal" onClick={e => e.stopPropagation()}>
                        <h2>Create New Project</h2>
                        <form onSubmit={handleCreateProject}>
                            <div className="portfolio-form-group">
                                <label>Project Title</label>
                                <input name="title" required placeholder="e.g., Reduce Assembly Defects" />
                            </div>
                            <div className="portfolio-form-group">
                                <label>Industry</label>
                                <select name="industry" required>
                                    <option value="">Select industry...</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Service">Service</option>
                                    <option value="IT/Software">IT/Software</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="portfolio-form-group">
                                <label>Organization (optional)</label>
                                <input name="organization" placeholder="Company or department name" />
                            </div>
                            <div className="portfolio-form-group">
                                <label>Description</label>
                                <textarea name="description" rows={3} placeholder="Brief project description..." />
                            </div>
                            <div className="portfolio-modal-actions">
                                <button type="button" className="portfolio-btn-secondary" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="portfolio-btn-primary">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Project Workspace Component
interface ProjectWorkspaceProps {
    project: DMAICProject;
    onBack: () => void;
    onUpdate: (project: DMAICProject) => void;
}

function ProjectWorkspace({ project, onBack, onUpdate }: ProjectWorkspaceProps) {
    const [activePhase, setActivePhase] = useState(project.currentPhase);
    const [activeTab, setActiveTab] = useState<'checklist' | 'notes' | 'tools'>('checklist');

    const handleChecklistToggle = async (itemId: string, completed: boolean) => {
        const updated = await updateChecklistItem(project.id, activePhase, itemId, completed);
        onUpdate(updated);
    };

    const handlePhaseChange = async (phase: DMAICProject['currentPhase']) => {
        const updated = await setCurrentPhase(project.id, phase);
        onUpdate(updated);
        setActivePhase(phase);
    };

    const handleNotesUpdate = async (notes: string) => {
        const updated = await updatePhaseNotes(project.id, activePhase, notes);
        onUpdate(updated);
    };

    const phaseData = project.phases[activePhase];
    const completedCount = phaseData.checklist.filter(i => i.completed).length;
    const progress = (completedCount / phaseData.checklist.length) * 100;

    return (
        <div className="portfolio-workspace">
            <div className="portfolio-workspace-header">
                <button className="portfolio-back-btn" onClick={onBack}>← Back</button>
                <div>
                    <h1>{project.title}</h1>
                    <p>{project.industry} {project.organization && `• ${project.organization}`}</p>
                </div>
            </div>

            <div className="portfolio-phase-nav">
                {PHASES.map(phase => {
                    const isActive = phase === activePhase;
                    const isCurrent = phase === project.currentPhase;
                    const phaseProgress = project.phases[phase].checklist.filter(i => i.completed).length;
                    const phaseTotal = project.phases[phase].checklist.length;
                    
                    return (
                        <button
                            key={phase}
                            className={`portfolio-phase-btn ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                            style={{ 
                                borderColor: isActive ? PHASE_COLORS[phase] : undefined,
                                background: isActive ? `${PHASE_COLORS[phase]}20` : undefined 
                            }}
                            onClick={() => handlePhaseChange(phase)}
                        >
                            <span className="portfolio-phase-name">{phase.charAt(0).toUpperCase() + phase.slice(1)}</span>
                            <span className="portfolio-phase-progress">
                                {phaseProgress}/{phaseTotal}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="portfolio-workspace-tabs">
                <button 
                    className={activeTab === 'checklist' ? 'active' : ''}
                    onClick={() => setActiveTab('checklist')}
                >
                    Checklist
                </button>
                <button 
                    className={activeTab === 'notes' ? 'active' : ''}
                    onClick={() => setActiveTab('notes')}
                >
                    Notes
                </button>
                <button 
                    className={activeTab === 'tools' ? 'active' : ''}
                    onClick={() => setActiveTab('tools')}
                >
                    Tools
                </button>
            </div>

            <div className="portfolio-workspace-content">
                {activeTab === 'checklist' && (
                    <div className="portfolio-checklist">
                        <div className="portfolio-checklist-header">
                            <h3>{activePhase.charAt(0).toUpperCase() + activePhase.slice(1)} Phase Checklist</h3>
                            <div className="portfolio-progress">
                                <div className="portfolio-progress-bar">
                                    <div style={{ width: `${progress}%`, background: PHASE_COLORS[activePhase] }} />
                                </div>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                        </div>
                        <div className="portfolio-checklist-items">
                            {phaseData.checklist.map(item => (
                                <label key={item.id} className={`portfolio-checklist-item ${item.completed ? 'completed' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={e => handleChecklistToggle(item.id, e.target.checked)}
                                    />
                                    <span>{item.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="portfolio-notes">
                        <h3>Phase Notes</h3>
                        <textarea
                            value={phaseData.notes}
                            onChange={e => handleNotesUpdate(e.target.value)}
                            placeholder={`Add notes for the ${activePhase} phase...`}
                            rows={10}
                        />
                    </div>
                )}

                {activeTab === 'tools' && (
                    <div className="portfolio-tools">
                        <h3>Analysis Tools</h3>
                        <p>Tools will appear here (Fishbone, Control Charts, etc.)</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectPortfolio;
