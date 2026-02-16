/**
 * Six Sigma Tools Knowledge Base
 * 
 * Comprehensive coverage of Six Sigma tools and techniques.
 */

import { KnowledgeEntry } from './ComprehensiveKnowledgeBase';

export const sixSigmaToolsKnowledge: KnowledgeEntry[] = [
  // Process Mapping Tools
  {
    id: 'tool-1',
    category: 'Tools',
    topic: 'Process Flowchart',
    content: `A Process Flowchart visually represents process steps and decision points.

**Standard Symbols:**
- Oval: Start/End (Terminator)
- Rectangle: Process step (Action)
- Diamond: Decision (Yes/No branches)
- Parallelogram: Input/Output (Data)
- Arrow: Flow direction
- Document: Record or report

**Types:**
- **Top-Down:** High-level, 5-7 steps
- **Deployment (Swimlane):** Shows who does what
- **Detailed:** 20+ steps with decisions

**How to Create:**
1. Define process boundaries (start/end)
2. List all steps in order
3. Identify decision points
4. Map handoffs between people/departments
5. Add time and quality data
6. Validate with process participants

**Uses:**
- Understand current process
- Identify waste and bottlenecks
- Train new employees
- Document standard work
- Identify improvement opportunities`,
    relatedTopics: ['SIPOC', 'Value Stream Map', 'Process Mapping'],
    keywords: ['flowchart', 'process map', 'flow diagram', 'swimlane', 'deployment', 'symbols', 'terminator', 'decision'],
    beltLevel: 'Yellow'
  },
  {
    id: 'tool-2',
    category: 'Tools',
    topic: 'Value Stream Map (VSM)',
    content: `VSM shows material and information flow from raw materials to customer.

**Key Metrics:**
- **Cycle Time (CT):** Time to complete one unit at a process step
- **Lead Time (LT):** Total time from order to delivery
- **Takt Time:** Available time / Customer demand (pace of production)
- **Process Time (PT):** Value-added time only
- **PercentC&A:** Quality at each step
- **Work in Process (WIP):** Units between steps

**Data Box Contents:**
- C/T: Cycle time
- C/O: Changeover time
- Uptime: Availability
- Shifts: Number of shifts
- PercentC&A: Quality rate
- Operators: Number of people

**Steps:**
1. Select product family
2. Map current state (walk the process)
3. Calculate metrics (LT, VA, NVA)
4. Identify waste
5. Design future state
6. Create implementation plan`,
    relatedTopics: ['Flowchart', 'Lean', 'Cycle Time', 'Lead Time', 'Takt Time'],
    keywords: ['value stream map', 'vsm', 'lead time', 'cycle time', 'takt time', 'current state', 'future state'],
    beltLevel: 'Green'
  },
  {
    id: 'tool-3',
    category: 'Tools',
    topic: 'Pareto Chart',
    content: `A Pareto Chart identifies the vital few from the trivial many based on the 80/20 rule.

**Structure:**
- Bars: Frequency or impact (sorted descending)
- Line: Cumulative percentage

**The 80/20 Rule:**
- 80% of problems come from 20% of causes
- 80% of sales come from 20% of customers
- Focus on the vital few for maximum impact

**How to Create:**
1. List categories of defects/issues
2. Count frequency for each
3. Sort from highest to lowest
4. Calculate cumulative percentage
5. Draw bars and cumulative line

**Applications:**
- Defect analysis
- Customer complaints
- Downtime causes
- Inventory items
- Sales by product`,
    relatedTopics: ['80/20 Rule', 'Prioritization', 'Analyze Phase'],
    keywords: ['pareto', '80/20', 'pareto chart', 'vital few', 'trivial many', 'prioritization', 'cumulative', 'frequency'],
    beltLevel: 'Yellow'
  },
  {
    id: 'tool-4',
    category: 'Tools',
    topic: '5S Workplace Organization',
    content: `5S creates a clean, organized, efficient workplace.

**The 5 Ss:**

**1. Sort (Seiri)** - Keep only what you need
- Remove unnecessary items
- Red tag questionable items
- Decision: Keep, Relocate, Dispose

**2. Set in Order (Seiton)** - A place for everything
- Assign specific locations
- Use labels, color coding
- Most-used items closest

**3. Shine (Seiso)** - Clean and inspect
- Clean work area thoroughly
- Inspect while cleaning
- Make cleaning routine

**4. Standardize (Seiketsu)** - Make it routine
- Create standards and procedures
- Use visual management
- Checklists and schedules

**5. Sustain (Shitsuke)** - Maintain discipline
- Training and communication
- Audits and recognition
- Management commitment

**Benefits:**
- Reduced waste
- Improved safety
- Higher quality
- Faster setup times
- Better morale`,
    relatedTopics: ['8 Wastes', 'Visual Management', 'Standard Work'],
    keywords: ['5s', '6s', 'sort', 'set in order', 'shine', 'standardize', 'sustain', 'safety', 'workplace organization'],
    beltLevel: 'Yellow'
  },
  {
    id: 'tool-5',
    category: 'Tools',
    topic: 'Poka-Yoke (Mistake-Proofing)',
    content: `Poka-Yoke prevents errors or makes them immediately obvious.

**Levels:**
1. **Elimination:** Design error out completely
2. **Prevention:** Physical barriers prevent error
3. **Detection:** Error detected immediately

**Types:**
- **Contact Method:** Shape prevents wrong part
- **Fixed-Value Method:** Specific number required
- **Motion-Step Method:** Sequence enforced

**Examples:**
- USB-C connector (reversible)
- Car door open warning
- SIM card tray shape
- Torque-limiting wrenches
- Dropdown lists (not free text)

**Benefits:**
- 100% inspection at source
- Reduced defects
- Lower inspection costs
- Less rework
- Safer operations`,
    relatedTopics: ['Error Proofing', 'Prevention', 'Quality at Source', 'Jidoka'],
    keywords: ['poka-yoke', 'mistake proofing', 'error proofing', 'prevention', 'detection', 'quality at source'],
    beltLevel: 'Green'
  }
];

export default sixSigmaToolsKnowledge;
