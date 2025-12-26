# Lean Six Sigma Integration

## The 8 Wastes (DOWNTIME / TIMWOOD)

### Memory Aid: DOWNTIME

| Letter | Waste | Description | Six Sigma Connection |
|--------|-------|-------------|---------------------|
| **D** | Defects | Errors requiring rework | DPMO, Cpk, FMEA |
| **O** | Overproduction | Making more than needed | Takt time, Kanban |
| **W** | Waiting | Idle time, delays | Cycle time analysis |
| **N** | Non-utilized talent | Underusing employee skills | VOC, Kaizen |
| **T** | Transportation | Unnecessary movement of materials | VSM, Spaghetti diagram |
| **I** | Inventory | Excess stock, WIP | Kanban, Pull systems |
| **M** | Motion | Unnecessary movement of people | 5S, Ergonomics |
| **E** | Extra processing | Doing more than required | CTQ, VOC alignment |

### Classic TIMWOOD Version

- **T**ransportation
- **I**nventory
- **M**otion
- **W**aiting
- **O**verproduction
- **O**ver-processing
- **D**efects

---

## 5S Methodology

### The 5 Steps

| Japanese | English | Action | Audit Questions |
|----------|---------|--------|-----------------|
| **Seiri** | Sort | Remove unnecessary items | Are all items needed? |
| **Seiton** | Set in Order | Organize remaining items | Can you find anything in 30 sec? |
| **Seiso** | Shine | Clean thoroughly | Is the area clean and maintained? |
| **Seiketsu** | Standardize | Create standards | Are procedures documented? |
| **Shitsuke** | Sustain | Maintain discipline | Are audits conducted regularly? |

### 5S Audit Scoring

```
Score each area 0-5:
0 = Not implemented
1 = Just started
2 = Partially implemented
3 = Fully implemented
4 = Improved beyond standard
5 = World class

Target: Average score ≥ 4
```

### 5S + Safety = 6S

Many organizations add:

- **Safety** as the first S
- Creates safer work environment before organizing

---

## Value Stream Mapping (VSM)

### Key Symbols

| Symbol | Meaning |
|--------|---------|
| ▢ | Process box |
| ▽ | Inventory/Queue |
| ⟶ | Material flow |
| ⟹ | Information flow |
| ◇ | Kaizen burst (improvement opportunity) |

### VSM Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Cycle Time (CT)** | Time to complete one unit | Minimize |
| **Takt Time** | Available time / Customer demand | Match CT to Takt |
| **Lead Time (LT)** | Total time start to finish | Minimize |
| **Process Time (PT)** | Value-added time only | Maximize % of LT |
| **% Value-Add** | PT / LT × 100% | > 25% is good |

### VSM Steps

1. **Select product family** - Group similar products
2. **Current state map** - Document AS-IS
3. **Calculate metrics** - Takt, CT, LT
4. **Identify waste** - Use Kaizen bursts
5. **Future state map** - Design TO-BE
6. **Implementation plan** - Prioritize improvements

---

## Kaizen Events

### Event Structure

| Phase | Duration | Activities |
|-------|----------|------------|
| **Prep** | 2-4 weeks | Scope, team, data collection |
| **Day 1** | 1 day | Training, current state, observation |
| **Day 2-3** | 2 days | Root cause, brainstorm solutions |
| **Day 4** | 1 day | Implement quick wins |
| **Day 5** | 1 day | Standardize, document, present |
| **Follow-up** | 30 days | Sustain changes, measure results |

### Kaizen vs DMAIC

| Kaizen | DMAIC |
|--------|-------|
| 3-5 day event | Weeks to months |
| Quick wins | Complex problems |
| Team-based | Black Belt led |
| Immediate action | Data-driven |
| Incremental improvement | Breakthrough improvement |

---

## Poka-Yoke (Error Proofing)

### Types of Poka-Yoke

| Type | Description | Example |
|------|-------------|---------|
| **Contact** | Physical shape prevents error | USB can only insert one way |
| **Fixed-value** | Correct quantity required | Kit with exactly right parts |
| **Motion-step** | Sequence enforced | Car won't start without brake pressed |

### Implementation Levels

```
Level 1: Detection (finds error after it occurs)
Level 2: Warning (alerts before error completes)
Level 3: Prevention (makes error impossible)

Goal: Move to Level 3 wherever possible
```

### Poka-Yoke Examples by Industry

| Industry | Application |
|----------|-------------|
| Manufacturing | Fixtures that only accept correct orientation |
| Healthcare | Color-coded connectors (oxygen vs air) |
| Software | Form validation, required fields |
| Aviation | Fuel nozzle size prevents wrong fuel |

---

## Kanban Systems

### Basic Rules

1. **Visualize workflow** - Make work visible
2. **Limit WIP** - Cap items in progress
3. **Manage flow** - Focus on throughput
4. **Make policies explicit** - Define done
5. **Implement feedback loops** - Regular reviews
6. **Improve collaboratively** - Team evolution

### Kanban Formulas

```
WIP Limit = Throughput × Lead Time (Little's Law)
Lead Time = WIP / Throughput
Throughput = WIP / Lead Time
```

### Two-Bin System

```
Bin 1 (Active): In use on line
Bin 2 (Reserve): Full, ready to swap

When Bin 1 empties:
1. Move Bin 2 to production
2. Send Bin 1 card to trigger replenishment
3. Replenishment fills Bin 1
```

---

## Quick Changeover (SMED)

### Single Minute Exchange of Die

Target: Changeover in < 10 minutes

### SMED Steps

1. **Observe** - Video current changeover
2. **Separate** - Internal vs External activities
3. **Convert** - Move internal to external where possible
4. **Streamline** - Reduce time for remaining internal
5. **Standardize** - Document new procedure

### Internal vs External

| Internal (machine stopped) | External (machine running) |
|---------------------------|---------------------------|
| Die removal | Tool preparation |
| Die installation | Next batch staging |
| Adjustments | Paperwork |
| First-piece inspection | Material transport |

---

## Standard Work

### Three Elements

1. **Takt Time** - Rate of customer demand
2. **Work Sequence** - Best order of operations
3. **Standard WIP** - Minimum inventory to maintain flow

### Standard Work Document

| Element | Content |
|---------|---------|
| Operation | Step-by-step instructions |
| Sequence | Order of steps |
| Time | Target time per step |
| Quality | Key quality checks |
| Safety | Safety reminders |
| Tools | Required equipment |

---

## Lean + Six Sigma Integration Points

| Lean Tool | Six Sigma Application |
|-----------|----------------------|
| 5S | Foundation for MSA, reduces measurement variation |
| VSM | Identify DMAIC project scope |
| Poka-Yoke | Control phase implementation |
| Kaizen | Quick wins during Improve phase |
| Standard Work | Control phase sustainability |
| Kanban | Reduce WIP variation, improve flow |
| SMED | Reduce variation in changeover time |

### When to Use Which

| Situation | Tool |
|-----------|------|
| Obvious waste, quick fix | Kaizen, 5S |
| Complex problem, unknown cause | DMAIC |
| Flow issues, high WIP | VSM, Kanban |
| High defect rate | DMAIC + Poka-Yoke |
| Long changeover | SMED |
| Variation in work methods | Standard Work |
