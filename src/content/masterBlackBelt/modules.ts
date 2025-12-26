import { Module, Quiz } from '../../types';

// Master Black Belt Module Content
// Sources: ASQ MBB BOK, IASSC, Industry Best Practices

export const masterBlackBeltModules: Module[] = [
    {
        id: 'mbb-strategic',
        title: 'Strategic Deployment',
        description: 'Enterprise-wide Six Sigma deployment and portfolio management.',
        beltLevel: 'master',
        order: 1,
        estimatedMinutes: 50,
        lessons: [
            {
                id: 'mbb-strat-1',
                title: 'Six Sigma Strategy',
                order: 1,
                estimatedMinutes: 20,
                content: `
<h2>Enterprise Six Sigma Deployment</h2>

<h3>Deployment Models</h3>
<ul>
  <li><strong>Top-Down:</strong> Executive-driven, strategic alignment</li>
  <li><strong>Bottom-Up:</strong> Grassroots improvement culture</li>
  <li><strong>Hybrid:</strong> Combination for best results</li>
</ul>

<h3>Key Success Factors</h3>
<ul>
  <li>Executive sponsorship and engagement</li>
  <li>Alignment to strategic objectives</li>
  <li>Robust project selection process</li>
  <li>Sufficient resource allocation</li>
  <li>Strong infrastructure and governance</li>
  <li>Recognition and reward systems</li>
</ul>

<h3>Deployment Phases</h3>
<ol>
  <li><strong>Launch:</strong> Executive training, pilot projects</li>
  <li><strong>Expand:</strong> Train waves of belts, spread wins</li>
  <li><strong>Sustain:</strong> Embed in culture, continuous improvement</li>
</ol>
        `
            },
            {
                id: 'mbb-strat-2',
                title: 'Portfolio Management',
                order: 2,
                estimatedMinutes: 15,
                content: `
<h2>Project Portfolio Management</h2>

<h3>Portfolio Optimization</h3>
<ul>
  <li>Balance quick wins and strategic projects</li>
  <li>Align to business priorities</li>
  <li>Manage resource constraints</li>
  <li>Track aggregate savings</li>
</ul>

<h3>Project Pipeline</h3>
<table>
  <thead><tr><th>Stage</th><th>Gate</th></tr></thead>
  <tbody>
    <tr><td>Ideation</td><td>Initial screening</td></tr>
    <tr><td>Scoping</td><td>Charter approval</td></tr>
    <tr><td>Execution</td><td>Phase tollgates</td></tr>
    <tr><td>Closure</td><td>Benefits validation</td></tr>
  </tbody>
</table>

<h3>Benefits Tracking</h3>
<ul>
  <li>Hard savings validation by Finance</li>
  <li>Soft savings documentation</li>
  <li>Annualized vs. one-time benefits</li>
  <li>Sustaining benefits over time</li>
</ul>
        `
            },
            {
                id: 'mbb-strat-3',
                title: 'Governance Structure',
                order: 3,
                estimatedMinutes: 15,
                content: `
<h2>Six Sigma Governance</h2>

<h3>Steering Committee</h3>
<ul>
  <li>Senior executives</li>
  <li>Reviews portfolio health</li>
  <li>Removes barriers</li>
  <li>Approves major projects</li>
</ul>

<h3>Deployment Champion</h3>
<ul>
  <li>Full-time Six Sigma leader</li>
  <li>Reports to executive team</li>
  <li>Manages MBB/BB resources</li>
  <li>Drives deployment strategy</li>
</ul>

<h3>Review Cadence</h3>
<ul>
  <li><strong>Weekly:</strong> Project status with Belt</li>
  <li><strong>Monthly:</strong> Portfolio review</li>
  <li><strong>Quarterly:</strong> Executive steering</li>
  <li><strong>Annual:</strong> Strategic planning</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'mbb-strat-quiz',
            title: 'Strategic Deployment Quiz',
            passingScore: 70,
            description: 'Test your strategic deployment knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'The hybrid deployment model combines:', options: ['Quality and Lean', 'Top-down and bottom-up', 'DMAIC and DFSS', 'Training and projects'], correctAnswer: 1, explanation: 'Hybrid combines top-down executive support with bottom-up engagement.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'Benefits validation is typically done by:', options: ['Project leader', 'Finance', 'Customer', 'Sponsor'], correctAnswer: 1, explanation: 'Finance validates hard savings for credibility.', points: 10 }
            ]
        }
    },
    {
        id: 'mbb-mentoring',
        title: 'Training & Mentoring Excellence',
        description: 'Developing Black Belts and building organizational capability.',
        beltLevel: 'master',
        order: 2,
        estimatedMinutes: 45,
        lessons: [
            {
                id: 'mbb-mentor-1',
                title: 'Belt Development Program',
                order: 1,
                estimatedMinutes: 20,
                content: `
<h2>Developing Six Sigma Talent</h2>

<h3>Training Curriculum Design</h3>
<ul>
  <li>Align to certification body standards (ASQ, IASSC)</li>
  <li>Balance theory and application</li>
  <li>Include real project work</li>
  <li>Assess competency at each level</li>
</ul>

<h3>Belt Certification Requirements</h3>
<table>
  <thead><tr><th>Level</th><th>Training</th><th>Projects</th></tr></thead>
  <tbody>
    <tr><td>Yellow Belt</td><td>16-24 hours</td><td>Participation</td></tr>
    <tr><td>Green Belt</td><td>40-80 hours</td><td>1 completed</td></tr>
    <tr><td>Black Belt</td><td>140-160 hours</td><td>2 completed</td></tr>
    <tr><td>Master Black Belt</td><td>Additional training</td><td>10+ mentored</td></tr>
  </tbody>
</table>

<h3>Knowledge Transfer</h3>
<ul>
  <li>Classroom training</li>
  <li>Coaching during projects</li>
  <li>Communities of practice</li>
  <li>Knowledge repositories</li>
</ul>
        `
            },
            {
                id: 'mbb-mentor-2',
                title: 'Coaching Black Belts',
                order: 2,
                estimatedMinutes: 15,
                content: `
<h2>Effective Belt Coaching</h2>

<h3>Coaching vs. Consulting</h3>
<table>
  <thead><tr><th>Coaching</th><th>Consulting</th></tr></thead>
  <tbody>
    <tr><td>Ask questions</td><td>Give answers</td></tr>
    <tr><td>Develop capability</td><td>Deliver results</td></tr>
    <tr><td>Belt owns solution</td><td>Expert owns solution</td></tr>
  </tbody>
</table>

<h3>Coaching Process</h3>
<ol>
  <li>Review project status</li>
  <li>Identify obstacles</li>
  <li>Ask guiding questions</li>
  <li>Provide resources/guidance</li>
  <li>Set next actions</li>
</ol>

<h3>Common Coaching Topics</h3>
<ul>
  <li>Tool selection and application</li>
  <li>Stakeholder management</li>
  <li>Scope management</li>
  <li>Statistical analysis interpretation</li>
  <li>Implementation challenges</li>
</ul>
        `
            },
            {
                id: 'mbb-mentor-3',
                title: 'Adult Learning Principles',
                order: 3,
                estimatedMinutes: 10,
                content: `
<h2>Teaching Adults Effectively</h2>

<h3>Andragogy Principles</h3>
<ul>
  <li><strong>Self-directed:</strong> Adults want control over learning</li>
  <li><strong>Experience:</strong> Build on prior knowledge</li>
  <li><strong>Relevance:</strong> Connect to real work challenges</li>
  <li><strong>Problem-centered:</strong> Focus on solving issues</li>
  <li><strong>Internal motivation:</strong> Link to personal goals</li>
</ul>

<h3>Effective Training Techniques</h3>
<ul>
  <li>Case studies and examples</li>
  <li>Hands-on exercises</li>
  <li>Group discussions</li>
  <li>Real project application</li>
  <li>Games and simulations</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'mbb-mentor-quiz',
            title: 'Mentoring Quiz',
            passingScore: 70,
            description: 'Test your mentoring knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'Coaching differs from consulting because:', options: ['It takes longer', 'The Belt owns the solution', 'It requires more data', 'It costs less'], correctAnswer: 1, explanation: 'Coaching develops capability by having the Belt own the solution.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'Adult learning is most effective when:', options: ['Lecture-based', 'Connected to real work', 'Theoretical', 'Mandatory'], correctAnswer: 1, explanation: 'Adults learn best when content is relevant to their work.', points: 10 }
            ]
        }
    },
    {
        id: 'mbb-advanced',
        title: 'Advanced Methodologies',
        description: 'DFSS, Monte Carlo simulation, and advanced optimization.',
        beltLevel: 'master',
        order: 3,
        estimatedMinutes: 55,
        lessons: [
            {
                id: 'mbb-adv-1',
                title: 'Design for Six Sigma (DFSS)',
                order: 1,
                estimatedMinutes: 20,
                videoUrl: 'https://www.youtube.com/embed/4bHaD5bQ_Rg',
                videoTitle: 'DFSS Introduction',
                content: `
<h2>DFSS: Designing Quality In</h2>

<p>DFSS prevents defects by designing robust products/processes from the start.</p>

<h3>DFSS vs. DMAIC</h3>
<table>
  <thead><tr><th>DMAIC</th><th>DFSS</th></tr></thead>
  <tbody>
    <tr><td>Improve existing process</td><td>Design new process/product</td></tr>
    <tr><td>Reactive</td><td>Proactive</td></tr>
    <tr><td>Reduce variation</td><td>Prevent variation</td></tr>
  </tbody>
</table>

<h3>DFSS Roadmaps</h3>
<ul>
  <li><strong>DMADV:</strong> Define, Measure, Analyze, Design, Verify</li>
  <li><strong>IDOV:</strong> Identify, Design, Optimize, Verify</li>
</ul>

<h3>Key DFSS Tools</h3>
<ul>
  <li>Quality Function Deployment (QFD)</li>
  <li>Axiomatic Design</li>
  <li>TRIZ (Theory of Inventive Problem Solving)</li>
  <li>Robust Design / Taguchi Methods</li>
</ul>
        `
            },
            {
                id: 'mbb-adv-2',
                title: 'Monte Carlo Simulation',
                order: 2,
                estimatedMinutes: 20,
                content: `
<h2>Monte Carlo Simulation</h2>

<p>Use probability distributions to model uncertainty and predict outcomes.</p>

<h3>When to Use</h3>
<ul>
  <li>Complex systems with multiple variables</li>
  <li>Forecasting with uncertainty</li>
  <li>Risk analysis</li>
  <li>Tolerance analysis</li>
</ul>

<h3>Steps</h3>
<ol>
  <li>Define the model equation</li>
  <li>Identify input variables and distributions</li>
  <li>Run thousands of iterations</li>
  <li>Analyze output distribution</li>
  <li>Calculate probabilities of outcomes</li>
</ol>

<h3>Applications</h3>
<ul>
  <li>Process capability prediction</li>
  <li>Financial risk modeling</li>
  <li>Reliability analysis</li>
  <li>Project schedule risk</li>
</ul>
        `
            },
            {
                id: 'mbb-adv-3',
                title: 'Multi-Response Optimization',
                order: 3,
                estimatedMinutes: 15,
                content: `
<h2>Optimizing Multiple Responses</h2>

<h3>The Challenge</h3>
<p>Factor settings that optimize one response may hurt another.</p>

<h3>Desirability Function</h3>
<ol>
  <li>Define target for each response</li>
  <li>Create individual desirability (0-1)</li>
  <li>Combine into overall desirability</li>
  <li>Optimize composite function</li>
</ol>

<h3>Response Types</h3>
<ul>
  <li><strong>Target is best:</strong> Minimize deviation from target</li>
  <li><strong>Larger is better:</strong> Maximize response</li>
  <li><strong>Smaller is better:</strong> Minimize response</li>
</ul>

<h3>Overlaid Contour Plots</h3>
<p>Visualize feasible region where all responses meet specifications.</p>
        `
            }
        ],
        quiz: {
            id: 'mbb-adv-quiz',
            title: 'Advanced Methods Quiz',
            passingScore: 70,
            description: 'Test your advanced methodology knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'DFSS is used to:', options: ['Fix existing problems', 'Design quality in from start', 'Reduce costs', 'Train employees'], correctAnswer: 1, explanation: 'DFSS proactively designs in quality.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'Monte Carlo uses:', options: ['Exact calculations', 'Random sampling', 'Control charts', 'Regression'], correctAnswer: 1, explanation: 'Monte Carlo runs thousands of random iterations.', points: 10 }
            ]
        }
    }
];

// Master Black Belt Final Exam
export const masterBlackBeltFinalExam: Quiz = {
    id: 'mbb-final-exam',
    title: 'Master Black Belt Certification Exam',
    description: 'The ultimate certification for Six Sigma mastery.',
    passingScore: 75,
    timeLimit: 90,
    questions: [
        { id: 'f1', type: 'multiple-choice', question: 'Hybrid deployment combines:', options: ['Lean and Six Sigma', 'Top-down and bottom-up', 'DMAIC and DMADV', 'Training and projects'], correctAnswer: 1, explanation: 'Hybrid = top-down + bottom-up.', points: 5 },
        { id: 'f2', type: 'multiple-choice', question: 'Benefits validation is typically done by:', options: ['Belt', 'Finance', 'Customer', 'HR'], correctAnswer: 1, explanation: 'Finance validates hard savings.', points: 5 },
        { id: 'f3', type: 'multiple-choice', question: 'Steering committee reviews:', options: ['Daily tasks', 'Portfolio health', 'Individual belt work', 'Training content'], correctAnswer: 1, explanation: 'Steering reviews portfolio and removes barriers.', points: 5 },
        { id: 'f4', type: 'multiple-choice', question: 'MBB certification typically requires:', options: ['1 project', '2 projects', '5 projects', '10+ mentored projects'], correctAnswer: 3, explanation: 'MBBs mentor 10+ projects.', points: 5 },
        { id: 'f5', type: 'multiple-choice', question: 'Coaching differs from consulting because:', options: ['It costs more', 'Belt owns solution', 'It takes less time', 'Results are better'], correctAnswer: 1, explanation: 'Coaching develops the Belt to own solutions.', points: 5 },
        { id: 'f6', type: 'multiple-choice', question: 'Adults learn best when content is:', options: ['Theoretical', 'Connected to real work', 'Mandatory', 'Lecture-based'], correctAnswer: 1, explanation: 'Relevance is key for adult learning.', points: 5 },
        { id: 'f7', type: 'multiple-choice', question: 'DFSS stands for:', options: ['Design for Six Sigma', 'Define for Statistical Success', 'Data for Sigma Solutions', 'Deploy for Sustainable Savings'], correctAnswer: 0, explanation: 'DFSS = Design for Six Sigma.', points: 5 },
        { id: 'f8', type: 'multiple-choice', question: 'DMADV is used for:', options: ['Existing processes', 'New designs', 'Training', 'Auditing'], correctAnswer: 1, explanation: 'DMADV is a DFSS roadmap for new designs.', points: 5 },
        { id: 'f9', type: 'multiple-choice', question: 'Monte Carlo uses:', options: ['Exact math', 'Random sampling', 'Control charts', 'Interviews'], correctAnswer: 1, explanation: 'Monte Carlo runs random iterations.', points: 5 },
        { id: 'f10', type: 'multiple-choice', question: 'Desirability function optimizes:', options: ['One response', 'Multiple responses', 'Cost only', 'Time only'], correctAnswer: 1, explanation: 'Desirability combines multiple responses.', points: 5 },
        { id: 'f11', type: 'multiple-choice', question: 'QFD translates:', options: ['Costs to savings', 'VOC to design', 'Data to charts', 'Problems to projects'], correctAnswer: 1, explanation: 'QFD translates customer needs to design.', points: 5 },
        { id: 'f12', type: 'true-false', question: 'DFSS is proactive while DMAIC is reactive.', options: ['True', 'False'], correctAnswer: 0, explanation: 'True. DFSS designs quality in; DMAIC fixes problems.', points: 5 },
        { id: 'f13', type: 'multiple-choice', question: 'Knowledge repositories help with:', options: ['Project funding', 'Knowledge transfer', 'Belt selection', 'Cost reduction'], correctAnswer: 1, explanation: 'Repositories store and share organizational learning.', points: 5 },
        { id: 'f14', type: 'multiple-choice', question: 'Steering committee meets:', options: ['Daily', 'Weekly', 'Monthly', 'Quarterly'], correctAnswer: 3, explanation: 'Executive steering is typically quarterly.', points: 5 },
        { id: 'f15', type: 'multiple-choice', question: 'Taguchi methods focus on:', options: ['Speed', 'Robust design', 'Cost', 'Training'], correctAnswer: 1, explanation: 'Taguchi creates designs robust to variation.', points: 5 }
    ]
};

export function getMasterBlackBeltLessonCount(): number {
    return masterBlackBeltModules.reduce((t, m) => t + m.lessons.length, 0);
}

export function getMasterBlackBeltTotalMinutes(): number {
    return masterBlackBeltModules.reduce((t, m) => t + m.estimatedMinutes, 0);
}
