import { Module, Quiz } from '../../types';

// Green Belt Module Content
// Sources: ASQ.org, Coursera, GoLeanSixSigma.com, 6Sigma.us

export const greenBeltModules: Module[] = [
    {
        id: 'gb-leadership',
        title: 'Green Belt Leadership',
        description: 'Project leadership, team dynamics, and change management skills.',
        beltLevel: 'green',
        order: 1,
        estimatedMinutes: 45,
        lessons: [
            {
                id: 'gb-leadership-1',
                title: 'The Green Belt Role',
                order: 1,
                estimatedMinutes: 15,
                videoUrl: 'https://www.youtube.com/embed/O_8nLxrmREE',
                videoTitle: 'Six Sigma Green Belt Introduction',
                content: `
<h2>Green Belt: The Project Leader</h2>

<p>A <strong>Green Belt</strong> leads improvement projects part-time (25-50% of their role) while maintaining regular job responsibilities.</p>

<h3>Green Belt Responsibilities</h3>
<ul>
  <li>Lead DMAIC improvement projects</li>
  <li>Collect and analyze data using statistical tools</li>
  <li>Guide Yellow and White Belt team members</li>
  <li>Report progress to Black Belt mentors and sponsors</li>
  <li>Implement sustainable process improvements</li>
  <li>Calculate and validate project savings</li>
</ul>

<h3>Key Competencies</h3>
<table>
  <thead>
    <tr><th>Area</th><th>Skills Required</th></tr>
  </thead>
  <tbody>
    <tr><td>Technical</td><td>SPC, hypothesis testing, process capability, DOE basics</td></tr>
    <tr><td>Leadership</td><td>Team facilitation, conflict resolution, change management</td></tr>
    <tr><td>Communication</td><td>Stakeholder updates, executive presentations, documentation</td></tr>
    <tr><td>Project Management</td><td>Timeline management, resource allocation, risk mitigation</td></tr>
  </tbody>
</table>
        `
            },
            {
                id: 'gb-leadership-2',
                title: 'Team Dynamics & Facilitation',
                order: 2,
                estimatedMinutes: 15,
                content: `
<h2>Leading High-Performance Teams</h2>

<h3>Tuckman's Stages of Team Development</h3>
<ol>
  <li><strong>Forming:</strong> Team comes together, polite but uncertain</li>
  <li><strong>Storming:</strong> Conflicts emerge, roles challenged</li>
  <li><strong>Norming:</strong> Ground rules established, collaboration begins</li>
  <li><strong>Performing:</strong> High productivity, autonomous problem-solving</li>
  <li><strong>Adjourning:</strong> Project ends, team disbands</li>
</ol>

<h3>Effective Meeting Facilitation</h3>
<ul>
  <li>Set clear agenda and objectives</li>
  <li>Define roles (facilitator, timekeeper, scribe)</li>
  <li>Use structured brainstorming techniques</li>
  <li>Encourage all voices to be heard</li>
  <li>Document action items with owners and deadlines</li>
</ul>

<h3>Managing Resistance to Change</h3>
<ul>
  <li><strong>Communicate why:</strong> Explain benefits and business case</li>
  <li><strong>Involve stakeholders:</strong> Include affected people in planning</li>
  <li><strong>Address concerns:</strong> Listen and respond to fears</li>
  <li><strong>Celebrate quick wins:</strong> Build momentum with early successes</li>
</ul>
        `
            },
            {
                id: 'gb-leadership-3',
                title: 'Project Selection & Scoping',
                order: 3,
                estimatedMinutes: 15,
                content: `
<h2>Selecting the Right Project</h2>

<h3>Good Project Characteristics</h3>
<ul>
  <li>Clear link to business strategy</li>
  <li>Measurable baseline and target</li>
  <li>Manageable scope (3-6 months)</li>
  <li>Champion support and resources</li>
  <li>Data available or collectible</li>
</ul>

<h3>Project Selection Matrix</h3>
<p>Score potential projects on:</p>
<ul>
  <li><strong>Financial Impact:</strong> Cost savings or revenue gain</li>
  <li><strong>Customer Impact:</strong> Satisfaction, loyalty, complaints</li>
  <li><strong>Strategic Alignment:</strong> Supports company goals</li>
  <li><strong>Feasibility:</strong> Resources, timeline, complexity</li>
</ul>

<h3>Scope Creep Prevention</h3>
<ul>
  <li>Define clear in-scope/out-of-scope boundaries</li>
  <li>Use SIPOC to establish process boundaries</li>
  <li>Get sponsor approval for any scope changes</li>
  <li>Focus on solving one problem at a time</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'gb-leadership-quiz',
            title: 'Green Belt Leadership Quiz',
            description: 'Test your leadership knowledge.',
            passingScore: 70,
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'What percentage of time does a Green Belt typically spend on projects?', options: ['5-10%', '25-50%', '75-100%', '0%'], correctAnswer: 1, explanation: 'Green Belts typically spend 25-50% of their time on improvement projects.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'In Tuckman\'s model, which stage involves conflicts and role challenges?', options: ['Forming', 'Storming', 'Norming', 'Performing'], correctAnswer: 1, explanation: 'Storming is when team conflicts emerge and roles are challenged.', points: 10 },
                { id: 'q3', type: 'multiple-choice', question: 'A good Six Sigma project should be completable in:', options: ['1-2 weeks', '3-6 months', '1-2 years', '5+ years'], correctAnswer: 1, explanation: 'Projects should be scoped for 3-6 months for best results.', points: 10 }
            ]
        }
    },
    {
        id: 'gb-statistics',
        title: 'Statistical Foundations',
        description: 'Essential statistics for data-driven decision making.',
        beltLevel: 'green',
        order: 2,
        estimatedMinutes: 60,
        lessons: [
            {
                id: 'gb-stats-1',
                title: 'Descriptive Statistics',
                order: 1,
                estimatedMinutes: 20,
                videoUrl: 'https://www.youtube.com/embed/xxpc-HPKN28',
                videoTitle: 'Descriptive Statistics Tutorial',
                content: `
<h2>Describing Data</h2>

<h3>Measures of Central Tendency</h3>
<ul>
  <li><strong>Mean (x̄):</strong> Average of all values</li>
  <li><strong>Median:</strong> Middle value when sorted</li>
  <li><strong>Mode:</strong> Most frequently occurring value</li>
</ul>

<h3>Measures of Dispersion</h3>
<ul>
  <li><strong>Range:</strong> Max - Min</li>
  <li><strong>Variance (σ²):</strong> Average squared deviation from mean</li>
  <li><strong>Standard Deviation (σ):</strong> Square root of variance</li>
</ul>

<h3>Normal Distribution</h3>
<p>Key properties:</p>
<ul>
  <li>Bell-shaped, symmetric curve</li>
  <li>68-95-99.7 rule (empirical rule)</li>
  <li>Mean = Median = Mode</li>
</ul>

<table>
  <thead><tr><th>Range</th><th>% of Data</th></tr></thead>
  <tbody>
    <tr><td>μ ± 1σ</td><td>68.27%</td></tr>
    <tr><td>μ ± 2σ</td><td>95.45%</td></tr>
    <tr><td>μ ± 3σ</td><td>99.73%</td></tr>
  </tbody>
</table>
        `
            },
            {
                id: 'gb-stats-2',
                title: 'Hypothesis Testing Basics',
                order: 2,
                estimatedMinutes: 20,
                videoUrl: 'https://www.youtube.com/embed/0oc49DyA3hU',
                videoTitle: 'Hypothesis Testing Explained',
                content: `
<h2>Hypothesis Testing</h2>

<h3>The Logic</h3>
<p>Make a claim about a population, collect sample data, determine if evidence supports or contradicts the claim.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>H₀ (Null Hypothesis):</strong> No effect, no difference (status quo)</li>
  <li><strong>H₁ (Alternative Hypothesis):</strong> There is an effect or difference</li>
  <li><strong>α (Alpha):</strong> Significance level (typically 0.05)</li>
  <li><strong>p-value:</strong> Probability of seeing results if H₀ is true</li>
</ul>

<h3>Decision Rule</h3>
<ul>
  <li>If p-value ≤ α: Reject H₀ (statistically significant)</li>
  <li>If p-value > α: Fail to reject H₀</li>
</ul>

<h3>Type I and Type II Errors</h3>
<table>
  <thead><tr><th>Error</th><th>Description</th><th>Also Called</th></tr></thead>
  <tbody>
    <tr><td>Type I (α)</td><td>Reject H₀ when it's true</td><td>False Positive</td></tr>
    <tr><td>Type II (β)</td><td>Fail to reject H₀ when it's false</td><td>False Negative</td></tr>
  </tbody>
</table>
        `
            },
            {
                id: 'gb-stats-3',
                title: 'Common Statistical Tests',
                order: 3,
                estimatedMinutes: 20,
                content: `
<h2>Selecting the Right Test</h2>

<h3>Decision Guide</h3>
<table>
  <thead><tr><th>Data Type</th><th>Comparing</th><th>Test</th></tr></thead>
  <tbody>
    <tr><td>Continuous</td><td>2 groups</td><td>t-test</td></tr>
    <tr><td>Continuous</td><td>3+ groups</td><td>ANOVA</td></tr>
    <tr><td>Proportions</td><td>2+ groups</td><td>Chi-square</td></tr>
    <tr><td>Continuous</td><td>Relationship</td><td>Correlation/Regression</td></tr>
  </tbody>
</table>

<h3>t-test</h3>
<p>Compares means of two groups. Types:</p>
<ul>
  <li><strong>1-sample:</strong> Sample mean vs. known value</li>
  <li><strong>2-sample:</strong> Means of two independent groups</li>
  <li><strong>Paired:</strong> Before/after on same subjects</li>
</ul>

<h3>ANOVA (Analysis of Variance)</h3>
<p>Compares means across 3+ groups. Tests if at least one group mean differs.</p>

<h3>Correlation</h3>
<p>Measures strength of relationship between two variables.</p>
<ul>
  <li>r = +1: Perfect positive correlation</li>
  <li>r = 0: No correlation</li>
  <li>r = -1: Perfect negative correlation</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'gb-stats-quiz',
            title: 'Statistical Foundations Quiz',
            passingScore: 70,
            description: 'Test your statistics knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'What percentage of data falls within ±2 standard deviations?', options: ['68%', '95%', '99.7%', '50%'], correctAnswer: 1, explanation: 'About 95.45% of data falls within ±2σ of the mean.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'A Type I error is:', options: ['Missing a real effect', 'Finding a false effect', 'Correct rejection', 'Correct acceptance'], correctAnswer: 1, explanation: 'Type I error is rejecting H₀ when it\'s actually true (false positive).', points: 10 },
                { id: 'q3', type: 'multiple-choice', question: 'Which test compares means of 3+ groups?', options: ['t-test', 'ANOVA', 'Chi-square', 'Correlation'], correctAnswer: 1, explanation: 'ANOVA (Analysis of Variance) compares means across 3 or more groups.', points: 10 }
            ]
        }
    },
    {
        id: 'gb-spc',
        title: 'Statistical Process Control',
        description: 'Control charts, variation analysis, and process monitoring.',
        beltLevel: 'green',
        order: 3,
        estimatedMinutes: 55,
        lessons: [
            {
                id: 'gb-spc-1',
                title: 'Understanding Variation',
                order: 1,
                estimatedMinutes: 15,
                videoUrl: 'https://www.youtube.com/embed/wJQPZGo9ALc',
                videoTitle: 'Common vs Special Cause Variation',
                content: `
<h2>Types of Variation</h2>

<h3>Common Cause Variation</h3>
<ul>
  <li>Natural, inherent to the process</li>
  <li>Random, predictable within limits</li>
  <li>Affects all output</li>
  <li>Requires system change to reduce</li>
</ul>

<h3>Special Cause Variation</h3>
<ul>
  <li>Unusual, not inherent to process</li>
  <li>Assignable to specific source</li>
  <li>Sporadic occurrence</li>
  <li>Should be identified and eliminated</li>
</ul>

<h3>The Voice of the Process</h3>
<p>Control charts let the process "speak" by showing what it's capable of (Voice of the Process) vs. what customers need (Voice of the Customer).</p>

<div class="info-box">
  <h4>💡 Key Insight</h4>
  <p>Don't tamper with common cause variation - that makes things worse! Only act on special causes.</p>
</div>
        `
            },
            {
                id: 'gb-spc-2',
                title: 'Control Charts',
                order: 2,
                estimatedMinutes: 25,
                videoUrl: 'https://www.youtube.com/embed/JyMK0e6PvaE',
                videoTitle: 'Control Charts Tutorial',
                content: `
<h2>Control Chart Fundamentals</h2>

<h3>Control Chart Components</h3>
<ul>
  <li><strong>Center Line (CL):</strong> Process average</li>
  <li><strong>Upper Control Limit (UCL):</strong> CL + 3σ</li>
  <li><strong>Lower Control Limit (LCL):</strong> CL - 3σ</li>
  <li><strong>Data Points:</strong> Plotted over time</li>
</ul>

<h3>Selecting the Right Chart</h3>
<table>
  <thead><tr><th>Data Type</th><th>Subgroup Size</th><th>Chart</th></tr></thead>
  <tbody>
    <tr><td>Continuous</td><td>n=1</td><td>I-MR</td></tr>
    <tr><td>Continuous</td><td>n=2-9</td><td>X̄-R</td></tr>
    <tr><td>Continuous</td><td>n≥10</td><td>X̄-S</td></tr>
    <tr><td>Defectives</td><td>Fixed</td><td>np</td></tr>
    <tr><td>Defect Rate</td><td>Variable</td><td>p</td></tr>
    <tr><td>Defects</td><td>Fixed</td><td>c</td></tr>
    <tr><td>Defect Rate</td><td>Variable</td><td>u</td></tr>
  </tbody>
</table>

<h3>Out-of-Control Rules (Western Electric Rules)</h3>
<ol>
  <li>1 point beyond 3σ</li>
  <li>2 of 3 consecutive points beyond 2σ</li>
  <li>4 of 5 consecutive points beyond 1σ</li>
  <li>8 consecutive points on one side of center</li>
  <li>6 consecutive points trending up or down</li>
</ol>
        `
            },
            {
                id: 'gb-spc-3',
                title: 'Process Capability',
                order: 3,
                estimatedMinutes: 15,
                videoUrl: 'https://www.youtube.com/embed/qjl7a4Lj9hw',
                videoTitle: 'Cp and Cpk Explained',
                content: `
<h2>Process Capability Analysis</h2>

<h3>Capability vs. Stability</h3>
<ul>
  <li><strong>Stable:</strong> Only common cause variation (in control)</li>
  <li><strong>Capable:</strong> Meets specification limits</li>
</ul>
<p>A process must be stable before assessing capability!</p>

<h3>Capability Indices</h3>

<h4>Cp (Potential Capability)</h4>
<p>Cp = (USL - LSL) / 6σ</p>
<p>Measures if spread fits within specs (ignores centering)</p>

<h4>Cpk (Actual Capability)</h4>
<p>Cpk = min[(USL - μ) / 3σ, (μ - LSL) / 3σ]</p>
<p>Accounts for how centered the process is</p>

<h3>Interpretation</h3>
<table>
  <thead><tr><th>Cpk Value</th><th>Interpretation</th></tr></thead>
  <tbody>
    <tr><td>&lt; 1.0</td><td>Not capable (producing defects)</td></tr>
    <tr><td>1.0 - 1.33</td><td>Marginally capable</td></tr>
    <tr><td>1.33 - 1.67</td><td>Capable</td></tr>
    <tr><td>&gt; 1.67</td><td>Excellent capability</td></tr>
  </tbody>
</table>
        `
            }
        ],
        quiz: {
            id: 'gb-spc-quiz',
            title: 'SPC Quiz',
            passingScore: 70,
            description: 'Test your SPC knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'Special cause variation is:', options: ['Normal and expected', 'Assignable to a specific source', 'Always acceptable', 'Impossible to detect'], correctAnswer: 1, explanation: 'Special cause variation can be traced to a specific, identifiable source.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'Control limits are typically set at:', options: ['±1σ', '±2σ', '±3σ', 'Specification limits'], correctAnswer: 2, explanation: 'Control limits are typically set at ±3 standard deviations from the mean.', points: 10 },
                { id: 'q3', type: 'multiple-choice', question: 'A Cpk of 1.33 indicates:', options: ['Not capable', 'Marginally capable', 'Capable', 'Incapable'], correctAnswer: 2, explanation: 'Cpk ≥ 1.33 indicates a capable process.', points: 10 }
            ]
        }
    },
    {
        id: 'gb-improve-tools',
        title: 'Advanced Improve Tools',
        description: 'DOE basics, FMEA, and solution implementation.',
        beltLevel: 'green',
        order: 4,
        estimatedMinutes: 50,
        lessons: [
            {
                id: 'gb-improve-1',
                title: 'Design of Experiments (DOE) Basics',
                order: 1,
                estimatedMinutes: 20,
                videoUrl: 'https://www.youtube.com/embed/kBUbCVjPhHk',
                videoTitle: 'DOE Introduction',
                content: `
<h2>Design of Experiments</h2>

<p>DOE is a structured approach to determine how factors affect an output.</p>

<h3>Why DOE?</h3>
<ul>
  <li>Test multiple factors simultaneously</li>
  <li>Identify interactions between factors</li>
  <li>Optimize with fewer experiments</li>
  <li>Make data-driven decisions</li>
</ul>

<h3>Key Terms</h3>
<ul>
  <li><strong>Factor:</strong> Input variable (e.g., temperature)</li>
  <li><strong>Level:</strong> Values a factor takes (e.g., Low/High)</li>
  <li><strong>Response:</strong> Output being measured</li>
  <li><strong>Main Effect:</strong> Impact of one factor</li>
  <li><strong>Interaction:</strong> Combined effect of factors</li>
</ul>

<h3>Full Factorial Design</h3>
<p>Test all combinations of factor levels.</p>
<p>For k factors at 2 levels = 2^k experiments</p>
<ul>
  <li>2 factors: 4 experiments</li>
  <li>3 factors: 8 experiments</li>
  <li>4 factors: 16 experiments</li>
</ul>
        `
            },
            {
                id: 'gb-improve-2',
                title: 'FMEA (Failure Mode Effects Analysis)',
                order: 2,
                estimatedMinutes: 15,
                videoUrl: 'https://www.youtube.com/embed/7cXcPwEqJO4',
                videoTitle: 'FMEA Tutorial',
                content: `
<h2>FMEA: Proactive Risk Analysis</h2>

<p>FMEA identifies potential failures before they occur.</p>

<h3>FMEA Process</h3>
<ol>
  <li>List process steps or components</li>
  <li>Identify potential failure modes</li>
  <li>Determine effects of each failure</li>
  <li>Rate Severity, Occurrence, Detection</li>
  <li>Calculate RPN (Risk Priority Number)</li>
  <li>Prioritize actions based on RPN</li>
</ol>

<h3>RPN Calculation</h3>
<p><strong>RPN = Severity × Occurrence × Detection</strong></p>

<table>
  <thead><tr><th>Factor</th><th>Scale</th><th>Focus</th></tr></thead>
  <tbody>
    <tr><td>Severity (S)</td><td>1-10</td><td>Impact if failure occurs</td></tr>
    <tr><td>Occurrence (O)</td><td>1-10</td><td>Likelihood of failure</td></tr>
    <tr><td>Detection (D)</td><td>1-10</td><td>Ability to detect before impact</td></tr>
  </tbody>
</table>

<p>Higher RPN = Higher priority for action</p>
        `
            },
            {
                id: 'gb-improve-3',
                title: 'Pilot Testing & Implementation',
                order: 3,
                estimatedMinutes: 15,
                content: `
<h2>Testing and Rolling Out Solutions</h2>

<h3>Pilot Testing</h3>
<ul>
  <li>Test on small scale first</li>
  <li>Collect data to verify improvement</li>
  <li>Identify unforeseen issues</li>
  <li>Refine before full implementation</li>
</ul>

<h3>Implementation Planning</h3>
<ul>
  <li>Define rollout phases</li>
  <li>Assign responsibilities</li>
  <li>Establish timeline</li>
  <li>Plan training</li>
  <li>Create communication plan</li>
</ul>

<h3>Success Criteria</h3>
<ul>
  <li>Define measurable success metrics</li>
  <li>Establish data collection plan</li>
  <li>Set review checkpoints</li>
  <li>Plan for contingencies</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'gb-improve-quiz',
            title: 'Improve Tools Quiz',
            passingScore: 70,
            description: 'Test your improve tools knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'RPN in FMEA equals:', options: ['S + O + D', 'S × O × D', 'S × O / D', '(S + O) × D'], correctAnswer: 1, explanation: 'RPN = Severity × Occurrence × Detection.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'A full factorial DOE with 3 factors at 2 levels requires:', options: ['3 experiments', '6 experiments', '8 experiments', '9 experiments'], correctAnswer: 2, explanation: '2^3 = 8 experiments for a full factorial design.', points: 10 }
            ]
        }
    },
    {
        id: 'gb-control-phase',
        title: 'Control Phase Mastery',
        description: 'Sustaining improvements with robust control systems.',
        beltLevel: 'green',
        order: 5,
        estimatedMinutes: 40,
        lessons: [
            {
                id: 'gb-control-1',
                title: 'Control Plan Development',
                order: 1,
                estimatedMinutes: 20,
                content: `
<h2>Building Robust Control Plans</h2>

<h3>Control Plan Elements</h3>
<table>
  <thead><tr><th>Element</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>Process Step</td><td>Which step is being controlled</td></tr>
    <tr><td>CTQ Characteristic</td><td>What is being measured</td></tr>
    <tr><td>Specification</td><td>Target and tolerance</td></tr>
    <tr><td>Measurement Method</td><td>How it's measured</td></tr>
    <tr><td>Sample Size/Frequency</td><td>How much and how often</td></tr>
    <tr><td>Control Method</td><td>Control chart, checklist, etc.</td></tr>
    <tr><td>Reaction Plan</td><td>What to do if out of spec</td></tr>
    <tr><td>Owner</td><td>Who is responsible</td></tr>
  </tbody>
</table>

<h3>Documentation Requirements</h3>
<ul>
  <li>Standard Operating Procedures (SOPs)</li>
  <li>Work instructions with visuals</li>
  <li>Training materials and records</li>
  <li>Audit checklists</li>
</ul>
        `
            },
            {
                id: 'gb-control-2',
                title: 'Project Closure',
                order: 2,
                estimatedMinutes: 20,
                content: `
<h2>Closing and Transitioning Projects</h2>

<h3>Project Closeout Checklist</h3>
<ul>
  <li>Verify results are sustained (30-60 days)</li>
  <li>Calculate and validate financial savings</li>
  <li>Document lessons learned</li>
  <li>Update process documentation</li>
  <li>Complete knowledge transfer to process owner</li>
  <li>Present final report to sponsor</li>
  <li>Celebrate success with team</li>
</ul>

<h3>Financial Validation</h3>
<ul>
  <li>Hard savings: Directly measurable cost reduction</li>
  <li>Soft savings: Estimated or indirect benefits</li>
  <li>Cost avoidance: Prevented future costs</li>
</ul>

<h3>Lessons Learned</h3>
<ul>
  <li>What worked well?</li>
  <li>What would we do differently?</li>
  <li>What tools were most effective?</li>
  <li>What obstacles did we face?</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'gb-control-quiz',
            title: 'Control Phase Quiz',
            passingScore: 70,
            description: 'Test your control phase knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'A control plan should include all EXCEPT:', options: ['Reaction plan', 'Measurement method', 'Marketing strategy', 'Sample frequency'], correctAnswer: 2, explanation: 'Control plans focus on process control, not marketing.', points: 10 },
                { id: 'q2', type: 'true-false', question: 'Results should be verified as sustained for 30-60 days before project closure.', options: ['True', 'False'], correctAnswer: 0, explanation: 'True. Verifying sustainability ensures improvements stick.', points: 10 }
            ]
        }
    }
];

// Green Belt Final Exam
export const greenBeltFinalExam: Quiz = {
    id: 'gb-final-exam',
    title: 'Green Belt Certification Exam',
    description: 'Complete all modules and pass this exam to earn your Green Belt certification.',
    passingScore: 70,
    timeLimit: 60,
    questions: [
        { id: 'f1', type: 'multiple-choice', question: 'What percentage of time does a Green Belt spend on projects?', options: ['5-10%', '25-50%', '75-100%', '100%'], correctAnswer: 1, explanation: 'Green Belts spend 25-50% on projects.', points: 5 },
        { id: 'f2', type: 'multiple-choice', question: 'What percentage of data falls within ±3 standard deviations?', options: ['68%', '95%', '99.7%', '100%'], correctAnswer: 2, explanation: '99.73% falls within ±3σ.', points: 5 },
        { id: 'f3', type: 'multiple-choice', question: 'A Type I error is a:', options: ['False positive', 'False negative', 'True positive', 'True negative'], correctAnswer: 0, explanation: 'Type I = rejecting H₀ when true = false positive.', points: 5 },
        { id: 'f4', type: 'multiple-choice', question: 'Which test compares means of 3+ groups?', options: ['t-test', 'ANOVA', 'Chi-square', 'Z-test'], correctAnswer: 1, explanation: 'ANOVA compares means across multiple groups.', points: 5 },
        { id: 'f5', type: 'multiple-choice', question: 'Control limits are typically set at:', options: ['±1σ', '±2σ', '±3σ', 'Spec limits'], correctAnswer: 2, explanation: 'Control limits are ±3 standard deviations.', points: 5 },
        { id: 'f6', type: 'multiple-choice', question: 'Common cause variation is:', options: ['Assignable', 'Natural to the process', 'Always bad', 'Easy to eliminate'], correctAnswer: 1, explanation: 'Common cause is inherent, natural variation.', points: 5 },
        { id: 'f7', type: 'multiple-choice', question: 'Cpk accounts for:', options: ['Spread only', 'Centering only', 'Both spread and centering', 'Neither'], correctAnswer: 2, explanation: 'Cpk considers both process spread and centering.', points: 5 },
        { id: 'f8', type: 'multiple-choice', question: 'RPN in FMEA equals:', options: ['S + O + D', 'S × O × D', 'S + O × D', 'S × O + D'], correctAnswer: 1, explanation: 'RPN = Severity × Occurrence × Detection.', points: 5 },
        { id: 'f9', type: 'multiple-choice', question: 'A full factorial with 3 factors at 2 levels needs:', options: ['6', '8', '9', '12'], correctAnswer: 1, explanation: '2³ = 8 experiments.', points: 5 },
        { id: 'f10', type: 'multiple-choice', question: 'In Tuckman\'s model, conflicts emerge in which stage?', options: ['Forming', 'Storming', 'Norming', 'Performing'], correctAnswer: 1, explanation: 'Storming is when conflicts arise.', points: 5 },
        { id: 'f11', type: 'multiple-choice', question: 'A Cpk of 1.5 indicates:', options: ['Not capable', 'Marginally capable', 'Capable', 'Incapable'], correctAnswer: 2, explanation: 'Cpk > 1.33 is considered capable.', points: 5 },
        { id: 'f12', type: 'multiple-choice', question: 'Which chart is used for individual measurements?', options: ['X̄-R', 'X̄-S', 'I-MR', 'p-chart'], correctAnswer: 2, explanation: 'I-MR (Individuals-Moving Range) for n=1.', points: 5 },
        { id: 'f13', type: 'multiple-choice', question: 'Correlation of r = -0.9 means:', options: ['Weak positive', 'Strong positive', 'Weak negative', 'Strong negative'], correctAnswer: 3, explanation: 'r close to -1 indicates strong negative correlation.', points: 5 },
        { id: 'f14', type: 'true-false', question: 'A process must be stable before assessing capability.', options: ['True', 'False'], correctAnswer: 0, explanation: 'True. Stability first, then capability.', points: 5 },
        { id: 'f15', type: 'multiple-choice', question: 'The median is:', options: ['Most common value', 'Average', 'Middle value', 'Largest value'], correctAnswer: 2, explanation: 'Median is the middle value when sorted.', points: 5 },
        { id: 'f16', type: 'multiple-choice', question: 'Western Electric Rule: ___ points beyond 3σ', options: ['1', '2', '4', '8'], correctAnswer: 0, explanation: '1 point beyond 3σ signals out of control.', points: 5 },
        { id: 'f17', type: 'multiple-choice', question: 'DOE stands for:', options: ['Design of Experiments', 'Definition of Excellence', 'Data of Errors', 'Determine Optimal Elements'], correctAnswer: 0, explanation: 'DOE = Design of Experiments.', points: 5 },
        { id: 'f18', type: 'multiple-choice', question: 'Hard savings are:', options: ['Estimated benefits', 'Directly measurable', 'Soft costs', 'Future projections'], correctAnswer: 1, explanation: 'Hard savings are directly measurable cost reductions.', points: 5 },
        { id: 'f19', type: 'multiple-choice', question: 'Pilot testing is done to:', options: ['Skip full implementation', 'Test on small scale first', 'Avoid data collection', 'Skip training'], correctAnswer: 1, explanation: 'Pilots test improvements before full rollout.', points: 5 },
        { id: 'f20', type: 'multiple-choice', question: 'p-value ≤ α means:', options: ['Accept H₀', 'Reject H₀', 'Need more data', 'Inconclusive'], correctAnswer: 1, explanation: 'p ≤ α leads to rejecting H₀ (significant).', points: 5 }
    ]
};

export function getGreenBeltLessonCount(): number {
    return greenBeltModules.reduce((t, m) => t + m.lessons.length, 0);
}

export function getGreenBeltTotalMinutes(): number {
    return greenBeltModules.reduce((t, m) => t + m.estimatedMinutes, 0);
}
