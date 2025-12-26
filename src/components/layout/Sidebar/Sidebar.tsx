import { NavLink } from 'react-router-dom';
import { BeltLevel } from '../../../types';
import './Sidebar.css';

interface BeltNavItem {
    id: BeltLevel;
    name: string;
    icon: string;
    path: string;
    progress: number;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    beltProgress: Record<BeltLevel, number>;
}

const beltItems: BeltNavItem[] = [
    { id: 'white', name: 'White Belt', icon: '⬜', path: '/belts/white', progress: 0 },
    { id: 'yellow', name: 'Yellow Belt', icon: '🟨', path: '/belts/yellow', progress: 0 },
    { id: 'green', name: 'Green Belt', icon: '🟩', path: '/belts/green', progress: 0 },
    { id: 'black', name: 'Black Belt', icon: '⬛', path: '/belts/black', progress: 0 },
    { id: 'master', name: 'Master Black Belt', icon: '👑', path: '/belts/master', progress: 0 },
];

const toolItems = [
    { name: 'Control Charts', icon: '📊', path: '/tools/control-charts' },
    { name: 'Capability Calculator', icon: '📐', path: '/tools/capability' },
    { name: 'Fishbone Diagram', icon: '🐟', path: '/tools/fishbone' },
    { name: 'DOE Planner', icon: '🔬', path: '/tools/doe' },
];

const leanItems = [
    { name: '5S Methodology', icon: '🧹', path: '/lean/5s' },
    { name: 'Value Stream Mapping', icon: '🗺️', path: '/lean/vsm' },
    { name: '8 Wastes', icon: '🗑️', path: '/lean/wastes' },
    { name: 'Kaizen', icon: '📈', path: '/lean/kaizen' },
];

export function Sidebar({ isOpen, onClose, beltProgress }: SidebarProps) {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-title">Training Modules</div>
                    <div className="sidebar-subtitle">Complete Certification Path</div>
                </div>

                <nav className="sidebar-nav">
                    {/* Home / Dashboard */}
                    <div className="nav-section">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-icon">🏠</span>
                            Dashboard
                        </NavLink>
                    </div>

                    {/* Belt Levels */}
                    <div className="nav-section">
                        <div className="nav-section-title">Certification Levels</div>
                        {beltItems.map((belt) => (
                            <NavLink
                                key={belt.id}
                                to={belt.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <span className="nav-icon">{belt.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div>{belt.name}</div>
                                    <div className="belt-progress-mini">
                                        <div className="belt-progress-bar-mini">
                                            <div
                                                className="belt-progress-fill-mini"
                                                style={{ width: `${beltProgress[belt.id] || 0}%` }}
                                            />
                                        </div>
                                        <span className="belt-progress-text">
                                            {beltProgress[belt.id] || 0}%
                                        </span>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>

                    {/* Tools */}
                    <div className="nav-section">
                        <div className="nav-section-title">Statistical Tools</div>
                        {toolItems.map((tool) => (
                            <NavLink
                                key={tool.path}
                                to={tool.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <span className="nav-icon">{tool.icon}</span>
                                {tool.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Lean */}
                    <div className="nav-section">
                        <div className="nav-section-title">Lean Tools</div>
                        {leanItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Industry Modules */}
                    <div className="nav-section">
                        <div className="nav-section-title">Industry Focus</div>
                        <NavLink
                            to="/industry/compliance"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-icon">📋</span>
                            Compliance
                        </NavLink>
                        <NavLink
                            to="/industry/plastics"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-icon">🏭</span>
                            Plastics Manufacturing
                        </NavLink>
                    </div>

                    {/* Certificates */}
                    <div className="nav-section">
                        <NavLink
                            to="/certificates"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="nav-icon">🏆</span>
                            My Certificates
                        </NavLink>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-stats">
                        <div className="sidebar-stat">
                            <div className="sidebar-stat-value">0</div>
                            <div className="sidebar-stat-label">Lessons</div>
                        </div>
                        <div className="sidebar-stat">
                            <div className="sidebar-stat-value">0</div>
                            <div className="sidebar-stat-label">Hours</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
