import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar/Navbar';
import { Sidebar } from './components/layout/Sidebar/Sidebar';
import { Home } from './pages/Home/Home';
import { WhiteBeltPage } from './pages/belts/WhiteBeltPage';
import { Chatbot } from './components/features/Chatbot/Chatbot';
import { BeltLevel } from './types';
import { getBeltProgress } from './utils/db';
import { CertificatesPage } from './pages/certificates/CertificatesPage';
import { CertificateValidatePage } from './pages/certificates/CertificateValidatePage';


// Real Tools pages with content
function ToolsPage({ tool, content }: { tool: string; content: React.ReactNode }) {
    return (
        <div className="page-container">
            <h1>{tool}</h1>
            <div className="content-section">
                {content}
            </div>
        </div>
    );
}

// Lean methodology pages
function LeanPage({ topic, content }: { topic: string; content: React.ReactNode }) {
    return (
        <div className="page-container">
            <h1>🏭 {topic}</h1>
            <div className="content-section lean-content">
                {content}
            </div>
        </div>
    );
}

function IndustryPage({ industry, content }: { industry: string; content: React.ReactNode }) {
    return (
        <div className="page-container">
            <h1>{industry} Industry Module</h1>
            <div className="content-section">
                {content}
            </div>
        </div>
    );
}


// Inline components moved to their own files


function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [beltProgress, setBeltProgress] = useState<Record<BeltLevel, number>>({
        white: 0,
        yellow: 0,
        green: 0,
        black: 0,
        master: 0,
    });

    const loadProgress = useCallback(async () => {
        const belts: BeltLevel[] = ['white', 'yellow', 'green', 'black', 'master'];
        const progress: Record<BeltLevel, number> = {
            white: 0,
            yellow: 0,
            green: 0,
            black: 0,
            master: 0,
        };

        for (const belt of belts) {
            try {
                const beltData = await getBeltProgress(belt);
                const completed = beltData.filter(p => p.completed).length;
                const total = beltData.length || 1;
                progress[belt] = Math.round((completed / total) * 100);
            } catch {
                // IndexedDB not initialized yet, use 0
            }
        }

        setBeltProgress(progress);
    }, []);

    useEffect(() => {
        loadProgress();
    }, [loadProgress]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="app-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                beltProgress={beltProgress}
            />
            <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />

            <main className="main-content">
                <Routes>
                    {/* Home / Dashboard */}
                    <Route path="/" element={<Home beltProgress={beltProgress} />} />

                    {/* Belt Levels */}
                    <Route path="/belts/white" element={<WhiteBeltPage belt="white" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/white/:moduleId" element={<WhiteBeltPage belt="white" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/yellow" element={<WhiteBeltPage belt="yellow" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/yellow/:moduleId" element={<WhiteBeltPage belt="yellow" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/green" element={<WhiteBeltPage belt="green" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/green/:moduleId" element={<WhiteBeltPage belt="green" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/black" element={<WhiteBeltPage belt="black" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/black/:moduleId" element={<WhiteBeltPage belt="black" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/master" element={<WhiteBeltPage belt="master" onProgressUpdate={loadProgress} />} />
                    <Route path="/belts/master/:moduleId" element={<WhiteBeltPage belt="master" onProgressUpdate={loadProgress} />} />

                    {/* Tools */}
                    <Route path="/tools/control-charts" element={
                        <ToolsPage tool="📊 Control Charts" content={
                            <div>
                                <p>Control charts monitor process stability over time. Types:</p>
                                <ul>
                                    <li><strong>X-bar R Chart</strong> - Subgroup means and ranges (n=2-10)</li>
                                    <li><strong>I-MR Chart</strong> - Individual measurements</li>
                                    <li><strong>P Chart</strong> - Proportion defective</li>
                                    <li><strong>C Chart</strong> - Count of defects</li>
                                </ul>
                                <h3>Control Limit Formulas</h3>
                                <p>UCL = X̄ + A₂R̄ | LCL = X̄ - A₂R̄</p>
                                <p className="tip">💡 Use the chatbot to generate Python code for control charts!</p>
                            </div>
                        } />
                    } />
                    <Route path="/tools/capability" element={
                        <ToolsPage tool="📐 Capability Calculator" content={
                            <div>
                                <h3>Process Capability Indices</h3>
                                <ul>
                                    <li><strong>Cp</strong> = (USL - LSL) / 6σ - Potential capability</li>
                                    <li><strong>Cpk</strong> = min[(USL - μ)/3σ, (μ - LSL)/3σ] - Actual capability</li>
                                    <li><strong>Ppk</strong> = Performance index (uses overall std dev)</li>
                                </ul>
                                <h3>Interpretation</h3>
                                <table className="simple-table">
                                    <tbody>
                                        <tr><td>Cpk &lt; 1.0</td><td>Not capable</td></tr>
                                        <tr><td>Cpk 1.0-1.33</td><td>Marginally capable</td></tr>
                                        <tr><td>Cpk ≥ 1.33</td><td>Capable</td></tr>
                                        <tr><td>Cpk ≥ 1.67</td><td>Excellent</td></tr>
                                    </tbody>
                                </table>
                                <p className="tip">💡 Upload Excel data to the chatbot for automatic Cpk calculation!</p>
                            </div>
                        } />
                    } />
                    <Route path="/tools/fishbone" element={
                        <ToolsPage tool="🐟 Fishbone Diagram (Ishikawa)" content={
                            <div>
                                <p>Root cause analysis using the 6M categories:</p>
                                <ul>
                                    <li><strong>Man</strong> - People, skills, training</li>
                                    <li><strong>Machine</strong> - Equipment, tools, technology</li>
                                    <li><strong>Method</strong> - Procedures, processes</li>
                                    <li><strong>Material</strong> - Raw materials, supplies</li>
                                    <li><strong>Measurement</strong> - Inspection, data collection</li>
                                    <li><strong>Mother Nature</strong> - Environment, conditions</li>
                                </ul>
                                <h3>Steps</h3>
                                <ol>
                                    <li>Define the problem (effect) on the right</li>
                                    <li>Draw main branches for each category</li>
                                    <li>Brainstorm causes for each branch</li>
                                    <li>Ask "5 Whys" for each cause</li>
                                </ol>
                            </div>
                        } />
                    } />
                    <Route path="/tools/doe" element={
                        <ToolsPage tool="🔬 DOE Planner" content={
                            <div>
                                <h3>Design of Experiments</h3>
                                <ul>
                                    <li><strong>Full Factorial</strong> - 2^k runs, all combinations</li>
                                    <li><strong>Fractional Factorial</strong> - 2^(k-p) runs, reduced</li>
                                    <li><strong>Response Surface</strong> - Optimization</li>
                                </ul>
                                <h3>Resolution Levels</h3>
                                <ul>
                                    <li><strong>III</strong> - Main effects aliased with 2-way (screening)</li>
                                    <li><strong>IV</strong> - Main clear, 2-way aliased with 2-way</li>
                                    <li><strong>V</strong> - Main and 2-way clear</li>
                                </ul>
                                <p className="tip">💡 Ask the chatbot for "python doe code" to generate analysis scripts!</p>
                            </div>
                        } />
                    } />

                    {/* Lean Routes */}
                    <Route path="/lean/5s" element={
                        <LeanPage topic="5S Methodology" content={
                            <div>
                                <table className="simple-table">
                                    <tbody>
                                        <tr><td>🧹 <strong>Sort</strong> (Seiri)</td><td>Remove unnecessary items</td></tr>
                                        <tr><td>📐 <strong>Set in Order</strong> (Seiton)</td><td>Organize remaining items</td></tr>
                                        <tr><td>✨ <strong>Shine</strong> (Seiso)</td><td>Clean thoroughly</td></tr>
                                        <tr><td>📋 <strong>Standardize</strong> (Seiketsu)</td><td>Create standards</td></tr>
                                        <tr><td>💪 <strong>Sustain</strong> (Shitsuke)</td><td>Maintain discipline</td></tr>
                                    </tbody>
                                </table>
                                <h3>Benefits</h3>
                                <ul>
                                    <li>Improved safety and morale</li>
                                    <li>Reduced waste and search time</li>
                                    <li>Foundation for other improvements</li>
                                </ul>
                            </div>
                        } />
                    } />
                    <Route path="/lean/vsm" element={
                        <LeanPage topic="Value Stream Mapping" content={
                            <div>
                                <p>VSM documents material and information flow to identify waste.</p>
                                <h3>Key Metrics</h3>
                                <ul>
                                    <li><strong>Cycle Time</strong> - Time per unit</li>
                                    <li><strong>Takt Time</strong> - Available time / Demand</li>
                                    <li><strong>Lead Time</strong> - Total start to finish</li>
                                    <li><strong>% Value-Add</strong> - Process time / Lead time</li>
                                </ul>
                                <h3>Steps</h3>
                                <ol>
                                    <li>Select product family</li>
                                    <li>Map current state</li>
                                    <li>Identify waste (Kaizen bursts)</li>
                                    <li>Design future state</li>
                                </ol>
                            </div>
                        } />
                    } />
                    <Route path="/lean/wastes" element={
                        <LeanPage topic="8 Wastes (DOWNTIME)" content={
                            <div>
                                <table className="simple-table">
                                    <tbody>
                                        <tr><td><strong>D</strong>efects</td><td>Errors requiring rework</td></tr>
                                        <tr><td><strong>O</strong>verproduction</td><td>Making more than needed</td></tr>
                                        <tr><td><strong>W</strong>aiting</td><td>Idle time, delays</td></tr>
                                        <tr><td><strong>N</strong>on-utilized Talent</td><td>Underusing skills</td></tr>
                                        <tr><td><strong>T</strong>ransportation</td><td>Moving materials unnecessarily</td></tr>
                                        <tr><td><strong>I</strong>nventory</td><td>Excess stock/WIP</td></tr>
                                        <tr><td><strong>M</strong>otion</td><td>Unnecessary people movement</td></tr>
                                        <tr><td><strong>E</strong>xtra Processing</td><td>Doing more than required</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        } />
                    } />
                    <Route path="/lean/kaizen" element={
                        <LeanPage topic="Kaizen Events" content={
                            <div>
                                <p>Kaizen = Continuous improvement through rapid events.</p>
                                <h3>Event Structure</h3>
                                <ul>
                                    <li><strong>Prep</strong> (2-4 weeks) - Scope, team, data</li>
                                    <li><strong>Day 1</strong> - Training, observation</li>
                                    <li><strong>Day 2-3</strong> - Root cause, brainstorm</li>
                                    <li><strong>Day 4</strong> - Implement quick wins</li>
                                    <li><strong>Day 5</strong> - Standardize, present</li>
                                    <li><strong>Follow-up</strong> (30 days) - Sustain</li>
                                </ul>
                            </div>
                        } />
                    } />

                    {/* Industry Modules */}
                    <Route path="/industry/compliance" element={
                        <IndustryPage industry="📋 Compliance" content={
                            <div>
                                <h3>Key Regulations</h3>
                                <ul>
                                    <li><strong>REACH</strong> - EU chemical regulation</li>
                                    <li><strong>RoHS</strong> - Hazardous substances in electronics</li>
                                    <li><strong>FDA</strong> - US medical/pharma requirements</li>
                                    <li><strong>ISO 9001</strong> - Quality management</li>
                                </ul>
                                <p className="tip">💡 Use the chatbot to search SVHC substances by CAS number!</p>
                            </div>
                        } />
                    } />
                    <Route path="/industry/plastics" element={
                        <IndustryPage industry="🏭 Plastics Manufacturing" content={
                            <div>
                                <h3>Key Concerns</h3>
                                <ul>
                                    <li>Phthalate plasticizers (DEHP, DBP, BBP are SVHC)</li>
                                    <li>Brominated flame retardants</li>
                                    <li>Heavy metal stabilizers</li>
                                    <li>BPA in polycarbonates</li>
                                </ul>
                                <h3>REACH Article 33</h3>
                                <p>Must inform customers if SVHC &gt; 0.1% by weight.</p>
                            </div>
                        } />
                    } />

                    {/* Certificates */}
                    <Route path="/certificates" element={<CertificatesPage />} />
                    <Route path="/certificates/:id" element={<CertificateValidatePage />} />

                    {/* 404 */}
                    <Route path="*" element={
                        <div className="page-container text-center">
                            <h1>404 - Page Not Found</h1>
                            <p className="text-muted">The page you're looking for doesn't exist.</p>
                        </div>
                    } />
                </Routes>
            </main>
            <Chatbot />
        </div>
    );
}

export default App;
