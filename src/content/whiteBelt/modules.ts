import { Module, Quiz } from '../../types';

// White Belt Module Content
// Sources: ASQ.org, 6sigma.us, Council for Six Sigma Certification (CSSC)

export const whiteBeltModules: Module[] = [
  {
    id: 'wb-intro',
    title: 'Introduction to Six Sigma',
    description: 'Learn the history, philosophy, and core principles of Six Sigma methodology.',
    beltLevel: 'white',
    order: 1,
    estimatedMinutes: 45,
    lessons: [
      {
        id: 'wb-intro-1',
        title: 'What is Six Sigma?',
        order: 1,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/mLFgMhCj0Po',
        videoTitle: 'Introduction to Lean Six Sigma - The Lean Six Sigma Company',
        content: `
<h2>What is Six Sigma?</h2>

<p>Six Sigma is a <strong>disciplined, data-driven approach</strong> for eliminating defects in any process – from manufacturing to transactional and from product to service.</p>

<h3>Core Definition</h3>
<p>Six Sigma is a quality management methodology that provides organizations with tools to improve the capability of their business processes. The statistical objective is to achieve a process that produces no more than <strong>3.4 defects per million opportunities (DPMO)</strong>.</p>

<h3>The Sigma Levels</h3>
<table>
  <thead>
    <tr>
      <th>Sigma Level</th>
      <th>DPMO</th>
      <th>Yield %</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1σ</td><td>690,000</td><td>31%</td></tr>
    <tr><td>2σ</td><td>308,000</td><td>69.2%</td></tr>
    <tr><td>3σ</td><td>66,800</td><td>93.3%</td></tr>
    <tr><td>4σ</td><td>6,210</td><td>99.38%</td></tr>
    <tr><td>5σ</td><td>230</td><td>99.977%</td></tr>
    <tr><td>6σ</td><td>3.4</td><td>99.99966%</td></tr>
  </tbody>
</table>

<h3>Key Characteristics</h3>
<ul>
  <li><strong>Data-Driven:</strong> Decisions are based on facts and statistical analysis, not assumptions</li>
  <li><strong>Customer-Focused:</strong> Quality is defined by what the customer values</li>
  <li><strong>Process-Centric:</strong> Every activity is viewed as a process that can be improved</li>
  <li><strong>Structured Methodology:</strong> Uses DMAIC (Define, Measure, Analyze, Improve, Control) framework</li>
</ul>

<div class="info-box">
  <h4>💡 Key Takeaway</h4>
  <p>Six Sigma is not just about reducing defects – it's about creating a culture of continuous improvement where decisions are made based on data, not guesswork.</p>
</div>
        `
      },
      {
        id: 'wb-intro-2',
        title: 'History of Six Sigma',
        order: 2,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/A0pq0P6e_QM',
        videoTitle: 'History of Six Sigma - The Complete Story',
        content: `
<h2>The History of Six Sigma</h2>

<p>Understanding the origins of Six Sigma helps appreciate its power and evolution as a quality methodology.</p>

<h3>Origins at Motorola (1986)</h3>
<p>Six Sigma was developed by <strong>Bill Smith</strong>, a senior engineer at Motorola, who is often called the "Father of Six Sigma." Smith introduced the methodology in 1986 as a way to improve manufacturing quality by applying statistical analysis.</p>

<h4>Key Events:</h4>
<ul>
  <li><strong>1986:</strong> Bill Smith develops Six Sigma at Motorola</li>
  <li><strong>1988:</strong> Motorola wins the Malcolm Baldrige National Quality Award</li>
  <li><strong>1991:</strong> Motorola registers "Six Sigma" as a trademark</li>
</ul>

<h3>General Electric's Transformation (1995)</h3>
<p>Six Sigma gained massive popularity when <strong>Jack Welch</strong>, CEO of General Electric, made it central to GE's business strategy in 1995. Welch linked Six Sigma success to financial results and executive compensation.</p>

<blockquote>
  "Six Sigma has forever changed GE. Everyone is a believer now."
  <cite>— Jack Welch, Former CEO of General Electric</cite>
</blockquote>

<h3>Industry Adoption</h3>
<p>By the late 1990s, approximately <strong>two-thirds of Fortune 500 companies</strong> had initiated Six Sigma programs. Today, Six Sigma is used across industries including:</p>
<ul>
  <li>Manufacturing</li>
  <li>Healthcare</li>
  <li>Finance and Banking</li>
  <li>Information Technology</li>
  <li>Government</li>
</ul>

<h3>Evolution: Lean Six Sigma</h3>
<p>In the 2000s, Six Sigma merged with <strong>Lean manufacturing principles</strong> to create <strong>Lean Six Sigma</strong>, combining:</p>
<ul>
  <li>Six Sigma's focus on reducing variation and defects</li>
  <li>Lean's focus on eliminating waste and improving flow</li>
</ul>
        `
      },
      {
        id: 'wb-intro-3',
        title: 'Core Principles of Six Sigma',
        order: 3,
        estimatedMinutes: 15,
        content: `
<h2>The Six Core Principles of Six Sigma</h2>

<p>Six Sigma is built on fundamental principles that guide all improvement efforts.</p>

<h3>1. Customer Focus</h3>
<p>Everything starts and ends with the customer. Quality is defined by what matters most to customers (Critical to Quality - CTQ).</p>
<ul>
  <li>Understand customer needs and expectations</li>
  <li>Translate customer requirements into measurable specifications</li>
  <li>Continuously strive to exceed customer expectations</li>
</ul>

<h3>2. Data-Driven Decision Making</h3>
<p>Six Sigma relies on <strong>facts and data</strong>, not opinions or assumptions.</p>
<ul>
  <li>Collect relevant data on process performance</li>
  <li>Use statistical tools to analyze data</li>
  <li>Make decisions based on evidence</li>
</ul>

<h3>3. Process Focus</h3>
<p>All work is accomplished through processes. Improving the process improves the outcome.</p>
<ul>
  <li>Map and understand current processes</li>
  <li>Identify bottlenecks and waste</li>
  <li>Standardize best practices</li>
</ul>

<h3>4. Proactive Management</h3>
<p>Prevent problems before they occur rather than reacting to them.</p>
<ul>
  <li>Anticipate potential issues</li>
  <li>Implement preventive measures</li>
  <li>Reduce firefighting and crisis management</li>
</ul>

<h3>5. Collaboration Without Boundaries</h3>
<p>Break down silos and foster cross-functional teamwork.</p>
<ul>
  <li>Involve stakeholders from all relevant areas</li>
  <li>Share knowledge and best practices</li>
  <li>Build consensus for sustainable change</li>
</ul>

<h3>6. Strive for Perfection, Tolerate Failure</h3>
<p>Aim for breakthrough improvements while accepting that not every attempt will succeed.</p>
<ul>
  <li>Set ambitious improvement goals</li>
  <li>Learn from failures</li>
  <li>Continuously iterate and improve</li>
</ul>
        `
      }
    ],
    quiz: {
      id: 'wb-intro-quiz',
      title: 'Introduction to Six Sigma Quiz',
      description: 'Test your understanding of Six Sigma basics.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the statistical goal of Six Sigma in terms of defects per million opportunities?',
          options: ['3.4 DPMO', '34 DPMO', '340 DPMO', '3,400 DPMO'],
          correctAnswer: 0,
          explanation: 'Six Sigma aims for no more than 3.4 defects per million opportunities (DPMO), representing a 99.99966% yield.',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'Who is credited as the "Father of Six Sigma"?',
          options: ['Jack Welch', 'W. Edwards Deming', 'Bill Smith', 'Joseph Juran'],
          correctAnswer: 2,
          explanation: 'Bill Smith, a senior engineer at Motorola, developed Six Sigma in 1986 and is called the Father of Six Sigma.',
          points: 10
        },
        {
          id: 'q3',
          type: 'true-false',
          question: 'Six Sigma relies on opinions and experience rather than data and statistical analysis.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Six Sigma is fundamentally a data-driven approach that prioritizes facts and statistical analysis over opinions.',
          points: 10
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'Which company is credited with bringing Six Sigma into mainstream business practice in the 1990s?',
          options: ['Toyota', 'General Electric', 'Ford', 'Samsung'],
          correctAnswer: 1,
          explanation: 'General Electric, under CEO Jack Welch, made Six Sigma central to their business strategy and demonstrated its financial benefits.',
          points: 10
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'What does DPMO stand for?',
          options: ['Defects Per Million Observations', 'Defects Per Million Opportunities', 'Data Points Measured Overall', 'Defined Process Measurement Objectives'],
          correctAnswer: 1,
          explanation: 'DPMO stands for Defects Per Million Opportunities, a metric used to measure process capability.',
          points: 10
        }
      ]
    }
  },
  {
    id: 'wb-terminology',
    title: 'Key Terminology & Concepts',
    description: 'Master the essential vocabulary and concepts used in Six Sigma.',
    beltLevel: 'white',
    order: 2,
    estimatedMinutes: 40,
    lessons: [
      {
        id: 'wb-term-1',
        title: 'Essential Six Sigma Terms',
        order: 1,
        estimatedMinutes: 20,
        content: `
<h2>Essential Six Sigma Terminology</h2>

<p>Understanding these key terms is fundamental to participating in Six Sigma projects.</p>

<h3>Process Terms</h3>

<dl>
  <dt><strong>Process</strong></dt>
  <dd>A series of steps or activities that transform inputs into outputs to deliver value to a customer.</dd>

  <dt><strong>Variation</strong></dt>
  <dd>The natural fluctuation in process outputs. Six Sigma aims to reduce unwanted variation.</dd>

  <dt><strong>Defect</strong></dt>
  <dd>Any instance where a product or service fails to meet customer requirements.</dd>

  <dt><strong>Opportunity</strong></dt>
  <dd>Any chance for a defect to occur in a process.</dd>
</dl>

<h3>Customer Terms</h3>

<dl>
  <dt><strong>VOC - Voice of the Customer</strong></dt>
  <dd>The process of capturing customer needs, expectations, and preferences through feedback and research.</dd>

  <dt><strong>CTQ - Critical to Quality</strong></dt>
  <dd>The key measurable characteristics of a product or service that must meet customer expectations.</dd>

  <dt><strong>Internal Customer</strong></dt>
  <dd>Anyone within your organization who receives output from your process.</dd>

  <dt><strong>External Customer</strong></dt>
  <dd>The end user or purchaser of your product or service.</dd>
</dl>

<h3>Quality Metrics</h3>

<dl>
  <dt><strong>DPMO - Defects Per Million Opportunities</strong></dt>
  <dd>A measure of process performance: (Number of Defects × 1,000,000) / (Number of Units × Opportunities per Unit)</dd>

  <dt><strong>Yield</strong></dt>
  <dd>The percentage of units that pass through a process without defects.</dd>

  <dt><strong>COPQ - Cost of Poor Quality</strong></dt>
  <dd>The total cost associated with poor quality, including scrap, rework, warranty claims, and lost customers.</dd>

  <dt><strong>Sigma Level</strong></dt>
  <dd>A measure of process capability based on the number of standard deviations between the process mean and specification limits.</dd>
</dl>
        `
      },
      {
        id: 'wb-term-2',
        title: 'DMAIC Framework Overview',
        order: 2,
        estimatedMinutes: 20,
        videoUrl: 'https://www.youtube.com/embed/lxxUXEVGJEE',
        videoTitle: 'DMAIC Process Explained - Six Sigma Project Methodology',
        content: `
<h2>The DMAIC Framework</h2>

<p><strong>DMAIC</strong> is the core problem-solving methodology used in Six Sigma projects. It provides a structured approach to identify and eliminate the root causes of problems.</p>

<h3>D - Define</h3>
<p><strong>Purpose:</strong> Clearly articulate the problem, goals, and scope of the project.</p>
<ul>
  <li>Identify the problem or opportunity</li>
  <li>Define project scope and boundaries</li>
  <li>Identify customers and their requirements (CTQs)</li>
  <li>Create a project charter</li>
  <li>Form the project team</li>
</ul>

<h3>M - Measure</h3>
<p><strong>Purpose:</strong> Understand the current state by collecting data on process performance.</p>
<ul>
  <li>Map the current process</li>
  <li>Identify what to measure</li>
  <li>Develop data collection plan</li>
  <li>Validate measurement system</li>
  <li>Establish baseline performance</li>
</ul>

<h3>A - Analyze</h3>
<p><strong>Purpose:</strong> Identify the root causes of the problem using data analysis.</p>
<ul>
  <li>Analyze process data</li>
  <li>Identify potential root causes</li>
  <li>Validate root causes with data</li>
  <li>Prioritize improvement opportunities</li>
</ul>

<h3>I - Improve</h3>
<p><strong>Purpose:</strong> Develop and implement solutions to address root causes.</p>
<ul>
  <li>Generate solution ideas</li>
  <li>Select the best solutions</li>
  <li>Pilot test solutions</li>
  <li>Implement improvements</li>
  <li>Validate results</li>
</ul>

<h3>C - Control</h3>
<p><strong>Purpose:</strong> Sustain the improvements and prevent regression.</p>
<ul>
  <li>Develop control plans</li>
  <li>Implement monitoring systems</li>
  <li>Document new procedures</li>
  <li>Transfer ownership to process owner</li>
  <li>Track ongoing performance</li>
</ul>

<div class="info-box">
  <h4>💡 Remember: DMAIC</h4>
  <p><strong>D</strong>efine → <strong>M</strong>easure → <strong>A</strong>nalyze → <strong>I</strong>mprove → <strong>C</strong>ontrol</p>
</div>
        `
      }
    ],
    quiz: {
      id: 'wb-term-quiz',
      title: 'Terminology & DMAIC Quiz',
      description: 'Test your knowledge of Six Sigma terminology.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What does CTQ stand for?',
          options: ['Cost to Quality', 'Critical to Quality', 'Commitment to Quality', 'Control the Quality'],
          correctAnswer: 1,
          explanation: 'CTQ stands for Critical to Quality - the key measurable characteristics that must meet customer expectations.',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'What does VOC stand for?',
          options: ['Value of Customer', 'Voice of Customer', 'Verification of Compliance', 'Variance of Cost'],
          correctAnswer: 1,
          explanation: 'VOC stands for Voice of Customer - the process of capturing customer needs and expectations.',
          points: 10
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'In which DMAIC phase would you identify root causes of a problem?',
          options: ['Define', 'Measure', 'Analyze', 'Improve'],
          correctAnswer: 2,
          explanation: 'The Analyze phase focuses on identifying and validating root causes using data analysis.',
          points: 10
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'What is COPQ?',
          options: ['Control of Process Quality', 'Cost of Poor Quality', 'Certification of Process Qualification', 'Customer-Oriented Process Query'],
          correctAnswer: 1,
          explanation: 'COPQ is Cost of Poor Quality - the total cost associated with defects including scrap, rework, and warranty claims.',
          points: 10
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'What is the purpose of the Control phase in DMAIC?',
          options: ['Define the problem', 'Collect baseline data', 'Find root causes', 'Sustain improvements'],
          correctAnswer: 3,
          explanation: 'The Control phase ensures improvements are sustained through monitoring, documentation, and control plans.',
          points: 10
        }
      ]
    }
  },
  {
    id: 'wb-roles',
    title: 'Six Sigma Roles & Belt Levels',
    description: 'Understand the different belt levels and roles in Six Sigma organizations.',
    beltLevel: 'white',
    order: 3,
    estimatedMinutes: 30,
    lessons: [
      {
        id: 'wb-roles-1',
        title: 'The Belt System',
        order: 1,
        estimatedMinutes: 15,
        videoUrl: 'https://www.youtube.com/embed/LLuT3k8i-Yk',
        videoTitle: 'How the Lean Six Sigma Belt System Works',
        content: `
<h2>The Six Sigma Belt System</h2>

<p>Six Sigma uses a belt ranking system, inspired by martial arts, to indicate different levels of expertise and responsibility.</p>

<h3>White Belt</h3>
<div class="belt-box white">
  <h4>⬜ White Belt</h4>
  <p><strong>Role:</strong> Team member and quality awareness</p>
  <ul>
    <li>Basic understanding of Six Sigma concepts</li>
    <li>Participates in process improvement teams</li>
    <li>Supports project data collection</li>
    <li>Understands the value of quality improvement</li>
  </ul>
  <p><strong>Training:</strong> 4-8 hours</p>
</div>

<h3>Yellow Belt</h3>
<div class="belt-box yellow">
  <h4>🟨 Yellow Belt</h4>
  <p><strong>Role:</strong> Project team member</p>
  <ul>
    <li>Works as a core team member on Six Sigma projects</li>
    <li>Understands DMAIC and basic quality tools</li>
    <li>May lead smaller improvement initiatives</li>
    <li>Supports Green/Black Belt projects</li>
  </ul>
  <p><strong>Training:</strong> 8-16 hours</p>
</div>

<h3>Green Belt</h3>
<div class="belt-box green">
  <h4>🟩 Green Belt</h4>
  <p><strong>Role:</strong> Part-time project leader</p>
  <ul>
    <li>Leads smaller-scale Six Sigma projects</li>
    <li>Uses statistical analysis tools</li>
    <li>Works within their functional area</li>
    <li>Typically spends 25-50% of time on projects</li>
  </ul>
  <p><strong>Training:</strong> 40-80 hours</p>
</div>

<h3>Black Belt</h3>
<div class="belt-box black">
  <h4>⬛ Black Belt</h4>
  <p><strong>Role:</strong> Full-time Six Sigma expert</p>
  <ul>
    <li>Leads complex, cross-functional projects</li>
    <li>Expert in statistical analysis and advanced tools</li>
    <li>Coaches and mentors Green Belts</li>
    <li>100% dedicated to Six Sigma projects</li>
  </ul>
  <p><strong>Training:</strong> 160+ hours + project completion</p>
</div>

<h3>Master Black Belt</h3>
<div class="belt-box master">
  <h4>👑 Master Black Belt</h4>
  <p><strong>Role:</strong> Strategic leader and teacher</p>
  <ul>
    <li>Trains and certifies other belts</li>
    <li>Develops deployment strategy</li>
    <li>Provides technical guidance on complex projects</li>
    <li>Drives organization-wide improvement culture</li>
  </ul>
  <p><strong>Training:</strong> Extensive experience + additional certification</p>
</div>
        `
      },
      {
        id: 'wb-roles-2',
        title: 'Your Role as a White Belt',
        order: 2,
        estimatedMinutes: 15,
        content: `
<h2>Your Role as a White Belt</h2>

<p>As a White Belt, you are an important part of the Six Sigma culture in your organization. Here's what is expected of you:</p>

<h3>Key Responsibilities</h3>

<h4>1. Awareness & Understanding</h4>
<ul>
  <li>Understand basic Six Sigma concepts and vocabulary</li>
  <li>Recognize the importance of quality and continuous improvement</li>
  <li>Know when a Six Sigma approach might help solve problems</li>
</ul>

<h4>2. Team Participation</h4>
<ul>
  <li>Actively participate when included in improvement projects</li>
  <li>Provide insights about your work area and processes</li>
  <li>Attend meetings and contribute ideas</li>
  <li>Support data collection efforts</li>
</ul>

<h4>3. Process Awareness</h4>
<ul>
  <li>Identify potential improvements in your daily work</li>
  <li>Report process issues and abnormalities</li>
  <li>Follow standardized procedures</li>
  <li>Suggest ideas for waste reduction</li>
</ul>

<h4>4. Continuous Learning</h4>
<ul>
  <li>Continue to learn Six Sigma concepts</li>
  <li>Consider advancing to Yellow or Green Belt</li>
  <li>Share knowledge with colleagues</li>
</ul>

<h3>What White Belts DO NOT Do</h3>
<ul>
  <li>Lead Six Sigma projects</li>
  <li>Perform complex statistical analysis</li>
  <li>Make final decisions on improvement strategies</li>
</ul>

<h3>Value You Bring</h3>
<p>White Belts are essential because:</p>
<ul>
  <li>You have direct process knowledge that experts may lack</li>
  <li>You can identify problems as they happen</li>
  <li>You help build a quality-focused culture</li>
  <li>You provide ground-level data and insights</li>
</ul>

<div class="info-box">
  <h4>💡 Next Steps</h4>
  <p>After completing White Belt, consider advancing to Yellow Belt to take on more active roles in improvement projects!</p>
</div>
        `
      }
    ],
    quiz: {
      id: 'wb-roles-quiz',
      title: 'Roles & Belt System Quiz',
      description: 'Test your understanding of Six Sigma roles.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Which belt level is typically dedicated 100% to Six Sigma projects?',
          options: ['Yellow Belt', 'Green Belt', 'Black Belt', 'White Belt'],
          correctAnswer: 2,
          explanation: 'Black Belts are typically full-time Six Sigma professionals, dedicating 100% of their time to improvement projects.',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'What is the primary role of a Master Black Belt?',
          options: ['Lead improvement projects', 'Collect data', 'Train and certify other belts', 'Attend team meetings'],
          correctAnswer: 2,
          explanation: 'Master Black Belts focus on training, certifying other belts, and developing organizational Six Sigma strategy.',
          points: 10
        },
        {
          id: 'q3',
          type: 'true-false',
          question: 'White Belts are expected to lead complex Six Sigma projects.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. White Belts participate as team members. Project leadership is the role of Green and Black Belts.',
          points: 10
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'How much time does a Green Belt typically spend on Six Sigma projects?',
          options: ['10-15%', '25-50%', '75-90%', '100%'],
          correctAnswer: 1,
          explanation: 'Green Belts typically spend 25-50% of their time on Six Sigma projects while maintaining their regular job duties.',
          points: 10
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'What value do White Belts bring to Six Sigma projects?',
          options: ['Statistical analysis', 'Project management', 'Direct process knowledge', 'Training other belts'],
          correctAnswer: 2,
          explanation: 'White Belts contribute valuable direct process knowledge and ground-level insights that experts may not have.',
          points: 10
        }
      ]
    }
  },
  {
    id: 'wb-tools',
    title: 'Basic Quality Tools',
    description: 'Introduction to fundamental quality improvement tools.',
    beltLevel: 'white',
    order: 4,
    estimatedMinutes: 45,
    lessons: [
      {
        id: 'wb-tools-1',
        title: 'The 7 Basic Quality Tools',
        order: 1,
        estimatedMinutes: 25,
        videoUrl: 'https://www.youtube.com/embed/rjofvGQfRBI',
        videoTitle: '7 Basic Quality Tools Explained',
        content: `
<h2>The 7 Basic Quality Tools</h2>

<p>These fundamental tools help teams identify, analyze, and solve quality problems. They are easy to learn and apply.</p>

<h3>1. Flowchart (Process Map)</h3>
<p><strong>Purpose:</strong> Visualize the steps in a process</p>
<ul>
  <li>Shows sequence of activities</li>
  <li>Identifies decision points</li>
  <li>Reveals bottlenecks and inefficiencies</li>
</ul>

<h3>2. Check Sheet</h3>
<p><strong>Purpose:</strong> Collect and organize data</p>
<ul>
  <li>Simple form for tallying occurrences</li>
  <li>Helps identify patterns</li>
  <li>Provides structured data collection</li>
</ul>

<h3>3. Histogram</h3>
<p><strong>Purpose:</strong> Show distribution of data</p>
<ul>
  <li>Displays frequency of values</li>
  <li>Reveals patterns and variation</li>
  <li>Compares data to specifications</li>
</ul>

<h3>4. Pareto Chart</h3>
<p><strong>Purpose:</strong> Prioritize problems or causes</p>
<ul>
  <li>Based on the 80/20 rule</li>
  <li>Shows "vital few" vs "trivial many"</li>
  <li>Helps focus improvement efforts</li>
</ul>

<h3>5. Cause-and-Effect Diagram (Fishbone)</h3>
<p><strong>Purpose:</strong> Identify potential root causes</p>
<ul>
  <li>Also called Ishikawa Diagram</li>
  <li>Organizes brainstorming</li>
  <li>Uses 6M categories: Man, Machine, Material, Method, Measurement, Mother Nature</li>
</ul>

<h3>6. Scatter Diagram</h3>
<p><strong>Purpose:</strong> Show relationship between variables</p>
<ul>
  <li>Identifies correlations</li>
  <li>Positive, negative, or no correlation</li>
  <li>Helps validate cause-and-effect theories</li>
</ul>

<h3>7. Control Chart</h3>
<p><strong>Purpose:</strong> Monitor process stability over time</p>
<ul>
  <li>Shows upper and lower control limits</li>
  <li>Distinguishes normal vs. special cause variation</li>
  <li>Signals when process needs attention</li>
</ul>
        `
      },
      {
        id: 'wb-tools-2',
        title: 'The 5 Whys Technique',
        order: 2,
        estimatedMinutes: 20,
        content: `
<h2>The 5 Whys Technique</h2>

<p>A simple but powerful method for finding the root cause of a problem by repeatedly asking "Why?"</p>

<h3>How It Works</h3>
<ol>
  <li>State the problem clearly</li>
  <li>Ask "Why did this happen?"</li>
  <li>Record the answer</li>
  <li>Ask "Why?" again for each answer</li>
  <li>Continue until you reach the root cause (typically 5 times)</li>
</ol>

<h3>Example: Machine Stopped</h3>
<table>
  <thead>
    <tr>
      <th>Question</th>
      <th>Answer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Problem:</strong> The machine stopped</td>
      <td></td>
    </tr>
    <tr>
      <td>Why #1: Why did the machine stop?</td>
      <td>The fuse blew due to overload</td>
    </tr>
    <tr>
      <td>Why #2: Why was there an overload?</td>
      <td>The bearing wasn't lubricated properly</td>
    </tr>
    <tr>
      <td>Why #3: Why wasn't it lubricated?</td>
      <td>The lubrication pump wasn't working</td>
    </tr>
    <tr>
      <td>Why #4: Why wasn't the pump working?</td>
      <td>The shaft was worn out</td>
    </tr>
    <tr>
      <td>Why #5: Why was the shaft worn?</td>
      <td>No regular maintenance schedule for the pump</td>
    </tr>
  </tbody>
</table>

<p><strong>Root Cause:</strong> Lack of preventive maintenance schedule</p>
<p><strong>Solution:</strong> Implement a regular maintenance schedule for pumps</p>

<h3>Tips for Effective 5 Whys</h3>
<ul>
  <li>Assemble a team with direct process knowledge</li>
  <li>Focus on the process, not on blaming people</li>
  <li>5 is a guideline, not a rule – you may need more or fewer</li>
  <li>Be specific in your answers</li>
  <li>Verify answers with data when possible</li>
</ul>

<div class="info-box">
  <h4>⚠️ Common Mistakes</h4>
  <ul>
    <li>Stopping too soon before reaching the true root cause</li>
    <li>Accepting symptoms as root causes</li>
    <li>Focusing on people instead of processes</li>
  </ul>
</div>
        `
      }
    ],
    quiz: {
      id: 'wb-tools-quiz',
      title: 'Basic Quality Tools Quiz',
      description: 'Test your knowledge of quality tools.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Which tool is also known as an Ishikawa or Fishbone diagram?',
          options: ['Pareto Chart', 'Cause-and-Effect Diagram', 'Histogram', 'Control Chart'],
          correctAnswer: 1,
          explanation: 'The Cause-and-Effect Diagram is also called Ishikawa (after its creator) or Fishbone (due to its shape).',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'The Pareto Chart is based on which principle?',
          options: ['50/50 rule', '80/20 rule', '90/10 rule', '70/30 rule'],
          correctAnswer: 1,
          explanation: 'The Pareto Chart is based on the 80/20 rule: roughly 80% of effects come from 20% of causes.',
          points: 10
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'What is the purpose of a Control Chart?',
          options: ['Collect data', 'Show cause-effect relationships', 'Monitor process stability over time', 'Visualize process steps'],
          correctAnswer: 2,
          explanation: 'Control Charts monitor process performance over time and distinguish normal variation from special causes.',
          points: 10
        },
        {
          id: 'q4',
          type: 'multiple-choice',
          question: 'In the "5 Whys" technique, what are you trying to find?',
          options: ['Five different problems', 'The root cause', 'Five solutions', 'Customer complaints'],
          correctAnswer: 1,
          explanation: 'The 5 Whys technique aims to find the root cause of a problem by repeatedly asking "Why?"',
          points: 10
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'Which tool would you use to show the relationship between two variables?',
          options: ['Check Sheet', 'Histogram', 'Scatter Diagram', 'Flowchart'],
          correctAnswer: 2,
          explanation: 'Scatter Diagrams show the relationship (correlation) between two variables.',
          points: 10
        }
      ]
    }
  },
  {
    id: 'wb-lean',
    title: 'Introduction to Lean',
    description: 'Learn how Lean principles complement Six Sigma methodology.',
    beltLevel: 'white',
    order: 5,
    estimatedMinutes: 35,
    lessons: [
      {
        id: 'wb-lean-1',
        title: 'What is Lean?',
        order: 1,
        estimatedMinutes: 20,
        videoUrl: 'https://www.youtube.com/embed/wfs-3LfLJQ4',
        videoTitle: 'Introduction to Lean Manufacturing',
        content: `
<h2>What is Lean?</h2>

<p>Lean is a methodology focused on <strong>maximizing customer value while minimizing waste</strong>. It originated from the Toyota Production System.</p>

<h3>Lean vs Six Sigma</h3>
<table>
  <thead>
    <tr>
      <th>Aspect</th>
      <th>Lean</th>
      <th>Six Sigma</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Focus</td>
      <td>Eliminating waste</td>
      <td>Reducing variation</td>
    </tr>
    <tr>
      <td>Goal</td>
      <td>Speed and efficiency</td>
      <td>Quality and consistency</td>
    </tr>
    <tr>
      <td>Origin</td>
      <td>Toyota (Japan)</td>
      <td>Motorola (USA)</td>
    </tr>
  </tbody>
</table>

<h3>Lean Six Sigma</h3>
<p>When combined, <strong>Lean Six Sigma</strong> provides a comprehensive approach that:</p>
<ul>
  <li>Eliminates waste (Lean)</li>
  <li>Reduces variation (Six Sigma)</li>
  <li>Delivers faster, higher-quality results</li>
</ul>

<h3>The 8 Types of Waste (DOWNTIME)</h3>
<p>Lean identifies 8 forms of waste to eliminate:</p>

<dl>
  <dt><strong>D - Defects</strong></dt>
  <dd>Products or services that don't meet requirements</dd>

  <dt><strong>O - Overproduction</strong></dt>
  <dd>Producing more than needed or before it's needed</dd>

  <dt><strong>W - Waiting</strong></dt>
  <dd>Idle time waiting for materials, information, or equipment</dd>

  <dt><strong>N - Non-utilized Talent</strong></dt>
  <dd>Not using people's skills, ideas, and creativity</dd>

  <dt><strong>T - Transportation</strong></dt>
  <dd>Unnecessary movement of materials or products</dd>

  <dt><strong>I - Inventory</strong></dt>
  <dd>Excess materials, work-in-progress, or finished goods</dd>

  <dt><strong>M - Motion</strong></dt>
  <dd>Unnecessary movement of people</dd>

  <dt><strong>E - Extra-processing</strong></dt>
  <dd>Doing more work than necessary to satisfy the customer</dd>
</dl>

<div class="info-box">
  <h4>💡 Memory Tip: DOWNTIME</h4>
  <p>Remember the 8 wastes by the acronym <strong>DOWNTIME</strong> – which is exactly what waste creates!</p>
</div>
        `
      },
      {
        id: 'wb-lean-2',
        title: '5S Workplace Organization',
        order: 2,
        estimatedMinutes: 15,
        content: `
<h2>5S: Workplace Organization</h2>

<p>5S is a Lean methodology for creating and maintaining an organized, clean, and efficient workplace.</p>

<h3>The 5S Steps</h3>

<h4>1. Sort (Seiri)</h4>
<p><strong>Keep only what you need</strong></p>
<ul>
  <li>Remove unnecessary items from the work area</li>
  <li>Red tag items for disposal or relocation</li>
  <li>Keep only tools and materials needed for daily work</li>
</ul>

<h4>2. Set in Order (Seiton)</h4>
<p><strong>A place for everything, everything in its place</strong></p>
<ul>
  <li>Arrange items for easy access</li>
  <li>Use labels and visual indicators</li>
  <li>Frequently used items should be closest</li>
</ul>

<h4>3. Shine (Seiso)</h4>
<p><strong>Clean and inspect</strong></p>
<ul>
  <li>Clean the work area thoroughly</li>
  <li>Identify and fix sources of dirt</li>
  <li>Make cleaning part of daily routine</li>
</ul>

<h4>4. Standardize (Seiketsu)</h4>
<p><strong>Create standards and procedures</strong></p>
<ul>
  <li>Document cleaning schedules</li>
  <li>Create visual standards</li>
  <li>Assign responsibilities</li>
</ul>

<h4>5. Sustain (Shitsuke)</h4>
<p><strong>Make it a habit</strong></p>
<ul>
  <li>Train employees</li>
  <li>Conduct regular audits</li>
  <li>Recognize and reward compliance</li>
</ul>

<h3>Benefits of 5S</h3>
<ul>
  <li>Improved safety</li>
  <li>Higher productivity</li>
  <li>Better quality</li>
  <li>Reduced waste</li>
  <li>Improved morale</li>
</ul>
        `
      }
    ],
    quiz: {
      id: 'wb-lean-quiz',
      title: 'Lean Basics Quiz',
      description: 'Test your knowledge of Lean principles.',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the primary focus of Lean methodology?',
          options: ['Reducing defects', 'Eliminating waste', 'Training employees', 'Increasing sales'],
          correctAnswer: 1,
          explanation: 'Lean focuses on eliminating waste while maximizing customer value.',
          points: 10
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'What does the "D" stand for in DOWNTIME waste acronym?',
          options: ['Delays', 'Defects', 'Documentation', 'Delivery'],
          correctAnswer: 1,
          explanation: 'D stands for Defects - products or services that don\'t meet requirements.',
          points: 10
        },
        {
          id: 'q3',
          type: 'multiple-choice',
          question: 'What is the second S in 5S methodology?',
          options: ['Shine', 'Sort', 'Set in Order', 'Sustain'],
          correctAnswer: 2,
          explanation: 'The 5S steps are: Sort, Set in Order, Shine, Standardize, Sustain.',
          points: 10
        },
        {
          id: 'q4',
          type: 'true-false',
          question: 'Lean Six Sigma combines waste elimination (Lean) with variation reduction (Six Sigma).',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'True. Lean Six Sigma combines the best of both methodologies for comprehensive improvement.',
          points: 10
        },
        {
          id: 'q5',
          type: 'multiple-choice',
          question: 'Which type of waste involves producing more than what is needed?',
          options: ['Overproduction', 'Inventory', 'Motion', 'Waiting'],
          correctAnswer: 0,
          explanation: 'Overproduction is producing more than needed or before it\'s needed.',
          points: 10
        }
      ]
    }
  }
];

// Final Certification Exam
export const whiteBeltFinalExam: Quiz = {
  id: 'wb-final-exam',
  title: 'White Belt Certification Exam',
  description: 'Complete this exam to earn your White Belt certification. You must score 70% or higher to pass.',
  passingScore: 70,
  timeLimit: 30,
  questions: [
    {
      id: 'final-1',
      type: 'multiple-choice',
      question: 'Six Sigma aims to achieve a defect rate of:',
      options: ['3.4 per hundred', '3.4 per thousand', '3.4 per million opportunities', '3.4 per billion'],
      correctAnswer: 2,
      explanation: 'Six Sigma targets 3.4 defects per million opportunities (DPMO).',
      points: 5
    },
    {
      id: 'final-2',
      type: 'multiple-choice',
      question: 'DMAIC stands for:',
      options: [
        'Define, Measure, Analyze, Improve, Control',
        'Design, Make, Analyze, Implement, Check',
        'Define, Monitor, Assess, Improve, Confirm',
        'Develop, Measure, Act, Improve, Complete'
      ],
      correctAnswer: 0,
      explanation: 'DMAIC: Define, Measure, Analyze, Improve, Control - the core Six Sigma methodology.',
      points: 5
    },
    {
      id: 'final-3',
      type: 'multiple-choice',
      question: 'Who developed Six Sigma at Motorola?',
      options: ['Jack Welch', 'Bill Smith', 'W. Edwards Deming', 'Taiichi Ohno'],
      correctAnswer: 1,
      explanation: 'Bill Smith, a senior engineer at Motorola, developed Six Sigma in 1986.',
      points: 5
    },
    {
      id: 'final-4',
      type: 'multiple-choice',
      question: 'CTQ stands for:',
      options: ['Cost to Quality', 'Critical to Quality', 'Commitment to Quality', 'Control the Quality'],
      correctAnswer: 1,
      explanation: 'CTQ means Critical to Quality - characteristics that must meet customer expectations.',
      points: 5
    },
    {
      id: 'final-5',
      type: 'true-false',
      question: 'White Belts are responsible for leading complex Six Sigma projects.',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'White Belts support projects as team members; Green and Black Belts lead projects.',
      points: 5
    },
    {
      id: 'final-6',
      type: 'multiple-choice',
      question: 'The Pareto Chart is based on the:',
      options: ['50/50 rule', '80/20 rule', '90/10 rule', '60/40 rule'],
      correctAnswer: 1,
      explanation: 'The Pareto principle states that roughly 80% of effects come from 20% of causes.',
      points: 5
    },
    {
      id: 'final-7',
      type: 'multiple-choice',
      question: 'What is COPQ?',
      options: ['Control of Process Quality', 'Cost of Poor Quality', 'Customer Oriented Process Query', 'Certification of Process Qualification'],
      correctAnswer: 1,
      explanation: 'COPQ is Cost of Poor Quality - costs from defects, rework, scrap, and warranty.',
      points: 5
    },
    {
      id: 'final-8',
      type: 'multiple-choice',
      question: 'In the 5 Whys technique, you are trying to find:',
      options: ['Five problems', 'The root cause', 'Five solutions', 'Customer requirements'],
      correctAnswer: 1,
      explanation: 'The 5 Whys helps identify the root cause by repeatedly asking "Why?"',
      points: 5
    },
    {
      id: 'final-9',
      type: 'multiple-choice',
      question: 'Which diagram is also called a Fishbone diagram?',
      options: ['Pareto Chart', 'Histogram', 'Cause-and-Effect Diagram', 'Control Chart'],
      correctAnswer: 2,
      explanation: 'The Cause-and-Effect (Ishikawa) Diagram is called Fishbone due to its shape.',
      points: 5
    },
    {
      id: 'final-10',
      type: 'multiple-choice',
      question: 'The DOWNTIME acronym in Lean represents:',
      options: ['Project phases', 'Belt levels', '8 types of waste', 'Quality metrics'],
      correctAnswer: 2,
      explanation: 'DOWNTIME = Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra-processing.',
      points: 5
    },
    {
      id: 'final-11',
      type: 'multiple-choice',
      question: 'Which belt level is dedicated 100% to Six Sigma work?',
      options: ['Yellow Belt', 'Green Belt', 'Black Belt', 'White Belt'],
      correctAnswer: 2,
      explanation: 'Black Belts work full-time on Six Sigma projects.',
      points: 5
    },
    {
      id: 'final-12',
      type: 'multiple-choice',
      question: 'VOC stands for:',
      options: ['Voice of Company', 'Voice of Customer', 'Value of Customer', 'Validation of Compliance'],
      correctAnswer: 1,
      explanation: 'VOC = Voice of Customer - capturing customer needs and expectations.',
      points: 5
    },
    {
      id: 'final-13',
      type: 'multiple-choice',
      question: 'What is the first step of the 5S methodology?',
      options: ['Shine', 'Set in Order', 'Sort', 'Standardize'],
      correctAnswer: 2,
      explanation: 'Sort is the first S - remove unnecessary items from the workspace.',
      points: 5
    },
    {
      id: 'final-14',
      type: 'true-false',
      question: 'Lean Six Sigma combines waste elimination with variation reduction.',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'True - Lean focuses on waste elimination, Six Sigma on reducing variation.',
      points: 5
    },
    {
      id: 'final-15',
      type: 'multiple-choice',
      question: 'In which DMAIC phase do you implement solutions?',
      options: ['Define', 'Measure', 'Analyze', 'Improve'],
      correctAnswer: 3,
      explanation: 'The Improve phase is where solutions are developed, tested, and implemented.',
      points: 5
    },
    {
      id: 'final-16',
      type: 'multiple-choice',
      question: 'A Master Black Belt primarily focuses on:',
      options: ['Data collection', 'Training and mentoring', 'Product design', 'Sales management'],
      correctAnswer: 1,
      explanation: 'Master Black Belts train other belts and develop organizational strategy.',
      points: 5
    },
    {
      id: 'final-17',
      type: 'multiple-choice',
      question: 'Which company popularized Six Sigma in the 1990s?',
      options: ['Toyota', 'General Electric', 'Ford', 'IBM'],
      correctAnswer: 1,
      explanation: 'GE under Jack Welch made Six Sigma famous and linked it to financial results.',
      points: 5
    },
    {
      id: 'final-18',
      type: 'multiple-choice',
      question: 'Control Charts are used to:',
      options: ['Collect data', 'Monitor process stability', 'Create flowcharts', 'Calculate costs'],
      correctAnswer: 1,
      explanation: 'Control Charts monitor process performance and identify when intervention is needed.',
      points: 5
    },
    {
      id: 'final-19',
      type: 'multiple-choice',
      question: 'What does the "W" in DOWNTIME waste stand for?',
      options: ['Work', 'Waste', 'Waiting', 'Walking'],
      correctAnswer: 2,
      explanation: 'W = Waiting - idle time waiting for materials, information, or equipment.',
      points: 5
    },
    {
      id: 'final-20',
      type: 'multiple-choice',
      question: 'As a White Belt, your primary contribution is:',
      options: ['Leading projects', 'Statistical analysis', 'Direct process knowledge', 'Training others'],
      correctAnswer: 2,
      explanation: 'White Belts contribute valuable ground-level process knowledge and insights.',
      points: 5
    }
  ]
};

// Helper function to get total lesson count
export function getWhiteBeltLessonCount(): number {
  return whiteBeltModules.reduce((total, module) => total + module.lessons.length, 0);
}

// Helper function to get total estimated time
export function getWhiteBeltTotalMinutes(): number {
  return whiteBeltModules.reduce((total, module) => total + module.estimatedMinutes, 0);
}
