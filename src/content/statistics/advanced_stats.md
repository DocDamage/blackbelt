# Advanced Statistics for Six Sigma

## Normality Testing

### Why Test Normality?

Many statistical tests assume normal distribution:

- T-tests
- ANOVA
- Control charts
- Process capability (Cpk)

### Normality Tests

| Test | Best For | Minitab | Python |
|------|----------|---------|--------|
| Shapiro-Wilk | Small samples (n < 50) | Stat > Basic Stats > Normality | `scipy.stats.shapiro()` |
| Anderson-Darling | Sensitive to tails | Stat > Basic Stats > Normality | `scipy.stats.anderson()` |
| Kolmogorov-Smirnov | Large samples | Stat > Basic Stats > Normality | `scipy.stats.kstest()` |
| D'Agostino-Pearson | Skewness + Kurtosis | N/A | `scipy.stats.normaltest()` |

### Interpretation

```
H0: Data is normally distributed
H1: Data is NOT normally distributed

If p-value > 0.05: Fail to reject H0 (assume normal)
If p-value < 0.05: Reject H0 (not normal)
```

### Python Normality Testing

```python
from scipy import stats
import numpy as np

data = np.array([...])  # Your data

# Shapiro-Wilk test
stat, p_value = stats.shapiro(data)
print(f"Shapiro-Wilk: p={p_value:.4f}")
print(f"Normal: {'Yes' if p_value > 0.05 else 'No'}")

# Visual check - Q-Q plot
import matplotlib.pyplot as plt
stats.probplot(data, dist="norm", plot=plt)
plt.title("Q-Q Plot")
plt.show()
```

### What To Do If Not Normal

| Option | When to Use |
|--------|-------------|
| Transform data | Log, sqrt, Box-Cox |
| Use non-parametric test | Mann-Whitney, Kruskal-Wallis |
| Increase sample size | Central Limit Theorem kicks in at n > 30 |
| Use robust methods | Trimmed mean, bootstrap |

---

## Non-Parametric Tests

### Comparison Chart

| Parametric | Non-Parametric Equivalent | Use When |
|------------|---------------------------|----------|
| 1-sample t-test | Wilcoxon signed-rank | Comparing to known value |
| 2-sample t-test | Mann-Whitney U | Comparing 2 independent groups |
| Paired t-test | Wilcoxon signed-rank | Comparing paired samples |
| One-way ANOVA | Kruskal-Wallis | Comparing 3+ groups |
| Pearson correlation | Spearman correlation | Relationship between variables |

### Mann-Whitney U Test (Python)

```python
from scipy import stats

group1 = [...]  # First group data
group2 = [...]  # Second group data

# Mann-Whitney U test
stat, p_value = stats.mannwhitneyu(group1, group2, alternative='two-sided')
print(f"U-statistic: {stat}")
print(f"P-value: {p_value:.4f}")
print(f"Significant difference: {'Yes' if p_value < 0.05 else 'No'}")
```

### Kruskal-Wallis Test (Python)

```python
from scipy import stats

group1 = [...]
group2 = [...]
group3 = [...]

stat, p_value = stats.kruskal(group1, group2, group3)
print(f"H-statistic: {stat:.4f}")
print(f"P-value: {p_value:.4f}")
```

---

## Sample Size Calculations

### For Means (Continuous Data)

```
n = (Zα/2 + Zβ)² × 2σ² / Δ²

Where:
- Zα/2 = Z-value for confidence (1.96 for 95%)
- Zβ = Z-value for power (0.84 for 80%)
- σ = Standard deviation
- Δ = Minimum difference to detect
```

### For Proportions

```
n = [Zα/2 × √(2p̄q̄) + Zβ × √(p1q1 + p2q2)]² / (p1 - p2)²

Where:
- p̄ = (p1 + p2) / 2
- q = 1 - p
```

### Sample Size Table (Quick Reference)

| Power | α = 0.05 | α = 0.01 |
|-------|----------|----------|
| 80% | n = 8/Δ² | n = 11/Δ² |
| 90% | n = 11/Δ² | n = 14/Δ² |
| 95% | n = 13/Δ² | n = 17/Δ² |

*Δ = Effect size (difference/std dev)*

### Python Sample Size

```python
from statsmodels.stats.power import TTestIndPower

analysis = TTestIndPower()

# Calculate required sample size
n = analysis.solve_power(
    effect_size=0.5,    # Cohen's d (medium = 0.5)
    alpha=0.05,          # Significance level
    power=0.8,           # Desired power
    ratio=1.0,           # n2/n1 ratio
    alternative='two-sided'
)
print(f"Required sample size per group: {n:.0f}")

# Calculate achieved power
power = analysis.solve_power(
    effect_size=0.5,
    alpha=0.05,
    nobs1=30,           # Your sample size
    ratio=1.0
)
print(f"Achieved power: {power:.2%}")
```

---

## Power Analysis

### Understanding Power

```
Power = 1 - β = P(Reject H0 | H0 is false)

Typical target: 80% or higher
```

### Factors Affecting Power

| Factor | Effect on Power |
|--------|-----------------|
| ↑ Sample size | ↑ Power |
| ↑ Effect size | ↑ Power |
| ↑ α (significance level) | ↑ Power |
| ↓ Variability (σ) | ↑ Power |

### Power Curve (Python)

```python
from statsmodels.stats.power import TTestIndPower
import matplotlib.pyplot as plt
import numpy as np

analysis = TTestIndPower()

# Generate power curve
sample_sizes = np.arange(10, 200, 10)
powers = [analysis.solve_power(effect_size=0.5, alpha=0.05, nobs1=n) 
          for n in sample_sizes]

plt.plot(sample_sizes, powers, 'b-')
plt.axhline(0.8, color='r', linestyle='--', label='80% Power')
plt.xlabel('Sample Size')
plt.ylabel('Power')
plt.title('Power Curve (Effect Size = 0.5)')
plt.legend()
plt.grid(True)
plt.show()
```

---

## Box-Cox Transformation

### Purpose

Transform non-normal data to approximately normal.

### Formula

```
y(λ) = (y^λ - 1) / λ  if λ ≠ 0
y(λ) = ln(y)          if λ = 0
```

### Common λ Values

| λ | Transformation |
|---|----------------|
| -1 | Inverse (1/y) |
| -0.5 | Inverse square root |
| 0 | Natural log |
| 0.5 | Square root |
| 1 | No transformation |
| 2 | Square |

### Python Box-Cox

```python
from scipy import stats
import numpy as np

# Original non-normal data (must be positive)
data = np.array([...])

# Apply Box-Cox
data_transformed, lambda_optimal = stats.boxcox(data)

print(f"Optimal lambda: {lambda_optimal:.4f}")

# Verify normality after transformation
stat, p = stats.shapiro(data_transformed)
print(f"Shapiro-Wilk p-value: {p:.4f}")
```

---

## Confidence Intervals

### CI for Mean (σ unknown)

```
CI = x̄ ± t(α/2, n-1) × s/√n
```

### CI for Proportion

```
CI = p̂ ± z(α/2) × √[p̂(1-p̂)/n]
```

### CI for Difference in Means

```
CI = (x̄₁ - x̄₂) ± t(α/2, df) × SE
SE = √(s₁²/n₁ + s₂²/n₂)
```

### Python Confidence Intervals

```python
from scipy import stats
import numpy as np

data = np.array([...])

# 95% CI for mean
mean = np.mean(data)
se = stats.sem(data)
ci = stats.t.interval(0.95, len(data)-1, loc=mean, scale=se)

print(f"Mean: {mean:.4f}")
print(f"95% CI: ({ci[0]:.4f}, {ci[1]:.4f})")
```

---

## Correlation Analysis

### Pearson vs Spearman

| Pearson | Spearman |
|---------|----------|
| Linear relationships | Monotonic relationships |
| Assumes normality | Non-parametric |
| Sensitive to outliers | Robust to outliers |
| Continuous data | Ordinal or continuous |

### Interpretation

| r | Strength |
|---|----------|
| 0.00 - 0.19 | Very weak |
| 0.20 - 0.39 | Weak |
| 0.40 - 0.59 | Moderate |
| 0.60 - 0.79 | Strong |
| 0.80 - 1.00 | Very strong |

### Python Correlation

```python
from scipy import stats
import pandas as pd

# Pearson
r, p = stats.pearsonr(x, y)
print(f"Pearson r = {r:.4f}, p = {p:.4f}")

# Spearman
rho, p = stats.spearmanr(x, y)
print(f"Spearman ρ = {rho:.4f}, p = {p:.4f}")

# Correlation matrix
df = pd.DataFrame({'X1': x1, 'X2': x2, 'X3': x3})
print(df.corr())
```

---

## Chi-Square Tests

### Chi-Square Goodness of Fit

Tests if observed frequencies match expected.

```python
from scipy import stats

observed = [45, 35, 20]
expected = [40, 40, 20]

chi2, p = stats.chisquare(observed, expected)
print(f"Chi-square = {chi2:.4f}, p = {p:.4f}")
```

### Chi-Square Test of Independence

Tests if two categorical variables are independent.

```python
from scipy import stats

# Contingency table
observed = [[30, 10], [20, 40]]

chi2, p, dof, expected = stats.chi2_contingency(observed)
print(f"Chi-square = {chi2:.4f}")
print(f"P-value = {p:.4f}")
print(f"Degrees of freedom = {dof}")
print(f"Expected frequencies:\n{expected}")
```

---

## ANOVA Extensions

### Two-Way ANOVA

```python
import statsmodels.api as sm
from statsmodels.formula.api import ols

# Fit model with interaction
model = ols('Response ~ C(Factor1) * C(Factor2)', data=df).fit()
anova_table = sm.stats.anova_lm(model, typ=2)
print(anova_table)
```

### Tukey HSD Post-Hoc

```python
from statsmodels.stats.multicomp import pairwise_tukeyhsd

tukey = pairwise_tukeyhsd(df['Response'], df['Group'], alpha=0.05)
print(tukey)
```

---

## Reliability Analysis (Weibull)

### Weibull Distribution

Used for failure time analysis.

```
f(t) = (β/η) × (t/η)^(β-1) × exp(-(t/η)^β)

β = Shape parameter (failure rate pattern)
η = Scale parameter (characteristic life)
```

### Shape Parameter Interpretation

| β | Failure Rate |
|---|--------------|
| < 1 | Decreasing (infant mortality) |
| = 1 | Constant (exponential) |
| > 1 | Increasing (wear-out) |

### Python Weibull

```python
from scipy import stats
import numpy as np

# Fit Weibull to failure data
failure_times = np.array([...])

shape, loc, scale = stats.weibull_min.fit(failure_times, floc=0)
print(f"Shape (β): {shape:.4f}")
print(f"Scale (η): {scale:.4f}")

# Reliability at time t
t = 1000
reliability = 1 - stats.weibull_min.cdf(t, shape, loc=0, scale=scale)
print(f"R({t}) = {reliability:.4%}")
```
