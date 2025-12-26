# Project Templates

## SIPOC Diagram

### What is SIPOC?

A high-level process map identifying key elements before diving into details.

| Letter | Meaning | Questions to Ask |
|--------|---------|------------------|
| **S** | Suppliers | Who provides inputs? |
| **I** | Inputs | What materials/info enters? |
| **P** | Process | What are the major steps (5-7)? |
| **O** | Outputs | What is produced? |
| **C** | Customers | Who receives outputs? |

### SIPOC Template

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  SUPPLIERS  │   INPUTS    │   PROCESS   │   OUTPUTS   │  CUSTOMERS  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Vendor A    │ Raw material│ 1. Receive  │ Finished    │ End user    │
│ IT Dept     │ Specs       │ 2. Inspect  │   product   │ Retailer    │
│ Customer    │ Order info  │ 3. Process  │ Documentation│ Warehouse  │
│             │             │ 4. Test     │ Shipping docs│            │
│             │             │ 5. Package  │             │             │
│             │             │ 6. Ship     │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### When to Use SIPOC

- DMAIC Define phase
- Before detailed process mapping
- Project scoping
- New team member orientation

---

## Project Charter Template

### Charter Elements

| Section | Content | Example |
|---------|---------|---------|
| **Project Name** | Clear, descriptive title | "Reduce Order Processing Time" |
| **Problem Statement** | What, When, Where, Magnitude | "Order processing takes 5 days vs target of 2" |
| **Goal Statement** | SMART objective | "Reduce to 2 days by Q3 2024" |
| **Business Case** | Why this matters | "$500K annual savings expected" |
| **Scope** | In-scope/Out-of-scope | "Online orders only, excludes phone orders" |
| **Team** | Roles and names | Champion, BB, team members |
| **Timeline** | Phase dates | Define: Jan, Measure: Feb, etc. |
| **Metrics** | Primary and secondary | Primary: Days to ship, Secondary: Cost |

### Problem Statement Formula

```
[What is wrong] + [When it was observed] + [Where it occurs] + [Magnitude of impact]

Example:
"Customer complaints about late deliveries (what) have increased 35% over the past 6 months (when) 
in the Northeast region (where), resulting in $200K in credits and 15% customer churn (magnitude)."
```

### Goal Statement Formula (SMART)

```
[Improve/Reduce metric] from [baseline] to [target] by [date]

Example:
"Reduce order processing time from 5 days to 2 days by September 30, 2024"
```

---

## FMEA Template (Failure Mode and Effects Analysis)

### FMEA Scale Definitions

#### Severity (S) - 1 to 10

| Score | Effect | Criteria |
|-------|--------|----------|
| 1 | None | No effect |
| 2-3 | Minor | Slight inconvenience |
| 4-6 | Moderate | Customer dissatisfied |
| 7-8 | High | Inoperable, customer very dissatisfied |
| 9-10 | Critical | Safety/regulatory issue |

#### Occurrence (O) - 1 to 10

| Score | Likelihood | Failure Rate |
|-------|------------|--------------|
| 1 | Remote | < 1 in 1,000,000 |
| 2-3 | Low | 1 in 20,000 |
| 4-6 | Moderate | 1 in 2,000 |
| 7-8 | High | 1 in 100 |
| 9-10 | Very High | > 1 in 10 |

#### Detection (D) - 1 to 10

| Score | Ability | Method |
|-------|---------|--------|
| 1 | Almost certain | Automatic 100% inspection |
| 2-3 | High | Statistical process control |
| 4-6 | Moderate | Manual inspection |
| 7-8 | Low | Random inspection |
| 9-10 | Almost impossible | No inspection |

### RPN Calculation

```
RPN = Severity × Occurrence × Detection
Range: 1 to 1,000
Action threshold: Typically RPN > 100 or S ≥ 9
```

### FMEA Worksheet

| Process Step | Failure Mode | Effect | S | Cause | O | Controls | D | RPN | Action |
|-------------|--------------|--------|---|-------|---|----------|---|-----|--------|
| Assembly | Missing screw | Part falls off | 7 | Forgot step | 4 | Visual check | 6 | 168 | Add poka-yoke |
| Welding | Incomplete weld | Joint failure | 9 | Worn tip | 3 | X-ray sample | 4 | 108 | PM schedule |

---

## Control Plan Template

### Control Plan Elements

| Column | Description |
|--------|-------------|
| Process Step | Operation name |
| CTQ | Characteristic being controlled |
| Specification | LSL, Target, USL |
| Measurement | Gauge or method |
| Sample Size | How many to check |
| Frequency | How often |
| Control Method | SPC, checklist, etc. |
| Reaction Plan | What to do if OOC |
| Responsible | Who owns it |

### Sample Control Plan

| Step | CTQ | Spec | Measure | Size | Freq | Method | Reaction | Owner |
|------|-----|------|---------|------|------|--------|----------|-------|
| Molding | Dimension A | 10 ± 0.5 mm | Caliper | 5 | Hourly | X-bar R | Stop, adjust, recheck | Operator |
| Welding | Strength | > 500 N | Pull test | 3 | Per lot | Attribute | Quarantine, root cause | QC |
| Packaging | Count | 12 ± 0 | Manual | 100% | Each | Visual | Recount, log | Packer |

---

## A3 Problem Solving Template

### A3 Sections (One Page)

```
┌────────────────────────────────────────────────────────────────┐
│ Title: [Problem Name]                     Date:                │
├──────────────────────────────┬─────────────────────────────────┤
│ 1. BACKGROUND                │ 5. COUNTERMEASURES              │
│ - Why is this important?     │ - What will we do?              │
│ - Business context           │ - Action items                  │
├──────────────────────────────┼─────────────────────────────────┤
│ 2. CURRENT CONDITION         │ 6. IMPLEMENTATION PLAN          │
│ - What is happening now?     │ - Who, What, When               │
│ - Data/metrics               │ - Milestones                    │
├──────────────────────────────┼─────────────────────────────────┤
│ 3. GOAL/TARGET               │ 7. FOLLOW-UP                    │
│ - What should be happening?  │ - How will we check?            │
│ - Specific, measurable       │ - Next review date              │
├──────────────────────────────┼─────────────────────────────────┤
│ 4. ROOT CAUSE ANALYSIS       │ 8. RESULTS                      │
│ - Why is it happening?       │ - Before/After comparison       │
│ - 5 Whys, Fishbone          │ - Lessons learned               │
└──────────────────────────────┴─────────────────────────────────┘
```

---

## VOC (Voice of Customer) Matrix

### VOC Collection Methods

| Method | Best For | Sample Size |
|--------|----------|-------------|
| Surveys | Quantitative data | Large (n > 100) |
| Interviews | Deep understanding | Small (10-30) |
| Focus Groups | Exploring ideas | 6-10 per group |
| Observation | Actual behavior | Varies |
| Complaints | Pain points | All available |
| Social Media | Unfiltered feedback | Ongoing |

### VOC to CTQ Translation

```
VOC (Customer language)           CTQ (Measureable)
"Fast delivery"          →        Order to ship ≤ 24 hours
"Quality product"        →        Defect rate < 100 DPMO
"Easy to use"           →        Setup time < 5 minutes
"Good value"            →        Price competitive ± 5%
```

### Kano Model Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Must-Be** | Expected, dissatisfied if missing | Car has brakes |
| **One-Dimensional** | More is better, linear satisfaction | MPG, speed |
| **Delighter** | Unexpected, creates excitement | Heated seats |
| **Indifferent** | No impact on satisfaction | Color of engine |
| **Reverse** | Causes dissatisfaction if present | Unwanted features |

---

## Tollgate Checklist

### Define Tollgate

- [ ] Project charter complete and approved
- [ ] SIPOC diagram complete
- [ ] Problem statement specific and measurable
- [ ] Goal statement SMART
- [ ] Team identified and roles clear
- [ ] Scope defined (in/out of scope)
- [ ] Champion sign-off obtained

### Measure Tollgate

- [ ] Data collection plan complete
- [ ] MSA conducted, measurement system adequate
- [ ] Baseline data collected
- [ ] Process capability (Cpk) calculated
- [ ] Process maps complete
- [ ] Quick wins identified
- [ ] Stakeholder update provided

### Analyze Tollgate

- [ ] Root causes identified and validated
- [ ] Statistical analysis complete
- [ ] Key inputs (Xs) identified
- [ ] FMEA updated
- [ ] Improvement priorities set
- [ ] No root cause assumed without data

### Improve Tollgate

- [ ] Solutions developed for root causes
- [ ] Pilot conducted
- [ ] Results validated with data
- [ ] Risk assessment complete
- [ ] Implementation plan ready
- [ ] Stakeholder buy-in obtained

### Control Tollgate

- [ ] Control plan complete
- [ ] Process monitoring in place
- [ ] Training completed
- [ ] Documentation updated
- [ ] Ownership transferred
- [ ] Benefits validated
- [ ] Project closed and lessons shared
