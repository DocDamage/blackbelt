# Open Source Six Sigma Tools: Python & R

## Free Alternatives to Minitab

This guide provides copy-paste ready code for DOE, regression, and SPC using Python and R - zero license costs!

---

## Quick Setup

### Python Environment

```bash
pip install pandas numpy scipy statsmodels matplotlib seaborn
pip install pyDOE2  # For DOE designs
```

### R Environment

```r
install.packages(c("qcc", "DoE.base", "FrF2", "car", "lmtest"))
```

---

## Part 1: Descriptive Statistics

### Python

```python
import pandas as pd
import numpy as np
from scipy import stats

# Load data
df = pd.read_excel('your_data.xlsx')
col = 'Measurement'  # Your column name

# Descriptive statistics
print(f"Mean: {df[col].mean():.4f}")
print(f"Std Dev: {df[col].std():.4f}")
print(f"Variance: {df[col].var():.4f}")
print(f"Min: {df[col].min():.4f}")
print(f"Max: {df[col].max():.4f}")
print(f"Range: {df[col].max() - df[col].min():.4f}")
print(f"Count: {df[col].count()}")

# Full summary
print(df[col].describe())
```

### R

```r
# Load data
df <- read.csv("your_data.csv")
col <- df$Measurement

# Descriptive statistics
summary(col)
sd(col)
var(col)
```

---

## Part 2: Process Capability (Cpk)

### Python

```python
def calculate_cpk(data, usl, lsl):
    """Calculate Cp and Cpk for process capability analysis"""
    mean = np.mean(data)
    std = np.std(data, ddof=1)  # Sample std dev
    
    cp = (usl - lsl) / (6 * std)
    cpu = (usl - mean) / (3 * std)
    cpl = (mean - lsl) / (3 * std)
    cpk = min(cpu, cpl)
    
    return {
        'Cp': round(cp, 3),
        'Cpk': round(cpk, 3),
        'Cpu': round(cpu, 3),
        'Cpl': round(cpl, 3),
        'Mean': round(mean, 4),
        'StdDev': round(std, 4)
    }

# Example usage
data = df['Measurement'].values
USL, LSL = 10.5, 9.5
result = calculate_cpk(data, USL, LSL)
print(result)
```

### R

```r
library(qcc)

# Process capability
pc <- qcc::process.capability(
  qcc(df$Measurement, type="xbar.one", plot=FALSE),
  spec.limits = c(9.5, 10.5)  # LSL, USL
)
print(pc)
```

---

## Part 3: Control Charts (SPC)

### Python - X-bar R Chart

```python
import matplotlib.pyplot as plt

def xbar_r_chart(data, subgroup_size=5):
    """Create X-bar and R control charts"""
    n = subgroup_size
    
    # Reshape into subgroups
    n_subgroups = len(data) // n
    subgroups = data[:n_subgroups * n].reshape(n_subgroups, n)
    
    # Calculate statistics
    xbar = subgroups.mean(axis=1)
    R = subgroups.max(axis=1) - subgroups.min(axis=1)
    
    xbar_bar = xbar.mean()
    r_bar = R.mean()
    
    # Control chart constants (for n=5)
    A2 = {2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483}[n]
    D3 = {2: 0, 3: 0, 4: 0, 5: 0, 6: 0}[n]
    D4 = {2: 3.267, 3: 2.574, 4: 2.282, 5: 2.114, 6: 2.004}[n]
    
    # Control limits
    xbar_ucl = xbar_bar + A2 * r_bar
    xbar_lcl = xbar_bar - A2 * r_bar
    r_ucl = D4 * r_bar
    r_lcl = D3 * r_bar
    
    # Plot
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    
    # X-bar chart
    ax1.plot(xbar, 'bo-', label='X-bar')
    ax1.axhline(xbar_bar, color='g', linestyle='-', label=f'CL={xbar_bar:.3f}')
    ax1.axhline(xbar_ucl, color='r', linestyle='--', label=f'UCL={xbar_ucl:.3f}')
    ax1.axhline(xbar_lcl, color='r', linestyle='--', label=f'LCL={xbar_lcl:.3f}')
    ax1.set_title('X-bar Chart')
    ax1.legend()
    ax1.grid(True)
    
    # R chart
    ax2.plot(R, 'bo-', label='Range')
    ax2.axhline(r_bar, color='g', linestyle='-', label=f'CL={r_bar:.3f}')
    ax2.axhline(r_ucl, color='r', linestyle='--', label=f'UCL={r_ucl:.3f}')
    ax2.axhline(r_lcl, color='r', linestyle='--', label=f'LCL={r_lcl:.3f}')
    ax2.set_title('R Chart')
    ax2.legend()
    ax2.grid(True)
    
    plt.tight_layout()
    plt.savefig('control_chart.png', dpi=150)
    plt.show()
    
    return {'X-bar': xbar_bar, 'R-bar': r_bar, 'UCL': xbar_ucl, 'LCL': xbar_lcl}

# Usage
result = xbar_r_chart(df['Measurement'].values, subgroup_size=5)
```

### R - Control Charts with qcc

```r
library(qcc)

# X-bar R chart
data_matrix <- matrix(df$Measurement, ncol=5, byrow=TRUE)
qcc(data_matrix, type="xbar", title="X-bar Chart")
qcc(data_matrix, type="R", title="R Chart")

# Individuals chart (I-MR)
qcc(df$Measurement, type="xbar.one", title="Individuals Chart")
```

---

## Part 4: Hypothesis Testing

### Python - T-Tests

```python
from scipy import stats

# One-sample t-test
target = 10.0
t_stat, p_value = stats.ttest_1samp(df['Measurement'], target)
print(f"One-Sample T-Test vs {target}:")
print(f"  t-statistic: {t_stat:.4f}")
print(f"  p-value: {p_value:.4f}")
print(f"  Significant (α=0.05): {p_value < 0.05}")

# Two-sample t-test
group1 = df[df['Operator'] == 'A']['Measurement']
group2 = df[df['Operator'] == 'B']['Measurement']
t_stat, p_value = stats.ttest_ind(group1, group2)
print(f"\nTwo-Sample T-Test:")
print(f"  t-statistic: {t_stat:.4f}")
print(f"  p-value: {p_value:.4f}")

# Paired t-test
t_stat, p_value = stats.ttest_rel(before, after)
print(f"\nPaired T-Test:")
print(f"  t-statistic: {t_stat:.4f}")
print(f"  p-value: {p_value:.4f}")
```

### R - T-Tests

```r
# One-sample t-test
t.test(df$Measurement, mu = 10.0)

# Two-sample t-test
t.test(Measurement ~ Operator, data = df)

# Paired t-test
t.test(before, after, paired = TRUE)
```

---

## Part 5: Regression Analysis

### Python - Linear Regression

```python
import statsmodels.api as sm
import statsmodels.formula.api as smf

# Simple linear regression
model = smf.ols('Response ~ Predictor', data=df).fit()
print(model.summary())

# Multiple regression
model = smf.ols('Response ~ Temp + Pressure + Speed', data=df).fit()
print(model.summary())

# Get coefficients
print("\nCoefficients:")
print(model.params)

# Get p-values
print("\nP-values:")
print(model.pvalues)

# Predictions
predictions = model.predict(df)

# Residual analysis
residuals = model.resid
fitted = model.fittedvalues

# Plot residuals
import matplotlib.pyplot as plt
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Residuals vs Fitted
axes[0,0].scatter(fitted, residuals)
axes[0,0].axhline(0, color='r', linestyle='--')
axes[0,0].set_xlabel('Fitted Values')
axes[0,0].set_ylabel('Residuals')
axes[0,0].set_title('Residuals vs Fitted')

# Normal Q-Q plot
stats.probplot(residuals, dist="norm", plot=axes[0,1])
axes[0,1].set_title('Normal Q-Q')

# Histogram of residuals
axes[1,0].hist(residuals, bins=20, edgecolor='black')
axes[1,0].set_title('Histogram of Residuals')

# Residuals vs Order
axes[1,1].plot(residuals, 'o-')
axes[1,1].axhline(0, color='r', linestyle='--')
axes[1,1].set_title('Residuals vs Order')

plt.tight_layout()
plt.savefig('residual_plots.png', dpi=150)
plt.show()
```

### R - Linear Regression

```r
# Simple linear regression
model <- lm(Response ~ Predictor, data = df)
summary(model)

# Multiple regression
model <- lm(Response ~ Temp + Pressure + Speed, data = df)
summary(model)

# Residual plots
par(mfrow = c(2, 2))
plot(model)

# VIF for multicollinearity
library(car)
vif(model)
```

---

## Part 6: Design of Experiments (DOE)

### Python - 2^k Factorial Design

```python
import pyDOE2 as doe
import pandas as pd
import statsmodels.formula.api as smf

# Create 2^3 full factorial design
design = doe.ff2n(3)  # 3 factors, 2 levels each
design_df = pd.DataFrame(design, columns=['A', 'B', 'C'])

# Add coded levels (-1 and +1 become actual values)
design_df['Temp'] = design_df['A'].map({-1: 150, 1: 200})
design_df['Pressure'] = design_df['B'].map({-1: 10, 1: 30})
design_df['Time'] = design_df['C'].map({-1: 5, 1: 15})

print("Experimental Design:")
print(design_df)

# After running experiments, add response
design_df['Yield'] = [78, 85, 82, 91, 80, 88, 84, 95]  # Your actual data

# Analyze DOE - Full model with interactions
model = smf.ols('Yield ~ A + B + C + A:B + A:C + B:C + A:B:C', data=design_df).fit()
print("\nDOE Analysis:")
print(model.summary())

# Effect sizes
effects = model.params[1:] * 2  # Effects are 2x coefficients for coded [-1,1]
print("\nEffects:")
print(effects.sort_values(ascending=False))
```

### Python - Fractional Factorial (Resolution IV)

```python
# 2^(4-1) fractional factorial - Resolution IV
design = doe.fracfact('a b c d')  # Generator: D = ABC
design_df = pd.DataFrame(design, columns=['A', 'B', 'C', 'D'])

print("Fractional Factorial Design (Resolution IV):")
print(design_df)
print(f"\nRuns: {len(design_df)} (vs {2**4}=16 for full factorial)")
```

### R - DOE with FrF2

```r
library(FrF2)
library(DoE.base)

# 2^3 full factorial
design <- FrF2(nruns = 8, nfactors = 3, 
               factor.names = c("Temp", "Pressure", "Time"))
print(design)

# 2^(4-1) fractional factorial - Resolution IV
design_frac <- FrF2(nruns = 8, nfactors = 4,
                     factor.names = c("A", "B", "C", "D"),
                     generators = "D=ABC")
print(design_frac)

# Analyze DOE
design$Response <- c(78, 85, 82, 91, 80, 88, 84, 95)  # Your data
model <- lm(Response ~ A * B * C, data = design)
summary(model)

# Effect plot
library(ggplot2)
effects <- 2 * coef(model)[-1]
barplot(sort(effects), horiz=TRUE, las=1, main="Factor Effects")
```

---

## Part 7: ANOVA

### Python - One-Way ANOVA

```python
from scipy import stats
import statsmodels.api as sm
from statsmodels.formula.api import ols

# One-way ANOVA
groups = [df[df['Machine'] == m]['Output'] for m in df['Machine'].unique()]
f_stat, p_value = stats.f_oneway(*groups)
print(f"One-Way ANOVA:")
print(f"  F-statistic: {f_stat:.4f}")
print(f"  p-value: {p_value:.4f}")

# Using statsmodels for full ANOVA table
model = ols('Output ~ C(Machine)', data=df).fit()
anova_table = sm.stats.anova_lm(model, typ=2)
print("\nANOVA Table:")
print(anova_table)
```

### R - ANOVA

```r
# One-way ANOVA
model <- aov(Output ~ Machine, data = df)
summary(model)

# Tukey HSD post-hoc test
TukeyHSD(model)

# Two-way ANOVA with interaction
model <- aov(Output ~ Machine * Operator, data = df)
summary(model)
```

---

## Part 8: MSA (Gage R&R)

### Python - Gage R&R

```python
def gage_rr(df, part_col, operator_col, measurement_col):
    """Simple Gage R&R analysis"""
    import pandas as pd
    import numpy as np
    
    # Group by part and operator
    grouped = df.groupby([part_col, operator_col])[measurement_col]
    
    # Calculate variances
    within_var = grouped.var().mean()  # Repeatability
    
    # Operator variance
    op_means = df.groupby(operator_col)[measurement_col].mean()
    operator_var = op_means.var()
    
    # Part variance  
    part_means = df.groupby(part_col)[measurement_col].mean()
    part_var = part_means.var()
    
    # Total variance
    total_var = df[measurement_col].var()
    
    # Calculate %GRR
    grr_var = within_var + operator_var
    pct_grr = np.sqrt(grr_var / total_var) * 100
    
    return {
        'Repeatability (EV)': np.sqrt(within_var),
        'Reproducibility (AV)': np.sqrt(operator_var),
        'GRR': np.sqrt(grr_var),
        'Part Variation (PV)': np.sqrt(part_var),
        'Total Variation (TV)': np.sqrt(total_var),
        '%GRR': round(pct_grr, 2),
        'Assessment': 'Acceptable' if pct_grr < 30 else 'Unacceptable'
    }

# Usage
result = gage_rr(df, 'Part', 'Operator', 'Measurement')
print(result)
```

---

## Quick Reference: Which Tool for What

| Analysis | Python Package | R Package |
|----------|----------------|-----------|
| Descriptive Stats | pandas, numpy | base R |
| Capability (Cpk) | Custom function | qcc |
| Control Charts | Custom / matplotlib | qcc |
| T-tests | scipy.stats | base R |
| ANOVA | statsmodels, scipy | base R |
| Regression | statsmodels | base R, car |
| DOE | pyDOE2 | FrF2, DoE.base |
| MSA | Custom | qualityTools |

---

## Workflow Example: Full Analysis

```python
# Complete Six Sigma workflow in Python
import pandas as pd
import numpy as np
from scipy import stats
import statsmodels.formula.api as smf

# 1. Load and explore data
df = pd.read_excel('process_data.xlsx')
print("Data Summary:")
print(df.describe())

# 2. Check normality
stat, p = stats.shapiro(df['Response'])
print(f"\nNormality Test: p={p:.4f} {'(Normal)' if p > 0.05 else '(Not Normal)'}")

# 3. Process capability
mean, std = df['Response'].mean(), df['Response'].std()
USL, LSL = 105, 95
cpk = min((USL - mean) / (3*std), (mean - LSL) / (3*std))
print(f"\nCpk: {cpk:.3f} {'(Capable)' if cpk >= 1.33 else '(Not Capable)'}")

# 4. Identify significant factors (regression)
model = smf.ols('Response ~ Temp + Pressure + Speed', data=df).fit()
sig_factors = model.pvalues[model.pvalues < 0.05].index.tolist()
print(f"\nSignificant Factors: {sig_factors}")

# 5. Design follow-up DOE with significant factors
print("\nRecommendation: Run DOE with significant factors")
```
