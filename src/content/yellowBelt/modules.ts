import { Module, Quiz } from '../../types';

// Yellow Belt Module Content - Part 1: Introduction & Define Phase
// Sources: ASQ.org, Purdue University, DMAIC.com, GoLeanSixSigma.com

export const yellowBeltModules: Module[] = [
  {
    id: 'yb-intro',
    title: 'Yellow Belt Fundamentals',
    description: 'Understanding the Yellow Belt role and Lean Six Sigma foundations.',
    beltLevel: 'yellow',
    order: 1,
    estimatedMinutes: 40,
    lessons: [
      {
        id: 'yb-intro-1',
        title: 'The Yellow Belt Role',
        order: 1,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/GvDpYsGjMzg',
        videoTitle: 'What is Lean Six Sigma Yellow Belt - SSGI',
        content: `
<h2>Your Role as a Yellow Belt</h2>

<p>A <strong>Yellow Belt</strong> is a trained team member who participates in Six Sigma projects and applies basic quality improvement tools in their daily work.</p>

<h3>Yellow Belt Responsibilities</h3>
<ul>
  <li>Actively participate as a team member in improvement projects</li>
  <li>Collect and analyze data for Green/Black Belt projects</li>
  <li>Apply basic quality tools to solve problems</li>
  <li>Lead smaller-scale improvement initiatives (Kaizen events)</li>
  <li>Support process mapping and documentation</li>
  <li>Champion continuous improvement in your work area</li>
</ul>

<h3>Yellow Belt vs. Other Belts</h3>
<table>
  <thead>
    <tr>
      <th>Aspect</th>
      <th>White Belt</th>
      <th>Yellow Belt</th>
      <th>Green Belt</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Training Hours</td>
      <td>4-8 hours</td>
      <td>16-24 hours</td>
      <td>40-80 hours</td>
    </tr>
    <tr>
      <td>Project Role</td>
      <td>Awareness</td>
      <td>Team Member</td>
      <td>Project Leader</td>
    </tr>
    <tr>
      <td>Tool Proficiency</td>
      <td>Basic concepts</td>
      <td>7 basic tools</td>
      <td>Statistical analysis</td>
    </tr>
    <tr>
      <td>Time on Projects</td>
      <td>As needed</td>
      <td>10-25%</td>
      <td>25-50%</td>
    </tr>
  </tbody>
</table>

<h3>Value of Yellow Belt Certification</h3>
<ul>
  <li><strong>Career Development:</strong> Demonstrates commitment to quality and continuous improvement</li>
  <li><strong>Problem-Solving Skills:</strong> Structured approach to identifying and resolving issues</li>
  <li><strong>Team Contribution:</strong> Ability to actively support improvement projects</li>
  <li><strong>Foundation for Growth:</strong> Stepping stone to Green Belt and Black Belt</li>
</ul>
        `
      },
      {
        id: 'yb-intro-2',
        title: 'Lean Six Sigma Integration',
        order: 2,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/5L_eXtlC7gY',
        videoTitle: 'Lean Six Sigma Yellow Belt Training',
        content: `
<h2>Lean + Six Sigma = Lean Six Sigma</h2>

<p>Lean Six Sigma combines two powerful methodologies to deliver faster, better results.</p>

<h3>The Synergy</h3>
<table>
  <thead>
    <tr>
      <th>Lean</th>
      <th>Six Sigma</th>
      <th>Lean Six Sigma</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Eliminates waste</td>
      <td>Reduces variation</td>
      <td>Fast + Consistent</td>
    </tr>
    <tr>
      <td>Focus: Speed</td>
      <td>Focus: Quality</td>
      <td>Speed + Quality</td>
    </tr>
    <tr>
      <td>Toyota Production System</td>
      <td>Motorola/GE</td>
      <td>Best of both</td>
    </tr>
  </tbody>
</table>

<h3>Key Lean Concepts for Yellow Belts</h3>

<h4>Value-Added vs. Non-Value-Added</h4>
<ul>
  <li><strong>Value-Added (VA):</strong> Activities the customer is willing to pay for</li>
  <li><strong>Non-Value-Added (NVA):</strong> Activities that consume resources but don't add customer value</li>
  <li><strong>Necessary NVA:</strong> Required activities (compliance, safety) that don't directly add value</li>
</ul>

<h4>The 8 Wastes (DOWNTIME)</h4>
<ol>
  <li><strong>D</strong>efects - Errors requiring rework</li>
  <li><strong>O</strong>verproduction - Making more than needed</li>
  <li><strong>W</strong>aiting - Idle time</li>
  <li><strong>N</strong>on-utilized talent - Underusing people's skills</li>
  <li><strong>T</strong>ransportation - Unnecessary movement of materials</li>
  <li><strong>I</strong>nventory - Excess stock</li>
  <li><strong>M</strong>otion - Unnecessary human movement</li>
  <li><strong>E</strong>xtra-processing - Doing more work than needed</li>
</ol>

<div class="info-box">
  <h4>💡 Yellow Belt Focus</h4>
  <p>As a Yellow Belt, you should be able to identify waste in your daily work and suggest improvements. Start by observing your processes for the 8 wastes!</p>
</div>
        `
      },
      {
        id: 'yb-intro-3',
        title: 'DMAIC Deep Dive',
        order: 3,
        estimatedMinutes: 10,
        content: `
<h2>DMAIC: The Yellow Belt Roadmap</h2>

<p>DMAIC is your structured approach to solving problems and improving processes.</p>

<h3>Phase Overview</h3>

<h4>Define (D)</h4>
<p><strong>Question:</strong> What problem are we solving?</p>
<ul>
  <li>Create Project Charter</li>
  <li>Identify VOC (Voice of Customer)</li>
  <li>Define CTQ (Critical to Quality)</li>
  <li>Build SIPOC diagram</li>
</ul>

<h4>Measure (M)</h4>
<p><strong>Question:</strong> How bad is the problem?</p>
<ul>
  <li>Map the current process</li>
  <li>Collect baseline data</li>
  <li>Calculate current performance metrics</li>
  <li>Validate measurement system</li>
</ul>

<h4>Analyze (A)</h4>
<p><strong>Question:</strong> Why is the problem occurring?</p>
<ul>
  <li>Identify potential root causes</li>
  <li>Verify causes with data</li>
  <li>Prioritize causes to address</li>
</ul>

<h4>Improve (I)</h4>
<p><strong>Question:</strong> How do we fix it?</p>
<ul>
  <li>Generate solution ideas</li>
  <li>Select and test solutions</li>
  <li>Implement improvements</li>
  <li>Verify results</li>
</ul>

<h4>Control (C)</h4>
<p><strong>Question:</strong> How do we keep it fixed?</p>
<ul>
  <li>Develop control plans</li>
  <li>Standardize processes</li>
  <li>Monitor ongoing performance</li>
  <li>Close the project</li>
</ul>
        `
      }
    ],
    quiz: {
      id: 'yb-intro-quiz',
      title: 'Yellow Belt Fundamentals Quiz',
      description: 'Test your understanding of Yellow Belt basics.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What percentage of their time does a Yellow Belt typically spend on Six Sigma projects?',
          options: ['1-5%', '10-25%', '50-75%', '100%'],
          correctAnswer: 1,
          explanation: 'Yellow Belts typically spend 10-25% of their time on Six Sigma projects while maintaining their regular job duties.',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'Which of the following is NOT one of the 8 wastes in DOWNTIME?',
          options: ['Defects', 'Overprocessing', 'Quality', 'Transportation'],
          correctAnswer: 2,
          explanation: 'Quality is not a waste. The E in DOWNTIME stands for Extra-processing (or Over-processing).',
          points: 10
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'Lean focuses primarily on:',
          options: ['Reducing variation', 'Eliminating waste', 'Training employees', 'Customer surveys'],
          correctAnswer: 1,
          explanation: 'Lean methodology focuses on eliminating waste to improve speed and efficiency.',
          points: 10
        },
        {
          id: 'q4',
          type: 'true-false',
          question: 'A value-added activity is one that the customer is willing to pay for.',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True. Value-added activities transform products/services in ways customers value and will pay for.',
          points: 10
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'In DMAIC, which phase focuses on finding root causes?',
          options: ['Define', 'Measure', 'Analyze', 'Control'],
          correctAnswer: 2,
          explanation: 'The Analyze phase focuses on identifying and verifying root causes of problems.',
          points: 10
        }
      ]
    }
  },
  {
    id: 'yb-define',
    title: 'Define Phase Tools',
    description: 'Master the essential tools used in the Define phase of DMAIC.',
    beltLevel: 'yellow',
    order: 2,
    estimatedMinutes: 50,
    lessons: [
      {
        id: 'yb-define-1',
        title: 'Project Charter',
        order: 1,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/XKz5CptmTgY',
        videoTitle: 'How to Write a Project Charter - Six Sigma',
        content: `
<h2>The Project Charter</h2>

<p>A <strong>Project Charter</strong> is a document that formally authorizes a project and defines its scope, objectives, and participants.</p>

<h3>Key Elements of a Project Charter</h3>

<h4>1. Problem Statement</h4>
<p>A clear, concise description of the problem:</p>
<ul>
  <li>What is happening?</li>
  <li>Where is it happening?</li>
  <li>When did it start?</li>
  <li>What is the magnitude?</li>
</ul>
<p><strong>Example:</strong> "Customer complaint calls have increased by 35% over the past 6 months, from 100 to 135 calls per week, resulting in $50,000 in additional support costs."</p>

<h4>2. Goal Statement</h4>
<p>A SMART goal for what the project will achieve:</p>
<ul>
  <li><strong>S</strong>pecific - What exactly will be achieved?</li>
  <li><strong>M</strong>easurable - How will success be measured?</li>
  <li><strong>A</strong>chievable - Is the goal realistic?</li>
  <li><strong>R</strong>elevant - Does it align with business objectives?</li>
  <li><strong>T</strong>ime-bound - When will it be achieved?</li>
</ul>

<h4>3. Project Scope</h4>
<ul>
  <li>In Scope: What is included</li>
  <li>Out of Scope: What is excluded</li>
  <li>Start and end points of the process</li>
</ul>

<h4>4. Business Case</h4>
<ul>
  <li>Why is this project important?</li>
  <li>What is the financial impact?</li>
  <li>What are the consequences of not acting?</li>
</ul>

<h4>5. Team Composition</h4>
<ul>
  <li>Project Sponsor (Champion)</li>
  <li>Project Lead (Green/Black Belt)</li>
  <li>Team Members</li>
  <li>Subject Matter Experts</li>
</ul>

<h4>6. Timeline & Milestones</h4>
<ul>
  <li>Expected project duration</li>
  <li>Key milestones for each DMAIC phase</li>
  <li>Review dates</li>
</ul>
        `
      },
      {
        id: 'yb-define-2',
        title: 'Voice of Customer (VOC)',
        order: 2,
        estimatedMinutes: 15,
        content: `
<h2>Voice of the Customer (VOC)</h2>

<p><strong>VOC</strong> is the process of capturing customer needs, expectations, and preferences.</p>

<h3>Why VOC Matters</h3>
<p>Quality is defined by the customer. Without understanding what customers truly need, improvements may miss the mark.</p>

<h3>VOC Collection Methods</h3>

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Pros</th>
      <th>Cons</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Surveys</td>
      <td>Reach many customers, quantifiable</td>
      <td>Low response rates, surface-level</td>
    </tr>
    <tr>
      <td>Interviews</td>
      <td>Deep insights, clarification possible</td>
      <td>Time-intensive, small sample</td>
    </tr>
    <tr>
      <td>Focus Groups</td>
      <td>Group dynamics, creative ideas</td>
      <td>Groupthink, dominant personalities</td>
    </tr>
    <tr>
      <td>Observation</td>
      <td>Real behavior, unbiased</td>
      <td>Observer effect, interpretation needed</td>
    </tr>
    <tr>
      <td>Complaint Data</td>
      <td>Real problems, documented</td>
      <td>Only dissatisfied customers</td>
    </tr>
  </tbody>
</table>

<h3>From VOC to CTQ</h3>
<p>Customer statements must be translated into measurable requirements:</p>

<table>
  <thead>
    <tr>
      <th>VOC Statement</th>
      <th>Customer Need</th>
      <th>CTQ (Measurable)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"I want fast delivery"</td>
      <td>Quick turnaround</td>
      <td>Delivery within 2 business days</td>
    </tr>
    <tr>
      <td>"The product should work"</td>
      <td>Reliability</td>
      <td>< 1% defect rate</td>
    </tr>
    <tr>
      <td>"I need good support"</td>
      <td>Responsive service</td>
      <td>Calls answered in < 60 seconds</td>
    </tr>
  </tbody>
</table>

<div class="info-box">
  <h4>💡 CTQ Flow</h4>
  <p>VOC → Customer Need → CTQ (Specific, Measurable Requirement)</p>
</div>
        `
      },
      {
        id: 'yb-define-3',
        title: 'SIPOC Diagram',
        order: 3,
        estimatedMinutes: 20,
        videoUrl: 'https://www.youtube.com/embed/3cNjqJKoQ0o',
        videoTitle: 'SIPOC Diagram Explained - Six Sigma Tool',
        content: `
<h2>SIPOC Diagram</h2>

<p><strong>SIPOC</strong> is a high-level process map that identifies the key elements of a process before detailed mapping.</p>

<h3>SIPOC Elements</h3>

<dl>
  <dt><strong>S - Suppliers</strong></dt>
  <dd>Who provides inputs to the process? (Internal or external)</dd>

  <dt><strong>I - Inputs</strong></dt>
  <dd>What materials, information, or resources are needed?</dd>

  <dt><strong>P - Process</strong></dt>
  <dd>What are the major steps (typically 5-7 high-level steps)?</dd>

  <dt><strong>O - Outputs</strong></dt>
  <dd>What products or services are delivered?</dd>

  <dt><strong>C - Customers</strong></dt>
  <dd>Who receives the outputs? (Internal or external)</dd>
</dl>

<h3>SIPOC Example: Restaurant Order Process</h3>

<table>
  <thead>
    <tr>
      <th>Suppliers</th>
      <th>Inputs</th>
      <th>Process</th>
      <th>Outputs</th>
      <th>Customers</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        • Food vendors<br>
        • Customer
      </td>
      <td>
        • Food ingredients<br>
        • Customer order<br>
        • Menu
      </td>
      <td>
        1. Take order<br>
        2. Prepare food<br>
        3. Quality check<br>
        4. Serve food<br>
        5. Process payment
      </td>
      <td>
        • Prepared meal<br>
        • Receipt<br>
        • Dining experience
      </td>
      <td>
        • Diner<br>
        • Management<br>
        • Accounting
      </td>
    </tr>
  </tbody>
</table>

<h3>When to Use SIPOC</h3>
<ul>
  <li>At the start of a project to align team understanding</li>
  <li>To define process boundaries</li>
  <li>Before creating detailed process maps</li>
  <li>To identify stakeholders</li>
</ul>

<h3>Tips for Creating SIPOC</h3>
<ol>
  <li>Start with the Process (P) - identify 5-7 major steps</li>
  <li>Then identify Outputs (O) - what does the process produce?</li>
  <li>Identify Customers (C) - who receives the outputs?</li>
  <li>Identify Inputs (I) - what is needed to run the process?</li>
  <li>Finally, Suppliers (S) - who provides the inputs?</li>
</ol>
        `
      }
    ],
    quiz: {
      id: 'yb-define-quiz',
      title: 'Define Phase Quiz',
      description: 'Test your knowledge of Define phase tools.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What does SIPOC stand for?',
          options: [
            'Suppliers, Inputs, Process, Outputs, Customers',
            'Systems, Information, Procedures, Operations, Controls',
            'Statistical, Input, Process, Output, Chart',
            'Six Sigma, Improvement, Performance, Optimization, Control'
          ],
          correctAnswer: 0,
          explanation: 'SIPOC stands for Suppliers, Inputs, Process, Outputs, Customers - a high-level process mapping tool.',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'Which element should you typically start with when building a SIPOC?',
          options: ['Suppliers', 'Inputs', 'Process', 'Customers'],
          correctAnswer: 2,
          explanation: 'Start with the Process (5-7 high-level steps) as it helps identify everything else.',
          points: 10
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'A SMART goal must be all of the following EXCEPT:',
          options: ['Specific', 'Measurable', 'Ambitious', 'Time-bound'],
          correctAnswer: 2,
          explanation: 'SMART stands for Specific, Measurable, Achievable, Relevant, Time-bound. Ambitious is not part of SMART.',
          points: 10
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'CTQ stands for:',
          options: ['Cost to Quality', 'Critical to Quality', 'Customer to Quality', 'Control the Quality'],
          correctAnswer: 1,
          explanation: 'CTQ means Critical to Quality - measurable characteristics that must meet customer expectations.',
          points: 10
        },
        {
          id: 'q5',
          type: 'true-false',
          question: 'VOC should only be collected through customer surveys.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. VOC can be collected through surveys, interviews, focus groups, observation, complaint data, and more.',
          points: 10
        }
      ]
    }
  }
];

// Additional modules added via push
yellowBeltModules.push(
  {
    id: 'yb-measure',
    title: 'Measure Phase Tools',
    description: 'Learn data collection, process mapping, and baseline metrics.',
    beltLevel: 'yellow',
    order: 3,
    estimatedMinutes: 45,
    lessons: [
      {
        id: 'yb-measure-1',
        title: 'Process Mapping',
        order: 1,
        estimatedMinutes: 20,
        videoUrl: 'https://www.youtube.com/embed/bCe2Nh9hMwc',
        videoTitle: 'Process Mapping Tutorial',
        content: `
<h2>Process Mapping</h2>
<p>Process maps visualize the steps in a process to identify inefficiencies and improvement opportunities.</p>

<h3>Types of Process Maps</h3>
<ul>
  <li><strong>Basic Flowchart:</strong> Simple sequence of steps</li>
  <li><strong>Swimlane Diagram:</strong> Shows responsibilities by role/department</li>
  <li><strong>Value Stream Map:</strong> Includes time and inventory data</li>
</ul>

<h3>Standard Flowchart Symbols</h3>
<ul>
  <li><strong>Oval:</strong> Start/End</li>
  <li><strong>Rectangle:</strong> Activity/Step</li>
  <li><strong>Diamond:</strong> Decision point</li>
  <li><strong>Arrow:</strong> Flow direction</li>
  <li><strong>Parallelogram:</strong> Input/Output</li>
</ul>

<h3>Creating Effective Process Maps</h3>
<ol>
  <li>Define the start and end points</li>
  <li>Walk the actual process (Gemba walk)</li>
  <li>Document each step as it actually happens (not how it should)</li>
  <li>Identify decision points</li>
  <li>Validate with process participants</li>
</ol>
        `
      },
      {
        id: 'yb-measure-2',
        title: 'Data Collection',
        order: 2,
        estimatedMinutes: 15,
        content: `
<h2>Data Collection Planning</h2>
<p>Quality data is essential for fact-based decision making.</p>

<h3>Types of Data</h3>
<table>
  <thead>
    <tr><th>Type</th><th>Description</th><th>Examples</th></tr>
  </thead>
  <tbody>
    <tr><td>Continuous</td><td>Measured on a scale</td><td>Time, temperature, weight</td></tr>
    <tr><td>Discrete</td><td>Counted in whole numbers</td><td>Defect count, orders, calls</td></tr>
    <tr><td>Attribute</td><td>Categories or classifications</td><td>Pass/Fail, Color, Type</td></tr>
  </tbody>
</table>

<h3>Data Collection Plan Elements</h3>
<ul>
  <li><strong>What:</strong> What data needs to be collected?</li>
  <li><strong>Who:</strong> Who will collect it?</li>
  <li><strong>When:</strong> How often? What time period?</li>
  <li><strong>Where:</strong> At what point in the process?</li>
  <li><strong>How:</strong> What method/tool will be used?</li>
</ul>
        `
      },
      {
        id: 'yb-measure-3',
        title: 'Basic Metrics',
        order: 3,
        estimatedMinutes: 10,
        content: `
<h2>Key Performance Metrics</h2>

<h3>DPU - Defects Per Unit</h3>
<p>DPU = Total Defects / Total Units</p>
<p>Example: 50 defects in 200 units = 0.25 DPU</p>

<h3>DPMO - Defects Per Million Opportunities</h3>
<p>DPMO = (Defects / (Units × Opportunities per Unit)) × 1,000,000</p>

<h3>Yield Metrics</h3>
<ul>
  <li><strong>FPY (First Pass Yield):</strong> % passing without rework</li>
  <li><strong>RTY (Rolled Throughput Yield):</strong> FPY₁ × FPY₂ × ... FPYₙ</li>
</ul>

<h3>Cycle Time</h3>
<p>Total time from start to finish of a process, including wait time.</p>
        `
      }
    ],
    quiz: {
      id: 'yb-measure-quiz',
      title: 'Measure Phase Quiz',
      passingScore: 70,
      description: 'Test your Measure phase knowledge.',
      questions: [
        { id: 'q1', type: 'multiple-choice', question: 'Which flowchart symbol represents a decision?', options: ['Oval', 'Rectangle', 'Diamond', 'Arrow'], correctAnswer: 2, explanation: 'Diamond shapes represent decision points in flowcharts.', points: 10 },
        { id: 'q2', type: 'multiple-choice', question: 'What type of data is temperature?', options: ['Discrete', 'Attribute', 'Continuous', 'Categorical'], correctAnswer: 2, explanation: 'Temperature is continuous data measured on a scale.', points: 10 },
        { id: 'q3', type: 'multiple-choice', question: 'DPMO stands for:', options: ['Defects Per Million Operations', 'Defects Per Million Opportunities', 'Data Points Measured Overall', 'Defect Prevention Methods Overview'], correctAnswer: 1, explanation: 'DPMO = Defects Per Million Opportunities.', points: 10 }
      ]
    }
  },
  {
    id: 'yb-analyze',
    title: 'Analyze Phase Tools',
    description: 'Master root cause analysis techniques.',
    beltLevel: 'yellow',
    order: 4,
    estimatedMinutes: 50,
    lessons: [
      {
        id: 'yb-analyze-1',
        title: 'Fishbone Diagram',
        order: 1,
        estimatedMinutes: 20,
        videoUrl: 'https://www.youtube.com/embed/mLvcy73BpOE',
        videoTitle: 'Fishbone Diagram Tutorial',
        content: `
<h2>Cause-and-Effect (Fishbone) Diagram</h2>
<p>Also called Ishikawa Diagram, this tool organizes potential causes of a problem.</p>

<h3>The 6Ms Categories</h3>
<ul>
  <li><strong>Man:</strong> People, skills, training</li>
  <li><strong>Machine:</strong> Equipment, technology, tools</li>
  <li><strong>Material:</strong> Raw materials, supplies, inputs</li>
  <li><strong>Method:</strong> Procedures, processes, policies</li>
  <li><strong>Measurement:</strong> Data accuracy, calibration</li>
  <li><strong>Mother Nature:</strong> Environment, weather, conditions</li>
</ul>

<h3>How to Build a Fishbone</h3>
<ol>
  <li>Write the problem (effect) on the right</li>
  <li>Draw the main "spine" arrow</li>
  <li>Add category "bones" (6Ms or custom)</li>
  <li>Brainstorm causes for each category</li>
  <li>Ask "Why?" to drill deeper</li>
</ol>
        `
      },
      {
        id: 'yb-analyze-2',
        title: 'Pareto Analysis',
        order: 2,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/9rJT8A4f4xE',
        videoTitle: 'Pareto Chart Explained',
        content: `
<h2>Pareto Analysis</h2>
<p>The Pareto Principle (80/20 rule): roughly 80% of effects come from 20% of causes.</p>

<h3>Building a Pareto Chart</h3>
<ol>
  <li>List all problems/causes</li>
  <li>Count frequency of each</li>
  <li>Sort from highest to lowest</li>
  <li>Calculate cumulative percentage</li>
  <li>Create bar chart with cumulative line</li>
</ol>

<h3>Using Pareto for Prioritization</h3>
<p>Focus on the "vital few" causes that contribute to most of the problem, not the "trivial many."</p>
        `
      },
      {
        id: 'yb-analyze-3',
        title: '5 Whys Deep Dive',
        order: 3,
        estimatedMinutes: 15,
        content: `
<h2>5 Whys Root Cause Analysis</h2>
<p>Simple technique to drill down to the true root cause by repeatedly asking "Why?"</p>

<h3>Example</h3>
<table>
  <tr><td><strong>Problem:</strong></td><td>Customer received wrong product</td></tr>
  <tr><td><strong>Why 1:</strong></td><td>Wrong item was shipped</td></tr>
  <tr><td><strong>Why 2:</strong></td><td>Picker selected wrong item</td></tr>
  <tr><td><strong>Why 3:</strong></td><td>Items looked similar on shelf</td></tr>
  <tr><td><strong>Why 4:</strong></td><td>No photos on pick labels</td></tr>
  <tr><td><strong>Why 5:</strong></td><td>Label system doesn't support images</td></tr>
</table>
<p><strong>Root Cause:</strong> Label printing system limitations</p>
<p><strong>Solution:</strong> Upgrade label system or add product photos</p>
        `
      }
    ],
    quiz: {
      id: 'yb-analyze-quiz',
      title: 'Analyze Phase Quiz',
      passingScore: 70,
      description: 'Test your Analyze phase knowledge.',
      questions: [
        { id: 'q1', type: 'multiple-choice', question: 'The 6Ms include all EXCEPT:', options: ['Man', 'Machine', 'Money', 'Method'], correctAnswer: 2, explanation: 'The 6Ms are Man, Machine, Material, Method, Measurement, Mother Nature. Money is not included.', points: 10 },
        { id: 'q2', type: 'multiple-choice', question: 'The Pareto principle states that roughly ___ of effects come from ___ of causes:', options: ['50%/50%', '80%/20%', '90%/10%', '70%/30%'], correctAnswer: 1, explanation: 'The 80/20 rule: 80% of effects from 20% of causes.', points: 10 }
      ]
    }
  },
  {
    id: 'yb-improve',
    title: 'Improve Phase Techniques',
    description: 'Learn solution generation and implementation strategies.',
    beltLevel: 'yellow',
    order: 5,
    estimatedMinutes: 40,
    lessons: [
      {
        id: 'yb-improve-1',
        title: 'Brainstorming Solutions',
        order: 1,
        estimatedMinutes: 15,
        content: `
<h2>Generating Solutions</h2>
<h3>Brainstorming Rules</h3>
<ul>
  <li>No criticism - all ideas welcome</li>
  <li>Go for quantity</li>
  <li>Build on others' ideas</li>
  <li>Wild ideas encouraged</li>
</ul>

<h3>Solution Prioritization Matrix</h3>
<p>Evaluate solutions on Impact vs. Effort:</p>
<ul>
  <li><strong>Quick Wins:</strong> High impact, low effort (Do first!)</li>
  <li><strong>Major Projects:</strong> High impact, high effort (Plan carefully)</li>
  <li><strong>Fill-ins:</b> Low impact, low effort (If time permits)</li>
  <li><strong>Thankless Tasks:</strong> Low impact, high effort (Avoid)</li>
</ul>
        `
      },
      {
        id: 'yb-improve-2',
        title: 'Error-Proofing (Poka-Yoke)',
        order: 2,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/0zT5oQH3dAM',
        videoTitle: 'Poka-Yoke Explained',
        content: `
<h2>Poka-Yoke: Mistake-Proofing</h2>
<p>Design processes so errors are impossible or immediately detected.</p>

<h3>Levels of Poka-Yoke</h3>
<ol>
  <li><strong>Prevention:</strong> Makes error impossible (USB port shape)</li>
  <li><strong>Detection:</strong> Alerts when error occurs (spell checker)</li>
  <li><strong>Mitigation:</strong> Minimizes impact (seatbelt warning)</li>
</ol>

<h3>Everyday Examples</h3>
<ul>
  <li>Gas pump nozzles sized for vehicle type</li>
  <li>Elevator doors that bounce back</li>
  <li>Microwave that stops when door opens</li>
  <li>SIM cards with corner cut</li>
</ul>
        `
      }
    ],
    quiz: {
      id: 'yb-improve-quiz',
      title: 'Improve Phase Quiz',
      passingScore: 70,
      description: 'Test your improvement knowledge.',
      questions: [
        { id: 'q1', type: 'multiple-choice', question: 'Which solutions should be implemented first?', options: ['Major Projects', 'Quick Wins', 'Fill-ins', 'Thankless Tasks'], correctAnswer: 1, explanation: 'Quick Wins (high impact, low effort) give fast results and build momentum.', points: 10 },
        { id: 'q2', type: 'multiple-choice', question: 'Poka-Yoke means:', options: ['Quality control', 'Error-proofing', 'Team building', 'Data analysis'], correctAnswer: 1, explanation: 'Poka-Yoke is Japanese for mistake-proofing.', points: 10 }
      ]
    }
  },
  {
    id: 'yb-control',
    title: 'Control Phase',
    description: 'Sustain improvements with control plans and monitoring.',
    beltLevel: 'yellow',
    order: 6,
    estimatedMinutes: 35,
    lessons: [
      {
        id: 'yb-control-1',
        title: 'Control Plans',
        order: 1,
        estimatedMinutes: 20,
        content: `
<h2>Control Plans</h2>
<p>A control plan documents how improvements will be maintained over time.</p>

<h3>Control Plan Elements</h3>
<ul>
  <li><strong>What to monitor:</strong> Key process variables and outputs</li>
  <li><strong>How to measure:</b> Measurement method and tools</li>
  <li><strong>Who monitors:</strong> Responsible person/role</li>
  <li><strong>When to measure:</strong> Frequency of measurement</li>
  <li><strong>Specification limits:</strong> Acceptable ranges</li>
  <li><strong>Reaction plan:</strong> What to do when out of spec</li>
</ul>

<h3>Standard Work</h3>
<p>Documented best practices that ensure consistency:</p>
<ul>
  <li>Step-by-step work instructions</li>
  <li>Visual aids and job aids</li>
  <li>Training materials</li>
  <li>Checklists</li>
</ul>
        `
      },
      {
        id: 'yb-control-2',
        title: 'Visual Management',
        order: 2,
        estimatedMinutes: 15,
        content: `
<h2>Visual Management</h2>
<p>Make process status visible at a glance.</p>

<h3>Visual Management Tools</h3>
<ul>
  <li><strong>Performance Boards:</strong> KPIs visible to all</li>
  <li><strong>Andon Systems:</strong> Lights/signals for status</li>
  <li><strong>Floor Markings:</strong> Define work areas</li>
  <li><strong>Color Coding:</strong> Quick identification</li>
  <li><strong>Shadow Boards:</strong> Tool organization</li>
</ul>

<div class="info-box">
  <h4>💡 5S Connection</h4>
  <p>Visual management is essential to the Sustain phase of 5S - it makes abnormalities immediately visible.</p>
</div>
        `
      }
    ],
    quiz: {
      id: 'yb-control-quiz',
      title: 'Control Phase Quiz',
      passingScore: 70,
      description: 'Test your control knowledge.',
      questions: [
        { id: 'q1', type: 'multiple-choice', question: 'A control plan should include all EXCEPT:', options: ['What to monitor', 'Who monitors', 'Competitor analysis', 'Reaction plan'], correctAnswer: 2, explanation: 'Control plans focus on internal monitoring, not competitor analysis.', points: 10 },
        { id: 'q2', type: 'true-false', question: 'Visual management makes process status visible at a glance.', options: ['True', 'False'], correctAnswer: 0, explanation: 'True. Visual tools enable quick understanding of status.', points: 10 }
      ]
    }
  }
);

// Yellow Belt Final Exam
export const yellowBeltFinalExam: Quiz = {
  id: 'yb-final-exam',
  title: 'Yellow Belt Certification Exam',
  description: 'Complete all modules and pass this exam to earn your Yellow Belt certification.',
  passingScore: 70,
  timeLimit: 45,
  questions: [
    { id: 'f1', type: 'multiple-choice', question: 'SIPOC stands for:', options: ['Suppliers, Inputs, Process, Outputs, Customers', 'System, Information, Process, Output, Control', 'Six Sigma, Improvement, Performance, Optimization, Control', 'Standards, Instructions, Procedures, Operations, Controls'], correctAnswer: 0, explanation: 'SIPOC: Suppliers, Inputs, Process, Outputs, Customers.', points: 5 },
    { id: 'f2', type: 'multiple-choice', question: 'The 8 wastes are remembered by the acronym:', options: ['TIMWOOD', 'DOWNTIME', 'WASTE8S', 'LEANWST'], correctAnswer: 1, explanation: 'DOWNTIME: Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra-processing.', points: 5 },
    { id: 'f3', type: 'multiple-choice', question: 'VOC stands for:', options: ['Value of Customer', 'Voice of Customer', 'Variation of Cost', 'Verification of Compliance'], correctAnswer: 1, explanation: 'VOC = Voice of Customer.', points: 5 },
    { id: 'f4', type: 'multiple-choice', question: 'A SMART goal must be:', options: ['Simple, Measurable, Achievable, Relevant, Tested', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Strategic, Meaningful, Actionable, Realistic, Tracked', 'Standard, Metric, Attainable, Required, Targeted'], correctAnswer: 1, explanation: 'SMART: Specific, Measurable, Achievable, Relevant, Time-bound.', points: 5 },
    { id: 'f5', type: 'multiple-choice', question: 'Which phase of DMAIC identifies root causes?', options: ['Define', 'Measure', 'Analyze', 'Improve'], correctAnswer: 2, explanation: 'Analyze phase identifies and verifies root causes.', points: 5 },
    { id: 'f6', type: 'multiple-choice', question: 'The Fishbone diagram is also called:', options: ['Pareto Chart', 'Ishikawa Diagram', 'Control Chart', 'Run Chart'], correctAnswer: 1, explanation: 'Fishbone = Ishikawa = Cause-and-Effect Diagram.', points: 5 },
    { id: 'f7', type: 'multiple-choice', question: 'The 6Ms include all EXCEPT:', options: ['Man', 'Money', 'Method', 'Measurement'], correctAnswer: 1, explanation: '6Ms: Man, Machine, Material, Method, Measurement, Mother Nature.', points: 5 },
    { id: 'f8', type: 'multiple-choice', question: 'The Pareto principle is also known as:', options: ['50/50 rule', '80/20 rule', '90/10 rule', '70/30 rule'], correctAnswer: 1, explanation: 'Pareto = 80/20 rule.', points: 5 },
    { id: 'f9', type: 'multiple-choice', question: 'Poka-Yoke means:', options: ['Continuous improvement', 'Error-proofing', 'Visual management', 'Team building'], correctAnswer: 1, explanation: 'Poka-Yoke = mistake-proofing.', points: 5 },
    { id: 'f10', type: 'multiple-choice', question: 'Which flowchart symbol represents a decision?', options: ['Oval', 'Rectangle', 'Diamond', 'Arrow'], correctAnswer: 2, explanation: 'Diamond = decision point.', points: 5 },
    { id: 'f11', type: 'multiple-choice', question: 'CTQ stands for:', options: ['Cost to Quality', 'Critical to Quality', 'Control the Quality', 'Customer to Quality'], correctAnswer: 1, explanation: 'CTQ = Critical to Quality.', points: 5 },
    { id: 'f12', type: 'multiple-choice', question: 'What type of data is "Pass/Fail"?', options: ['Continuous', 'Discrete', 'Attribute', 'Variable'], correctAnswer: 2, explanation: 'Pass/Fail is attribute (categorical) data.', points: 5 },
    { id: 'f13', type: 'true-false', question: 'Yellow Belts typically spend 100% of their time on Six Sigma projects.', options: ['True', 'False'], correctAnswer: 1, explanation: 'False. Yellow Belts typically spend 10-25% on projects.', points: 5 },
    { id: 'f14', type: 'multiple-choice', question: 'Quick Wins in solution prioritization are:', options: ['High impact, high effort', 'High impact, low effort', 'Low impact, high effort', 'Low impact, low effort'], correctAnswer: 1, explanation: 'Quick Wins = high impact, low effort.', points: 5 },
    { id: 'f15', type: 'multiple-choice', question: 'A control plan should NOT include:', options: ['What to monitor', 'Competitor pricing', 'Reaction plan', 'Measurement frequency'], correctAnswer: 1, explanation: 'Control plans focus on internal process control.', points: 5 },
    { id: 'f16', type: 'true-false', question: 'Lean focuses primarily on eliminating waste.', options: ['True', 'False'], correctAnswer: 0, explanation: 'True. Lean = waste elimination.', points: 5 },
    { id: 'f17', type: 'multiple-choice', question: 'First Pass Yield (FPY) measures:', options: ['Total output', '% passing without rework', 'Defects per unit', 'Cycle time'], correctAnswer: 1, explanation: 'FPY = percentage passing without rework.', points: 5 },
    { id: 'f18', type: 'multiple-choice', question: 'The "D" in DOWNTIME waste stands for:', options: ['Delays', 'Defects', 'Documentation', 'Delivery'], correctAnswer: 1, explanation: 'D = Defects.', points: 5 },
    { id: 'f19', type: 'multiple-choice', question: 'Which is NOT a VOC collection method?', options: ['Surveys', 'Interviews', 'Competitor analysis', 'Focus groups'], correctAnswer: 2, explanation: 'VOC focuses on customers, not competitors.', points: 5 },
    { id: 'f20', type: 'multiple-choice', question: 'Visual management helps:', options: ['Hide problems', 'Make status visible', 'Reduce training', 'Eliminate meetings'], correctAnswer: 1, explanation: 'Visual management makes status visible at a glance.', points: 5 }
  ]
};

export function getYellowBeltLessonCount(): number {
  return yellowBeltModules.reduce((t, m) => t + m.lessons.length, 0);
}

export function getYellowBeltTotalMinutes(): number {
  return yellowBeltModules.reduce((t, m) => t + m.estimatedMinutes, 0);
}
