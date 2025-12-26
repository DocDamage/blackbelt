# Black Belt Equation Sheet

## Descriptive Statistics

### Central Tendency

| Measure | Formula | Excel | Minitab |
|---------|---------|-------|---------|
| Mean (x̄) | x̄ = Σxᵢ / n | `=AVERAGE(range)` | Stat > Basic Statistics > Display Descriptive Statistics |
| Median | Middle value when sorted | `=MEDIAN(range)` | Included in descriptive stats |
| Mode | Most frequent value | `=MODE(range)` | Stat > Tables > Tally |

### Variation

| Measure | Formula | Excel | Minitab |
|---------|---------|-------|---------|
| Range | R = Max - Min | `=MAX(range)-MIN(range)` | Included in descriptive stats |
| Variance (s²) | s² = Σ(xᵢ - x̄)² / (n-1) | `=VAR.S(range)` | Included in descriptive stats |
| Std Dev (s) | s = √[Σ(xᵢ - x̄)² / (n-1)] | `=STDEV.S(range)` | Included in descriptive stats |
| Coefficient of Variation | CV = (s / x̄) × 100% | `=STDEV.S(range)/AVERAGE(range)*100` | Calculate manually |

---

## Process Capability

### Capability Indices

| Index | Formula | Interpretation |
|-------|---------|----------------|
| Cp | Cp = (USL - LSL) / 6σ | Process potential (spread only) |
| Cpk | Cpk = min[(USL - μ) / 3σ, (μ - LSL) / 3σ] | Process performance (considers centering) |
| Pp | Pp = (USL - LSL) / 6s | Long-term potential |
| Ppk | Ppk = min[(USL - μ) / 3s, (μ - LSL) / 3s] | Long-term performance |
| Cpm | Cpm = Cp / √[1 + ((μ - T)/σ)²] | Taguchi capability (includes target) |

### Sigma Level Conversion

| Sigma Level | DPMO | Cpk (approx) | Yield % |
|-------------|------|--------------|---------|
| 2σ | 308,537 | 0.67 | 69.15% |
| 3σ | 66,807 | 1.00 | 93.32% |
| 4σ | 6,210 | 1.33 | 99.38% |
| 5σ | 233 | 1.67 | 99.977% |
| 6σ | 3.4 | 2.00 | 99.99966% |

### Defects Calculations

| Metric | Formula |
|--------|---------|
| DPU (Defects Per Unit) | DPU = Total Defects / Total Units |
| DPO (Defects Per Opportunity) | DPO = Defects / (Units × Opportunities) |
| DPMO | DPMO = DPO × 1,000,000 |
| Yield | Y = e^(-DPU) or Y = 1 - DPO |
| RTY (Rolled Throughput Yield) | RTY = Y₁ × Y₂ × Y₃ × ... × Yₙ |

---

## Hypothesis Testing

### Z-Test (σ known)

```
Z = (x̄ - μ₀) / (σ / √n)
```

- Use when population σ is known
- n > 30 typically

### T-Test (σ unknown)

```
t = (x̄ - μ₀) / (s / √n)
df = n - 1
```

### Two-Sample T-Test

```
t = (x̄₁ - x̄₂) / √[s²pooled × (1/n₁ + 1/n₂)]
s²pooled = [(n₁-1)s₁² + (n₂-1)s₂²] / (n₁ + n₂ - 2)
df = n₁ + n₂ - 2
```

### Paired T-Test

```
t = d̄ / (sd / √n)
d = difference of paired values
df = n - 1
```

### F-Test (Variance Ratio)

```
F = s₁² / s₂² (larger variance on top)
df₁ = n₁ - 1, df₂ = n₂ - 1
```

### Chi-Square Test

```
χ² = Σ[(O - E)² / E]
E = (Row Total × Column Total) / Grand Total
df = (rows - 1) × (columns - 1)
```

---

## Confidence Intervals

### Mean (σ known)

```
CI = x̄ ± Z(α/2) × (σ / √n)
```

### Mean (σ unknown)

```
CI = x̄ ± t(α/2, n-1) × (s / √n)
```

### Proportion

```
CI = p̂ ± Z(α/2) × √[p̂(1-p̂) / n]
```

### Sample Size for Mean

```
n = (Z(α/2) × σ / E)²
E = margin of error
```

### Sample Size for Proportion

```
n = p̂(1-p̂) × (Z(α/2) / E)²
Use p̂ = 0.5 for maximum sample size
```

---

## Regression Analysis

### Simple Linear Regression

```
ŷ = b₀ + b₁x

b₁ = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²
b₀ = ȳ - b₁x̄
```

### Correlation Coefficient

```
r = Σ(xᵢ - x̄)(yᵢ - ȳ) / √[Σ(xᵢ - x̄)² × Σ(yᵢ - ȳ)²]

R² = r² (coefficient of determination)
R² = SSR / SST = 1 - (SSE / SST)
```

### ANOVA Table Components

| Source | SS | df | MS | F |
|--------|----|----|----|----|
| Regression | SSR = Σ(ŷᵢ - ȳ)² | k | MSR = SSR/k | MSR/MSE |
| Error | SSE = Σ(yᵢ - ŷᵢ)² | n-k-1 | MSE = SSE/(n-k-1) | |
| Total | SST = Σ(yᵢ - ȳ)² | n-1 | | |

### Standard Error of Estimate

```
Se = √[SSE / (n-2)] = √MSE
```

### T-Test for Coefficients

```
t = bⱼ / SE(bⱼ)
df = n - k - 1

If |t| > t(α/2, df): coefficient is significant
If p-value < α: coefficient is significant
```

---

## Design of Experiments (DOE)

### Effect Calculations (2-Level Factorial)

```
Main Effect A = (Avg at A+) - (Avg at A-)
Interaction AB = ½[(Effect of A at B+) - (Effect of A at B-)]
```

### Coded Variables

```
x_coded = (x_actual - x_center) / (x_range / 2)
```

### Resolution Definitions

| Resolution | Meaning | Aliasing |
|------------|---------|----------|
| III | Main effects aliased with 2-factor interactions | A = BC |
| IV | Main effects clear; 2FI aliased with other 2FI | AB = CD |
| V | Main effects and 2FI clear | ABC = DE |
| Full | No aliasing | All effects estimable |

### ANOVA for DOE

```
SS_Factor = n × (Effect/2)²
df = levels - 1 (for each factor)
F = MS_Factor / MS_Error
```

---

## Control Charts

### X-bar Chart

```
UCL = X̿ + A₂R̄
CL = X̿
LCL = X̿ - A₂R̄
```

### R Chart

```
UCL = D₄R̄
CL = R̄
LCL = D₃R̄
```

### Individuals (I-MR) Chart

```
UCL = X̄ + 2.66 × MR̄
CL = X̄
LCL = X̄ - 2.66 × MR̄
```

### p-Chart (Proportion Defective)

```
UCL = p̄ + 3√[p̄(1-p̄)/n]
CL = p̄
LCL = p̄ - 3√[p̄(1-p̄)/n]
```

### np-Chart (Count of Defectives)

```
UCL = np̄ + 3√[np̄(1-p̄)]
CL = np̄
LCL = np̄ - 3√[np̄(1-p̄)]
```

### c-Chart (Defects per Unit)

```
UCL = c̄ + 3√c̄
CL = c̄
LCL = c̄ - 3√c̄
```

### u-Chart (Defects per Unit, Variable Sample)

```
UCL = ū + 3√(ū/n)
CL = ū
LCL = ū - 3√(ū/n)
```

---

## MSA (Measurement System Analysis)

### Gage R&R

```
Total Variation = √(Part² + Gage R&R²)
Gage R&R = √(Repeatability² + Reproducibility²)

%GRR = (Gage R&R / Total Variation) × 100%
```

### Acceptance Criteria

| %GRR | Assessment |
|------|------------|
| < 10% | Excellent |
| 10-30% | Acceptable (may be OK depending on application) |
| > 30% | Unacceptable |

### Number of Distinct Categories (ndc)

```
ndc = 1.41 × (Part Variation / Gage R&R)
Should be ≥ 5 for adequate discrimination
```

---

## Quick Reference: Critical Values

### Z-Values (Standard Normal)

| α | One-tail | Two-tail |
|---|----------|----------|
| 0.10 | 1.28 | 1.645 |
| 0.05 | 1.645 | 1.96 |
| 0.01 | 2.33 | 2.576 |

### Control Chart Constants (Common Subgroup Sizes)

| n | A₂ | D₃ | D₄ | d₂ |
|---|-----|-----|-----|-----|
| 2 | 1.880 | 0 | 3.267 | 1.128 |
| 3 | 1.023 | 0 | 2.574 | 1.693 |
| 4 | 0.729 | 0 | 2.282 | 2.059 |
| 5 | 0.577 | 0 | 2.114 | 2.326 |
| 6 | 0.483 | 0 | 2.004 | 2.534 |

---

## Memory Aids

### DMAIC Phase Focus

- **Define**: VOC, CTQ, Charter, SIPOC
- **Measure**: Data collection, MSA, Baseline σ
- **Analyze**: Hypothesis tests, Regression, DOE
- **Improve**: Pilots, Optimization, Solutions
- **Control**: SPC, Control Plans, Handoff

### Hypothesis Test Selection

| Comparing | Data Type | Test |
|-----------|-----------|------|
| 1 mean to target | Continuous | 1-sample t |
| 2 independent means | Continuous | 2-sample t |
| 2 paired means | Continuous | Paired t |
| 2+ means | Continuous | ANOVA |
| 2 variances | Continuous | F-test |
| 2+ variances | Continuous | Bartlett's / Levene's |
| 1 proportion to target | Discrete | 1-proportion Z |
| 2 proportions | Discrete | 2-proportion Z |
| Categories | Counts | Chi-square |
