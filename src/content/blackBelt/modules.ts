import { Module, Quiz } from '../../types';

// Black Belt Module Content
// Sources: ASQ.org, Coursera Black Belt Specialization, IASSC

export const blackBeltModules: Module[] = [
    {
        id: 'bb-advanced-stats',
        title: 'Advanced Statistical Analysis',
        description: 'Regression, ANOVA, and advanced hypothesis testing.',
        beltLevel: 'black',
        order: 1,
        estimatedMinutes: 70,
        lessons: [
            {
                id: 'bb-stats-1',
                title: 'Multiple Regression Analysis',
                order: 1,
                estimatedMinutes: 25,
                videoUrl: 'https://www.youtube.com/embed/zITIFTsivN8',
                videoTitle: 'Multiple Regression Tutorial',
                content: `
<h2>Multiple Regression</h2>

<p>Predicts a response variable (Y) from multiple predictor variables (X₁, X₂, ...).</p>

<h3>The Model</h3>
<p>Y = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ + ε</p>

<h3>Key Metrics</h3>
<ul>
  <li><strong>R² (Coefficient of Determination):</strong> % of variation explained</li>
  <li><strong>Adjusted R²:</strong> Accounts for number of predictors</li>
  <li><strong>p-values:</strong> Significance of each predictor</li>
  <li><strong>Residual Analysis:</strong> Check model assumptions</li>
</ul>

<h3>Regression Assumptions</h3>
<ol>
  <li>Linearity: Relationship is linear</li>
  <li>Independence: Observations are independent</li>
  <li>Normality: Residuals are normally distributed</li>
  <li>Equal Variance: Homoscedasticity</li>
</ol>

<h3>Model Building Steps</h3>
<ol>
  <li>Identify potential predictors</li>
  <li>Check for multicollinearity (VIF)</li>
  <li>Fit the model</li>
  <li>Evaluate significance of terms</li>
  <li>Check residual plots</li>
  <li>Validate with new data</li>
</ol>
        `
            },
            {
                id: 'bb-stats-2',
                title: 'Advanced ANOVA',
                order: 2,
                estimatedMinutes: 20,
                content: `
<h2>Advanced ANOVA Techniques</h2>

<h3>One-Way ANOVA</h3>
<p>Compares means across multiple groups for one factor.</p>

<h3>Two-Way ANOVA</h3>
<p>Examines effects of two factors and their interaction.</p>

<h3>ANOVA Table Components</h3>
<table>
  <thead><tr><th>Source</th><th>SS</th><th>df</th><th>MS</th><th>F</th></tr></thead>
  <tbody>
    <tr><td>Factor A</td><td>SSA</td><td>a-1</td><td>MSA</td><td>MSA/MSE</td></tr>
    <tr><td>Factor B</td><td>SSB</td><td>b-1</td><td>MSB</td><td>MSB/MSE</td></tr>
    <tr><td>Interaction</td><td>SSAB</td><td>(a-1)(b-1)</td><td>MSAB</td><td>MSAB/MSE</td></tr>
    <tr><td>Error</td><td>SSE</td><td>ab(n-1)</td><td>MSE</td><td>-</td></tr>
  </tbody>
</table>

<h3>Post-Hoc Tests</h3>
<p>When ANOVA shows significant differences, post-hoc tests determine which pairs differ:</p>
<ul>
  <li><strong>Tukey HSD:</strong> Compare all pairs</li>
  <li><strong>Bonferroni:</strong> Conservative adjustment</li>
  <li><strong>Dunnett:</strong> Compare all to control</li>
</ul>
        `
            },
            {
                id: 'bb-stats-3',
                title: 'Non-Parametric Tests',
                order: 3,
                estimatedMinutes: 25,
                content: `
<h2>Non-Parametric Methods</h2>

<p>Use when data doesn't meet normality assumptions.</p>

<h3>When to Use Non-Parametric</h3>
<ul>
  <li>Small sample sizes</li>
  <li>Non-normal distributions</li>
  <li>Ordinal data</li>
  <li>Outliers present</li>
</ul>

<h3>Common Non-Parametric Tests</h3>
<table>
  <thead><tr><th>Parametric</th><th>Non-Parametric Equivalent</th></tr></thead>
  <tbody>
    <tr><td>1-sample t-test</td><td>Wilcoxon Signed Rank</td></tr>
    <tr><td>2-sample t-test</td><td>Mann-Whitney U</td></tr>
    <tr><td>Paired t-test</td><td>Wilcoxon Signed Rank</td></tr>
    <tr><td>One-way ANOVA</td><td>Kruskal-Wallis</td></tr>
  </tbody>
</table>

<h3>Chi-Square Tests</h3>
<ul>
  <li><strong>Goodness of Fit:</strong> Does observed match expected?</li>
  <li><strong>Independence:</strong> Are two variables related?</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'bb-stats-quiz',
            title: 'Advanced Statistics Quiz',
            passingScore: 70,
            description: 'Test your advanced statistics knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'R² measures:', options: ['Sample size', '% variation explained', 'Standard error', 'Degrees of freedom'], correctAnswer: 1, explanation: 'R² shows the percentage of variation in Y explained by the model.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'VIF checks for:', options: ['Normality', 'Multicollinearity', 'Independence', 'Linearity'], correctAnswer: 1, explanation: 'Variance Inflation Factor detects multicollinearity between predictors.', points: 10 },
                { id: 'q3', type: 'multiple-choice', question: 'The non-parametric equivalent of ANOVA is:', options: ['Mann-Whitney', 'Kruskal-Wallis', 'Chi-square', 'Wilcoxon'], correctAnswer: 1, explanation: 'Kruskal-Wallis is the non-parametric alternative to one-way ANOVA.', points: 10 }
            ]
        }
    },
    {
        id: 'bb-doe',
        title: 'Design of Experiments (DOE)',
        description: 'Advanced experimental design, factorials, and optimization.',
        beltLevel: 'black',
        order: 2,
        estimatedMinutes: 65,
        lessons: [
            {
                id: 'bb-doe-1',
                title: 'Factorial Designs',
                order: 1,
                estimatedMinutes: 25,
                videoUrl: 'https://www.youtube.com/embed/JnQJQxXCQqc',
                videoTitle: 'Full Factorial DOE',
                content: `
<h2>Full Factorial Experiments</h2>

<h3>Design Notation</h3>
<p>2^k = k factors at 2 levels</p>
<p>3^k = k factors at 3 levels</p>

<h3>Example: 2³ Factorial</h3>
<p>3 factors (A, B, C) at 2 levels each = 8 runs</p>

<table>
  <thead><tr><th>Run</th><th>A</th><th>B</th><th>C</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>-</td><td>-</td><td>-</td></tr>
    <tr><td>2</td><td>+</td><td>-</td><td>-</td></tr>
    <tr><td>3</td><td>-</td><td>+</td><td>-</td></tr>
    <tr><td>4</td><td>+</td><td>+</td><td>-</td></tr>
    <tr><td>5</td><td>-</td><td>-</td><td>+</td></tr>
    <tr><td>6</td><td>+</td><td>-</td><td>+</td></tr>
    <tr><td>7</td><td>-</td><td>+</td><td>+</td></tr>
    <tr><td>8</td><td>+</td><td>+</td><td>+</td></tr>
  </tbody>
</table>

<h3>Effects Calculation</h3>
<ul>
  <li><strong>Main Effects:</strong> Impact of individual factors</li>
  <li><strong>Interaction Effects:</strong> Combined impact of factors</li>
</ul>
        `
            },
            {
                id: 'bb-doe-2',
                title: 'Fractional Factorials',
                order: 2,
                estimatedMinutes: 20,
                content: `
<h2>Fractional Factorial Designs</h2>

<p>Reduce runs by testing only a fraction of combinations.</p>

<h3>Why Fractional?</h3>
<ul>
  <li>Full factorial with many factors is expensive</li>
  <li>Higher-order interactions often negligible</li>
  <li>Screen many factors with fewer runs</li>
</ul>

<h3>Resolution</h3>
<ul>
  <li><strong>Resolution III:</strong> Main effects confounded with 2-factor interactions</li>
  <li><strong>Resolution IV:</strong> Main effects clear, 2-factor interactions confounded</li>
  <li><strong>Resolution V:</strong> Main effects and 2-factor interactions clear</li>
</ul>

<h3>Example: 2^(4-1) Design</h3>
<p>4 factors in 8 runs instead of 16</p>
<p>Sacrifice: Higher-order interactions aliased</p>
        `
            },
            {
                id: 'bb-doe-3',
                title: 'Response Surface Methodology',
                order: 3,
                estimatedMinutes: 20,
                videoUrl: 'https://www.youtube.com/embed/9CfG-lZfMfc',
                videoTitle: 'Response Surface Methods',
                content: `
<h2>Response Surface Methodology (RSM)</h2>

<p>Optimize response by modeling relationship between factors and output.</p>

<h3>Central Composite Design (CCD)</h3>
<ul>
  <li>Factorial points (corners)</li>
  <li>Star points (axial)</li>
  <li>Center points (replication)</li>
</ul>

<h3>RSM Process</h3>
<ol>
  <li>Screen factors to identify vital few</li>
  <li>Use steepest ascent/descent to approach optimum</li>
  <li>Build second-order model near optimum</li>
  <li>Analyze surface to find optimal settings</li>
</ol>

<h3>Contour Plots</h3>
<p>Visualize response surface as 2D map showing how response changes with factor levels.</p>
        `
            }
        ],
        quiz: {
            id: 'bb-doe-quiz',
            title: 'DOE Quiz',
            passingScore: 70,
            description: 'Test your DOE knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'A 2^4 full factorial has how many runs?', options: ['4', '8', '16', '32'], correctAnswer: 2, explanation: '2^4 = 16 runs.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'Resolution IV means:', options: ['All effects clear', 'Main effects confounded', 'Main effects clear, 2FI confounded', 'Cannot estimate anything'], correctAnswer: 2, explanation: 'Resolution IV: main effects clear, 2-factor interactions confounded with each other.', points: 10 }
            ]
        }
    },
    {
        id: 'bb-msa',
        title: 'Measurement System Analysis',
        description: 'Gage R&R, bias, linearity, and measurement capability.',
        beltLevel: 'black',
        order: 3,
        estimatedMinutes: 55,
        lessons: [
            {
                id: 'bb-msa-1',
                title: 'Measurement System Errors',
                order: 1,
                estimatedMinutes: 20,
                videoUrl: 'https://www.youtube.com/embed/I3bZykU88Fg',
                videoTitle: 'Measurement System Analysis',
                content: `
<h2>Understanding Measurement Error</h2>

<h3>Total Observed Variation</h3>
<p>σ²_total = σ²_product + σ²_measurement</p>

<h3>Types of Measurement Error</h3>
<ul>
  <li><strong>Accuracy:</strong> Difference from true value</li>
  <li><strong>Precision:</strong> Repeatability and reproducibility</li>
</ul>

<h3>Accuracy Components</h3>
<ul>
  <li><strong>Bias:</strong> Systematic offset from true value</li>
  <li><strong>Linearity:</strong> Bias consistency across range</li>
  <li><strong>Stability:</strong> Consistency over time</li>
</ul>

<h3>Precision Components</h3>
<ul>
  <li><strong>Repeatability:</strong> Same person, same part, same conditions</li>
  <li><strong>Reproducibility:</strong> Different people measuring same part</li>
</ul>
        `
            },
            {
                id: 'bb-msa-2',
                title: 'Gage R&R Studies',
                order: 2,
                estimatedMinutes: 20,
                content: `
<h2>Gage Repeatability & Reproducibility</h2>

<h3>Study Design</h3>
<ul>
  <li>Select 10 parts across process range</li>
  <li>Select 2-3 operators</li>
  <li>Each operator measures each part 2-3 times</li>
  <li>Randomize measurement order</li>
</ul>

<h3>Analysis Methods</h3>
<ul>
  <li><strong>Range Method:</strong> Simple, less precise</li>
  <li><strong>ANOVA Method:</strong> More detailed, preferred</li>
</ul>

<h3>Acceptance Criteria</h3>
<table>
  <thead><tr><th>%GRR</th><th>Decision</th></tr></thead>
  <tbody>
    <tr><td>&lt; 10%</td><td>Acceptable</td></tr>
    <tr><td>10-30%</td><td>May be acceptable</td></tr>
    <tr><td>&gt; 30%</td><td>Unacceptable</td></tr>
  </tbody>
</table>

<h3>Number of Distinct Categories</h3>
<p>ndc = 1.41 × (σ_product / σ_gage)</p>
<p>Should be ≥ 5 for adequate discrimination</p>
        `
            },
            {
                id: 'bb-msa-3',
                title: 'Attribute MSA',
                order: 3,
                estimatedMinutes: 15,
                content: `
<h2>Attribute Measurement Analysis</h2>

<h3>When to Use</h3>
<p>For pass/fail, yes/no, or categorical measurements.</p>

<h3>Study Design</h3>
<ul>
  <li>Select 50+ parts (mix of good/bad)</li>
  <li>2-3 appraisers</li>
  <li>Each appraiser evaluates each part 2-3 times</li>
</ul>

<h3>Key Metrics</h3>
<ul>
  <li><strong>Agreement:</strong> % same decisions across trials</li>
  <li><strong>Miss Rate:</strong> Calling bad parts good</li>
  <li><strong>False Alarm Rate:</strong> Calling good parts bad</li>
  <li><strong>Kappa:</strong> Agreement beyond chance</li>
</ul>

<h3>Kappa Interpretation</h3>
<table>
  <thead><tr><th>Kappa</th><th>Agreement</th></tr></thead>
  <tbody>
    <tr><td>&lt; 0.2</td><td>Poor</td></tr>
    <tr><td>0.2-0.4</td><td>Fair</td></tr>
    <tr><td>0.4-0.6</td><td>Moderate</td></tr>
    <tr><td>0.6-0.8</td><td>Good</td></tr>
    <tr><td>&gt; 0.8</td><td>Excellent</td></tr>
  </tbody>
</table>
        `
            }
        ],
        quiz: {
            id: 'bb-msa-quiz',
            title: 'MSA Quiz',
            passingScore: 70,
            description: 'Test your MSA knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'An acceptable %GRR is:', options: ['< 10%', '10-30%', '> 30%', '> 50%'], correctAnswer: 0, explanation: '%GRR < 10% is considered acceptable.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'Repeatability measures variation from:', options: ['Different operators', 'Same operator', 'Different gages', 'Environment'], correctAnswer: 1, explanation: 'Repeatability is variation when the same operator measures repeatedly.', points: 10 }
            ]
        }
    },
    {
        id: 'bb-leadership',
        title: 'Black Belt Leadership',
        description: 'Change management, mentoring, and organizational influence.',
        beltLevel: 'black',
        order: 4,
        estimatedMinutes: 45,
        lessons: [
            {
                id: 'bb-lead-1',
                title: 'Change Management',
                order: 1,
                estimatedMinutes: 20,
                content: `
<h2>Leading Organizational Change</h2>

<h3>Kotter's 8 Steps</h3>
<ol>
  <li>Create urgency</li>
  <li>Form a guiding coalition</li>
  <li>Develop vision and strategy</li>
  <li>Communicate the vision</li>
  <li>Empower action</li>
  <li>Generate short-term wins</li>
  <li>Consolidate gains</li>
  <li>Anchor changes in culture</li>
</ol>

<h3>ADKAR Model</h3>
<ul>
  <li><strong>A</strong>wareness of need for change</li>
  <li><strong>D</strong>esire to participate</li>
  <li><strong>K</strong>nowledge of how to change</li>
  <li><strong>A</strong>bility to implement</li>
  <li><strong>R</strong>einforcement to sustain</li>
</ul>
        `
            },
            {
                id: 'bb-lead-2',
                title: 'Mentoring & Coaching',
                order: 2,
                estimatedMinutes: 15,
                content: `
<h2>Developing Others</h2>

<h3>Mentoring Green Belts</h3>
<ul>
  <li>Regular project reviews</li>
  <li>Tool selection guidance</li>
  <li>Stakeholder navigation</li>
  <li>Technical assistance</li>
  <li>Career development</li>
</ul>

<h3>Effective Coaching</h3>
<ul>
  <li>Ask questions instead of giving answers</li>
  <li>Let them own the solution</li>
  <li>Provide constructive feedback</li>
  <li>Celebrate successes</li>
</ul>
        `
            },
            {
                id: 'bb-lead-3',
                title: 'Executive Communication',
                order: 3,
                estimatedMinutes: 10,
                content: `
<h2>Communicating with Leadership</h2>

<h3>Executive Summary Format</h3>
<ul>
  <li><strong>Problem:</strong> One sentence</li>
  <li><strong>Impact:</strong> Financial/customer</li>
  <li><strong>Solution:</strong> Key changes</li>
  <li><strong>Results:</strong> Measurable improvement</li>
  <li><strong>Ask:</strong> What you need</li>
</ul>

<h3>Presenting Data</h3>
<ul>
  <li>Lead with conclusions</li>
  <li>Keep visuals simple</li>
  <li>Anticipate questions</li>
  <li>Focus on business impact</li>
</ul>
        `
            }
        ],
        quiz: {
            id: 'bb-lead-quiz',
            title: 'Leadership Quiz',
            passingScore: 70,
            description: 'Test your leadership knowledge.',
            questions: [
                { id: 'q1', type: 'multiple-choice', question: 'ADKAR stands for Awareness, Desire, Knowledge, Ability, and:', options: ['Results', 'Reinforcement', 'Recognition', 'Review'], correctAnswer: 1, explanation: 'ADKAR ends with Reinforcement to sustain change.', points: 10 },
                { id: 'q2', type: 'multiple-choice', question: 'Kotter\'s first step is to:', options: ['Form coalition', 'Create urgency', 'Develop vision', 'Communicate'], correctAnswer: 1, explanation: 'Creating urgency is the first step.', points: 10 }
            ]
        }
    }
];

// Black Belt Final Exam
export const blackBeltFinalExam: Quiz = {
    id: 'bb-final-exam',
    title: 'Black Belt Certification Exam',
    description: 'Complete all modules and pass this exam to earn your Black Belt certification.',
    passingScore: 70,
    timeLimit: 90,
    questions: [
        { id: 'f1', type: 'multiple-choice', question: 'R² measures:', options: ['Sample size', '% variation explained', 'Error rate', 'Significance'], correctAnswer: 1, explanation: 'R² = coefficient of determination.', points: 5 },
        { id: 'f2', type: 'multiple-choice', question: 'VIF detects:', options: ['Outliers', 'Multicollinearity', 'Non-normality', 'Bias'], correctAnswer: 1, explanation: 'VIF checks for multicollinearity.', points: 5 },
        { id: 'f3', type: 'multiple-choice', question: 'Kruskal-Wallis is the non-parametric alternative to:', options: ['t-test', 'Chi-square', 'ANOVA', 'Regression'], correctAnswer: 2, explanation: 'Kruskal-Wallis replaces one-way ANOVA.', points: 5 },
        { id: 'f4', type: 'multiple-choice', question: 'A 2^5 factorial has:', options: ['10 runs', '16 runs', '32 runs', '64 runs'], correctAnswer: 2, explanation: '2^5 = 32 runs.', points: 5 },
        { id: 'f5', type: 'multiple-choice', question: 'Resolution IV means main effects are:', options: ['Confounded', 'Clear', 'Missing', 'Aliased'], correctAnswer: 1, explanation: 'Resolution IV: main effects clear.', points: 5 },
        { id: 'f6', type: 'multiple-choice', question: 'CCD stands for:', options: ['Continuous Control Design', 'Central Composite Design', 'Complete Combination Data', 'Control Chart Display'], correctAnswer: 1, explanation: 'CCD = Central Composite Design.', points: 5 },
        { id: 'f7', type: 'multiple-choice', question: 'Acceptable %GRR is:', options: ['< 10%', '10-30%', '> 30%', '> 50%'], correctAnswer: 0, explanation: '%GRR < 10% is acceptable.', points: 5 },
        { id: 'f8', type: 'multiple-choice', question: 'Repeatability variation comes from:', options: ['Different operators', 'Same operator', 'Environment', 'Parts'], correctAnswer: 1, explanation: 'Repeatability = same operator variation.', points: 5 },
        { id: 'f9', type: 'multiple-choice', question: 'ndc should be at least:', options: ['2', '3', '5', '10'], correctAnswer: 2, explanation: 'Number of distinct categories should be ≥ 5.', points: 5 },
        { id: 'f10', type: 'multiple-choice', question: 'Kappa > 0.8 indicates:', options: ['Poor agreement', 'Fair agreement', 'Good agreement', 'Excellent agreement'], correctAnswer: 3, explanation: 'Kappa > 0.8 = excellent.', points: 5 },
        { id: 'f11', type: 'multiple-choice', question: 'ADKAR ends with:', options: ['Action', 'Reinforcement', 'Results', 'Review'], correctAnswer: 1, explanation: 'R = Reinforcement.', points: 5 },
        { id: 'f12', type: 'multiple-choice', question: 'Kotter\'s first step:', options: ['Vision', 'Coalition', 'Urgency', 'Communicate'], correctAnswer: 2, explanation: 'Step 1 = Create urgency.', points: 5 },
        { id: 'f13', type: 'multiple-choice', question: 'Post-hoc test after ANOVA:', options: ['t-test', 'Tukey HSD', 'Chi-square', 'Regression'], correctAnswer: 1, explanation: 'Tukey HSD for pairwise comparisons.', points: 5 },
        { id: 'f14', type: 'multiple-choice', question: 'Fractional factorial reduces:', options: ['Accuracy', 'Number of runs', 'Quality', 'Resolution'], correctAnswer: 1, explanation: 'Fractional designs use fewer runs.', points: 5 },
        { id: 'f15', type: 'multiple-choice', question: 'Bias is a component of:', options: ['Repeatability', 'Reproducibility', 'Accuracy', 'Stability'], correctAnswer: 2, explanation: 'Bias is an accuracy error.', points: 5 },
        { id: 'f16', type: 'true-false', question: 'Two-way ANOVA examines main effects and interactions.', options: ['True', 'False'], correctAnswer: 0, explanation: 'True. Two-way ANOVA tests A, B, and A×B.', points: 5 },
        { id: 'f17', type: 'multiple-choice', question: 'Contour plots visualize:', options: ['Time series', 'Response surface', 'Control limits', 'Capability'], correctAnswer: 1, explanation: 'Contour plots show response surface.', points: 5 },
        { id: 'f18', type: 'multiple-choice', question: 'Attribute MSA uses:', options: ['Gage R&R', 'Kappa statistic', 'Control charts', 'Regression'], correctAnswer: 1, explanation: 'Kappa measures attribute agreement.', points: 5 },
        { id: 'f19', type: 'multiple-choice', question: 'Adjusted R² accounts for:', options: ['Sample size', 'Outliers', 'Number of predictors', 'Bias'], correctAnswer: 2, explanation: 'Adjusted R² penalizes adding predictors.', points: 5 },
        { id: 'f20', type: 'multiple-choice', question: 'Bonferroni is a:', options: ['Regression type', 'Post-hoc test', 'Control chart', 'Sampling method'], correctAnswer: 1, explanation: 'Bonferroni is a conservative post-hoc test.', points: 5 }
    ]
};

export function getBlackBeltLessonCount(): number {
    return blackBeltModules.reduce((t, m) => t + m.lessons.length, 0);
}

export function getBlackBeltTotalMinutes(): number {
    return blackBeltModules.reduce((t, m) => t + m.estimatedMinutes, 0);
}
