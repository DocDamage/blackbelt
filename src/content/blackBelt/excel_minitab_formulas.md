# Excel & Minitab Formula Reference

## Quick Copy-Paste Formulas for Six Sigma Calculations

---

## Descriptive Statistics

### Excel Formulas

```excel
=== CENTRAL TENDENCY ===
Mean:           =AVERAGE(A1:A100)
Median:         =MEDIAN(A1:A100)
Mode:           =MODE.SNGL(A1:A100)
Geometric Mean: =GEOMEAN(A1:A100)

=== VARIATION ===
Sample Std Dev:     =STDEV.S(A1:A100)
Population Std Dev: =STDEV.P(A1:A100)
Sample Variance:    =VAR.S(A1:A100)
Population Variance:=VAR.P(A1:A100)
Range:              =MAX(A1:A100)-MIN(A1:A100)
IQR:                =QUARTILE(A1:A100,3)-QUARTILE(A1:A100,1)
CV%:                =STDEV.S(A1:A100)/AVERAGE(A1:A100)*100

=== COUNTS ===
Count (numbers):    =COUNT(A1:A100)
Count (non-blank):  =COUNTA(A1:A100)
Count (blank):      =COUNTBLANK(A1:A100)
Count IF:           =COUNTIF(A1:A100,">10")
```

### Minitab Commands

```
Stat > Basic Statistics > Display Descriptive Statistics
- Select column(s)
- Statistics: Check all desired statistics
```

---

## Process Capability

### Excel Formulas

```excel
=== CAPABILITY INDICES ===
Cp:     =(USL-LSL)/(6*STDEV.S(data))
Cpu:    =(USL-AVERAGE(data))/(3*STDEV.S(data))
Cpl:    =(AVERAGE(data)-LSL)/(3*STDEV.S(data))
Cpk:    =MIN(Cpu,Cpl)

=== WITH CELL REFERENCES ===
Example: USL in B1, LSL in B2, Data in A1:A100

Cp:     =(B1-B2)/(6*STDEV.S(A1:A100))
Cpk:    =MIN((B1-AVERAGE(A1:A100))/(3*STDEV.S(A1:A100)),
             (AVERAGE(A1:A100)-B2)/(3*STDEV.S(A1:A100)))

=== SIGMA LEVEL ===
Z-score (upper): =(USL-Mean)/StdDev
Z-score (lower): =(Mean-LSL)/StdDev
Sigma Level:     =MIN(Z_upper, Z_lower) + 1.5  (with 1.5σ shift)

=== DEFECTS ===
DPU:    =Total_Defects/Total_Units
DPO:    =Total_Defects/(Total_Units*Opportunities_Per_Unit)
DPMO:   =DPO*1000000
Yield:  =EXP(-DPU)
```

### Minitab Commands

```
Stat > Quality Tools > Capability Analysis > Normal
- Single column: Select data
- Subgroup size: Enter value or column
- Lower spec: Enter LSL
- Upper spec: Enter USL
- Target (optional): Enter target value
```

---

## Hypothesis Testing

### Excel Formulas for T-Tests

```excel
=== ONE-SAMPLE T-TEST ===
t-statistic:    =(AVERAGE(data)-target)/(STDEV.S(data)/SQRT(COUNT(data)))
p-value (2-tail):=T.DIST.2T(ABS(t_stat), COUNT(data)-1)
p-value (1-tail):=T.DIST.RT(t_stat, COUNT(data)-1)

=== TWO-SAMPLE T-TEST (Equal Variance) ===
Use: =T.TEST(array1, array2, tails, type)
- tails: 1 or 2
- type: 2 for equal variance, 3 for unequal variance

Example: =T.TEST(A1:A50, B1:B50, 2, 2)  ← Returns p-value

=== PAIRED T-TEST ===
=T.TEST(before, after, 2, 1)  ← type=1 for paired
```

### Excel Formulas for Other Tests

```excel
=== F-TEST (Variance Ratio) ===
=F.TEST(array1, array2)  ← Returns p-value directly

=== CHI-SQUARE TEST ===
Step 1: Calculate expected values
        Expected = (Row Total * Column Total) / Grand Total
Step 2: =CHISQ.TEST(observed_range, expected_range)
        Returns p-value

=== Z-TEST (when sigma known) ===
=Z.TEST(array, hypothesized_mean, sigma)  ← Returns p-value
```

### Minitab Commands

```
One-Sample T:     Stat > Basic Statistics > 1-Sample t
Two-Sample T:     Stat > Basic Statistics > 2-Sample t
Paired T:         Stat > Basic Statistics > Paired t
ANOVA:            Stat > ANOVA > One-Way
Chi-Square:       Stat > Tables > Chi-Square Test for Association
```

---

## Confidence Intervals

### Excel Formulas

```excel
=== CONFIDENCE INTERVAL FOR MEAN ===
Margin of Error: =CONFIDENCE.T(alpha, STDEV.S(data), COUNT(data))
Lower Bound:     =AVERAGE(data)-CONFIDENCE.T(0.05, STDEV.S(data), COUNT(data))
Upper Bound:     =AVERAGE(data)+CONFIDENCE.T(0.05, STDEV.S(data), COUNT(data))

=== CONFIDENCE INTERVAL FOR PROPORTION ===
p-hat:           =successes/n
SE:              =SQRT(p_hat*(1-p_hat)/n)
Lower Bound:     =p_hat - NORM.S.INV(1-alpha/2)*SE
Upper Bound:     =p_hat + NORM.S.INV(1-alpha/2)*SE

=== SAMPLE SIZE CALCULATIONS ===
For Mean:        =(NORM.S.INV(1-alpha/2)*sigma/E)^2
For Proportion:  =p*(1-p)*(NORM.S.INV(1-alpha/2)/E)^2
```

---

## Regression Analysis

### Excel Setup

```excel
=== TRENDLINE COEFFICIENTS (Simple Method) ===
Slope (b1):     =SLOPE(y_range, x_range)
Intercept (b0): =INTERCEPT(y_range, x_range)
R-squared:      =RSQ(y_range, x_range)
Correlation r:  =CORREL(y_range, x_range)
Std Error:      =STEYX(y_range, x_range)

=== PREDICTION ===
Predicted Y:    =FORECAST(new_x, y_range, x_range)
or:             =intercept + slope * new_x

=== MULTIPLE REGRESSION (Data Analysis Toolpak) ===
1. Data > Data Analysis > Regression
2. Y Range: Select response column
3. X Range: Select all predictor columns (adjacent)
4. Check "Labels" if headers included
5. Output: Select output location
```

### Regression Output Interpretation Template

```excel
=== CREATE THIS TABLE TO TRACK OUTPUTS ===
| Cell | Formula | Description |
|------|---------|-------------|
| D2   | =LINEST output | b1 (slope) |
| E2   | =LINEST output | b0 (intercept) |
| D3   | =LINEST output | SE of b1 |
| E3   | =LINEST output | SE of b0 |
| D4   | =D2/D3 | t-stat for b1 |
| D5   | =T.DIST.2T(ABS(D4),df) | p-value for b1 |
```

### Minitab Commands

```
Simple Regression:   Stat > Regression > Regression > Fit Regression Model
Multiple Regression: Stat > Regression > Regression > Fit Regression Model
Stepwise:           Stat > Regression > Regression > Fit Regression Model > Stepwise

Key Options:
- Graphs: Residual plots (Four-in-One recommended)
- Storage: Residuals, Fits, Coefficients
- Options: Display R-sq(pred)
```

---

## Control Charts

### Excel Formulas (X-bar R Chart)

```excel
=== SETUP (assumes n=5 subgroups) ===
X-double-bar:   =AVERAGE(all_subgroup_means)
R-bar:          =AVERAGE(all_subgroup_ranges)

=== CONTROL LIMITS (n=5, A2=0.577, D3=0, D4=2.114) ===
X-bar UCL:      =X_double_bar + 0.577 * R_bar
X-bar LCL:      =X_double_bar - 0.577 * R_bar
R UCL:          =2.114 * R_bar
R LCL:          =0 * R_bar  (always 0 for n≤6)

=== CONTROL CHART CONSTANTS TABLE ===
Create this reference:
| n | A2    | D3 | D4    | d2    |
|---|-------|-------|-------|-------|
| 2 | 1.880 | 0     | 3.267 | 1.128 |
| 3 | 1.023 | 0     | 2.574 | 1.693 |
| 4 | 0.729 | 0     | 2.282 | 2.059 |
| 5 | 0.577 | 0     | 2.114 | 2.326 |
| 6 | 0.483 | 0     | 2.004 | 2.534 |
```

### Excel I-MR Chart

```excel
=== INDIVIDUALS CHART ===
X-bar (I):      =AVERAGE(individual_values)
MR-bar:         =AVERAGE(moving_ranges)  ← skip first MR

UCL:            =X_bar + 2.66 * MR_bar
LCL:            =X_bar - 2.66 * MR_bar

MR Calculation: =ABS(current - previous)
```

### Excel P-Chart

```excel
=== P-CHART FORMULAS ===
p-bar:          =SUM(defectives)/SUM(sample_sizes)
Average n:      =AVERAGE(sample_sizes)

UCL:            =p_bar + 3*SQRT(p_bar*(1-p_bar)/n)
LCL:            =MAX(0, p_bar - 3*SQRT(p_bar*(1-p_bar)/n))

Note: For variable sample sizes, calculate limits for each point
```

### Minitab Commands

```
X-bar R:    Stat > Control Charts > Variables Charts for Subgroups > Xbar-R
I-MR:       Stat > Control Charts > Variables Charts for Individuals > I-MR
P-Chart:    Stat > Control Charts > Attributes Charts > P
C-Chart:    Stat > Control Charts > Attributes Charts > C
U-Chart:    Stat > Control Charts > Attributes Charts > U

Key Options:
- Tests: Select Western Electric rules
- Stages: Add stage boundaries if process changed
- Estimate: Exclude out-of-control points from limit calculations
```

---

## MSA (Gage R&R)

### Excel Formulas (ANOVA Method)

```excel
=== VARIANCE COMPONENTS ===
Total Variance:         =VAR.S(all_measurements)
Part-to-Part Variance:  Calculate from ANOVA MS_Parts
Repeatability:          =MS_Error from ANOVA
Reproducibility:        =From operator variance

=== GRR CALCULATION ===
GRR Variance:           =Repeatability_Var + Reproducibility_Var
%GRR:                   =SQRT(GRR_Var/Total_Var)*100

=== NDC (Number of Distinct Categories) ===
NDC:                    =1.41*SQRT(Part_Var/GRR_Var)
```

### Minitab Gage R&R

```
Stat > Quality Tools > Gage Study > Gage R&R Study (Crossed)
- Part numbers: Column with part IDs
- Operators: Column with operator IDs
- Measurement data: Column with measurements

Options:
- Study variation: 6 (standard) or 5.15 (process tolerance)
- ANOVA method recommended over Xbar-R method
```

---

## DOE Analysis

### Excel DOE Setup

```excel
=== 2^2 FACTORIAL (4 runs) ===
| Run | A  | B  | A*B | Response |
|-----|----|----|-----|----------|
| 1   | -1 | -1 |  1  | Y1       |
| 2   |  1 | -1 | -1  | Y2       |
| 3   | -1 |  1 | -1  | Y3       |
| 4   |  1 |  1 |  1  | Y4       |

=== EFFECT CALCULATIONS ===
Effect A:   =SUMPRODUCT(A_column, Y_column)/2
Effect B:   =SUMPRODUCT(B_column, Y_column)/2
Effect AB:  =SUMPRODUCT(AB_column, Y_column)/2

=== CODED TO NATURAL UNITS ===
Coded Value:    =(Actual - Center)/(Range/2)
Actual Value:   =Coded * (Range/2) + Center
```

### Minitab DOE

```
Create Design:  Stat > DOE > Factorial > Create Factorial Design
Analyze:        Stat > DOE > Factorial > Analyze Factorial Design
Optimize:       Stat > DOE > Factorial > Response Optimizer

Key Analysis Options:
- Terms: Include up to desired order of interactions
- Graphs: Pareto, Main Effects, Interaction plots
- Storage: Fits, Residuals, Coefficients
```

---

## Quick Reference: Which Formula/Command to Use

| Calculate This | Excel | Minitab Path |
|----------------|-------|--------------|
| Mean | =AVERAGE() | Stat > Basic Statistics > Display Descriptive |
| Std Dev | =STDEV.S() | Stat > Basic Statistics > Display Descriptive |
| Cpk | =(USL-Mean)/(3*s) formula | Stat > Quality Tools > Capability Analysis |
| T-test p-value | =T.TEST() | Stat > Basic Statistics > 1 or 2-Sample t |
| Regression | Data Analysis > Regression | Stat > Regression > Fit Regression Model |
| Control chart | Manual formulas | Stat > Control Charts > [choose type] |
| Gage R&R | ANOVA formulas | Stat > Quality Tools > Gage Study |
| DOE effects | SUMPRODUCT | Stat > DOE > Factorial > Analyze |

---

## Chatbot Calculator Commands

Ask the chatbot:

- "Calculate Cpk for USL=10, LSL=2, mean=6, stddev=1"
- "What's my sample size for 95% confidence, 0.5 margin?"
- "T-test with mean1=45, mean2=42, s1=3, s2=4, n1=25, n2=30"
- "Control limits for Xbar chart with Xbar=50, Rbar=4, n=5"
