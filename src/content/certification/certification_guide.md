# Six Sigma Certification Guide

## ASQ Certified Six Sigma Black Belt (CSSBB)

### Exam Overview

| Item | Details |
|------|---------|
| Questions | 165 (150 scored + 15 pretest) |
| Time | 4.5 hours |
| Format | Multiple choice |
| Passing | ~550/750 scale score |
| Cost | ASQ Member: $438, Non-member: $538 |

### Body of Knowledge (BoK) Sections

| Section | Weight | Topics |
|---------|--------|--------|
| Organization-wide Planning | 10% | Strategy, leadership, culture |
| Org Process Management | 10% | Process design, stakeholders |
| Team Management | 10% | Team dynamics, facilitation |
| Define | 10% | VOC, charter, baseline |
| Measure | 20% | Data collection, MSA, capability |
| Analyze | 20% | Hypothesis testing, regression |
| Improve | 10% | DOE, solution implementation |
| Control | 10% | SPC, control plans |

### Key Topics by Section

#### Measure (20%)

- Data types (continuous, discrete)
- Sampling methods
- Measurement System Analysis (MSA)
- Process capability (Cp, Cpk, Pp, Ppk)
- Descriptive statistics
- Probability distributions

#### Analyze (20%)

- Exploratory data analysis
- Hypothesis testing (t-tests, ANOVA, Chi-square)
- Regression and correlation
- Root cause analysis tools

### Study Resources

- ASQ BoK Handbook
- The Certified Six Sigma Black Belt Handbook
- Practice exams from ASQ
- Minitab practice

---

## IASSC Certified Lean Six Sigma Black Belt

### Exam Overview

| Item | Details |
|------|---------|
| Questions | 150 |
| Time | 4 hours |
| Format | Multiple choice |
| Passing | 580/875 (66.3%) |
| Cost | $395 |

### Content Distribution

| Phase | Weight |
|-------|--------|
| Define | 15% |
| Measure | 25% |
| Analyze | 25% |
| Improve | 25% |
| Control | 10% |

### Key Differences: ASQ vs IASSC

| ASQ | IASSC |
|-----|-------|
| Experience required (3+ years) | No experience required |
| Project required (2 projects) | No project required |
| More expensive | Less expensive |
| More recognized in US | Internationally recognized |
| Focuses on quality profession | Focuses on methodology |

---

## Exam Preparation Tips

### 30-Day Study Plan

| Week | Focus |
|------|-------|
| 1 | Define + Measure basics |
| 2 | Measure (MSA, Capability) + Analyze (Hypothesis) |
| 3 | Analyze (Regression, DOE) + Improve |
| 4 | Control + Practice exams |

### Formula Must-Knows

```
Mean: x̄ = Σx / n
Std Dev: s = √[Σ(x - x̄)² / (n-1)]
Cp: (USL - LSL) / 6σ
Cpk: min[(USL - μ)/3σ, (μ - LSL)/3σ]
DPMO: (Defects / Opportunities) × 1,000,000
Z-score: (x - μ) / σ
t-test: (x̄ - μ₀) / (s / √n)
```

### Common Exam Traps

1. **Cp vs Cpk** - Cpk accounts for centering, Cp doesn't
2. **α vs β error** - α = false positive, β = false negative
3. **σ vs s** - σ is population, s is sample
4. **Resolution III vs IV** - Know aliasing structures
5. **When to use which test** - Know the decision tree

### Test-Taking Strategies

- Read question carefully - what are they really asking?
- Eliminate obviously wrong answers
- Watch for "EXCEPT" and "NOT" in questions
- Flag difficult questions and return later
- Don't change answers unless certain

---

## Key Terms Glossary

### A

- **AIAG**: Automotive Industry Action Group
- **ANOVA**: Analysis of Variance
- **APQP**: Advanced Product Quality Planning
- **Attribute data**: Discrete, counted data

### B

- **Baseline**: Current performance level
- **Benchmarking**: Comparing to best practices
- **Box-Cox**: Transformation for normality

### C

- **CAPA**: Corrective and Preventive Action
- **Cp**: Process capability (potential)
- **Cpk**: Process capability (actual)
- **CTQ**: Critical to Quality
- **Cycle time**: Time to complete one unit

### D

- **DFSS**: Design for Six Sigma
- **DMAIC**: Define-Measure-Analyze-Improve-Control
- **DPMO**: Defects Per Million Opportunities
- **DPU**: Defects Per Unit

### E-F

- **Effect**: Change in output due to input
- **FMEA**: Failure Mode and Effects Analysis
- **F-test**: Compares variances

### G-H

- **Gage R&R**: Measurement system analysis
- **Histogram**: Frequency distribution chart
- **Hypothesis test**: Statistical decision method

### I-K

- **Interaction**: Combined effect of factors
- **Kano model**: Customer satisfaction categories
- **KPIV**: Key Process Input Variable
- **KPOV**: Key Process Output Variable

### L-M

- **LSL**: Lower Specification Limit
- **MSA**: Measurement System Analysis
- **Muda**: Waste (Japanese)

### N-P

- **Normal distribution**: Bell curve
- **Pareto chart**: 80/20 visualization
- **PDCA**: Plan-Do-Check-Act
- **PPAP**: Production Part Approval Process
- **p-value**: Probability of result if H₀ true

### Q-R

- **QFD**: Quality Function Deployment
- **R-squared**: Coefficient of determination
- **Regression**: Relationship between variables
- **RPN**: Risk Priority Number (FMEA)

### S

- **SIPOC**: Suppliers-Inputs-Process-Outputs-Customers
- **Six Sigma**: 3.4 DPMO quality level
- **SPC**: Statistical Process Control
- **SVHC**: Substances of Very High Concern

### T-U

- **Takt time**: Rate of customer demand
- **t-test**: Compares means
- **USL**: Upper Specification Limit

### V-Z

- **VOC**: Voice of the Customer
- **VSM**: Value Stream Mapping
- **Weibull**: Reliability distribution
- **Z-score**: Standard deviations from mean

---

## Practice Questions

### Question 1: Process Capability

A process has USL = 50, LSL = 30, mean = 38, and std dev = 3.
What is the Cpk?

**Answer:**

```
Cpu = (50 - 38) / (3 × 3) = 12/9 = 1.33
Cpl = (38 - 30) / (3 × 3) = 8/9 = 0.89
Cpk = min(1.33, 0.89) = 0.89
```

### Question 2: Sample Size

How many samples needed to detect a difference of 0.5 std dev with 80% power at α = 0.05?

**Answer:** Approximately 64 per group (use power analysis formula)

### Question 3: Hypothesis Test Selection

You want to compare defect rates between 3 suppliers. Which test?

**Answer:** Chi-square test (comparing proportions across groups)

### Question 4: Control Chart Selection

You have individual measurements of cycle time with no natural subgroups. Which control chart?

**Answer:** I-MR (Individuals and Moving Range) chart

### Question 5: DOE Resolution

A 2^(4-1) design with generator D=ABC has what resolution?

**Answer:** Resolution IV (main effects aliased with 3-way, 2-way aliased with 2-way)

---

## Certification Comparison Table

| Feature | ASQ CSSBB | IASSC BB | Council BB |
|---------|-----------|----------|------------|
| Experience Required | Yes (3 yr) | No | Yes (3 yr) |
| Project Required | Yes (2) | No | Yes (2) |
| Recertification | 3 years | 3 years | 3 years |
| Exam Questions | 165 | 150 | 100 |
| Exam Duration | 4.5 hr | 4 hr | 3 hr |
| Recognition | High (US) | High (Int'l) | Moderate |
| Cost | ~$500 | ~$400 | ~$350 |
