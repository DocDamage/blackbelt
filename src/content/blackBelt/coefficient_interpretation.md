# Interpreting Regression Coefficients in Excel & Minitab

## Understanding Regression Output

### The Coefficient Table

When you run a regression in Excel or Minitab, you get a coefficient table that looks like this:

| Term | Coef | SE Coef | T-Value | P-Value | VIF |
|------|------|---------|---------|---------|-----|
| Constant | 12.45 | 1.23 | 10.12 | 0.000 | - |
| Temperature | 2.34 | 0.45 | 5.20 | 0.000 | 1.05 |
| Pressure | -0.87 | 0.32 | -2.72 | 0.012 | 1.08 |
| Time | 1.56 | 0.89 | 1.75 | 0.092 | 1.12 |

### Column-by-Column Explanation

#### 1. Coef (Coefficient/Estimate)

**What it means:** The expected change in Y for a one-unit increase in X, holding all other variables constant.

**Interpretation:**

- **Positive coefficient**: Y increases when X increases
- **Negative coefficient**: Y decreases when X increases
- **Zero coefficient**: No relationship (rare in practice)

**Example:** Temperature coefficient = 2.34 means:

- For every 1°C increase in temperature, the response increases by 2.34 units
- If temperature goes from 100°C to 105°C (Δ = 5), response increases by 5 × 2.34 = 11.7

---

#### 2. SE Coef (Standard Error of Coefficient)

**What it means:** The uncertainty/variability in the coefficient estimate.

**Key points:**

- Smaller SE = more precise estimate
- SE depends on sample size and data variability
- Used to calculate t-value and confidence intervals

**Rule of thumb:**

- If Coef is less than 2× SE, the coefficient may not be significant
- CI = Coef ± t(α/2) × SE

---

#### 3. T-Value (T-Statistic)

**What it means:** How many standard errors the coefficient is away from zero.

**Formula:**

```
T-Value = Coef / SE Coef
```

**Interpretation:**
| |T-Value| | Significance |
|-----------|--------------|
| < 1 | Weak evidence (likely not significant) |
| 1-2 | Marginal evidence |
| 2-3 | Moderate evidence |
| > 3 | Strong evidence |

**Critical insight:** The t-value tests H₀: βⱼ = 0 (coefficient equals zero, meaning no effect).

---

#### 4. P-Value

**What it means:** Probability of observing a t-value this extreme if the true coefficient is zero.

**Decision rules (α = 0.05):**

| P-Value | Decision | Conclusion |
|---------|----------|------------|
| < 0.01 | Highly Significant | Strong evidence of effect |
| 0.01-0.05 | Significant | Evidence of effect |
| 0.05-0.10 | Marginally Significant | Weak evidence, use caution |
| > 0.10 | Not Significant | Insufficient evidence of effect |

**CRITICAL:** A significant p-value does NOT mean:

- ✗ The effect is large (could be small but precisely measured)
- ✗ The relationship is causal
- ✗ The model is good overall

---

#### 5. VIF (Variance Inflation Factor)

**What it means:** Measure of multicollinearity (correlation between predictors).

**Formula:**

```
VIF = 1 / (1 - R²ⱼ)
Where R²ⱼ is the R² from regressing Xⱼ on all other X variables
```

**Interpretation:**

| VIF | Multicollinearity |
|-----|-------------------|
| 1 | None |
| 1-5 | Moderate (usually acceptable) |
| 5-10 | High (investigate) |
| > 10 | Severe (action required) |

**High VIF consequences:**

- Inflated standard errors
- Unstable coefficients
- Difficult to interpret individual effects

---

## Excel Regression Output

### Running Regression in Excel

1. Data → Data Analysis → Regression
2. Select Y range and X range
3. Check "Labels" if headers included
4. Select output location

### Excel Output Sections

#### Summary Output

```
Regression Statistics
Multiple R:      0.892     ← Correlation coefficient
R Square:        0.796     ← Proportion of variance explained
Adjusted R Sq:   0.783     ← Adjusted for # of predictors
Standard Error:  2.145     ← Std dev of residuals
Observations:    50        ← Sample size
```

#### ANOVA Table

```
              df       SS        MS        F      Sig F
Regression    3     720.5    240.17    52.18    2.3E-15
Residual     46     184.3      4.01
Total        49     904.8
```

**Key F-test interpretation:**

- Tests H₀: All coefficients = 0 simultaneously
- Sig F < 0.05: At least one predictor is significant
- Sig F > 0.05: Model has no predictive power

#### Coefficients Table

```
             Coefficients  Std Error   t Stat   P-value   Lower 95%  Upper 95%
Intercept       12.45        1.23      10.12    0.000       9.97       14.93
Temperature      2.34        0.45       5.20    0.000       1.44        3.24
Pressure        -0.87        0.32      -2.72    0.012      -1.51       -0.23
Time             1.56        0.89       1.75    0.092      -0.23        3.35
```

---

## Minitab Regression Output

### Running Regression in Minitab

1. Stat → Regression → Regression → Fit Regression Model
2. Enter Response and Continuous Predictors
3. Options: Storage (residuals, fits), Graphs (residual plots)

### Minitab Output Sections

#### Regression Equation

```
Response = 12.45 + 2.34 Temperature - 0.87 Pressure + 1.56 Time
```

#### Coefficients Table

```
Term          Coef   SE Coef  T-Value  P-Value   VIF
Constant     12.45     1.23    10.12    0.000
Temperature   2.34     0.45     5.20    0.000   1.05
Pressure     -0.87     0.32    -2.72    0.012   1.08
Time          1.56     0.89     1.75    0.092   1.12
```

#### Model Summary

```
S        R-sq    R-sq(adj)  R-sq(pred)
2.145    79.6%    78.3%       75.2%
```

**S (Standard Error):** Typical prediction error
**R-sq(adj):** Adjusted for number of predictors
**R-sq(pred):** How well model predicts new data (hold-out estimate)

#### Analysis of Variance

```
Source        DF    Adj SS   Adj MS  F-Value  P-Value
Regression     3    720.5   240.17    52.18    0.000
  Temperature  1    108.3   108.30    23.62    0.000
  Pressure     1     29.7    29.70     6.47    0.012
  Time         1     12.3    12.30     2.68    0.092
Error         46    184.3     4.01
Total         49    904.8
```

---

## Coded vs Uncoded Coefficients

### Minitab's Coded Coefficients (DOE)

In DOE, Minitab often displays **coded coefficients** where factors are scaled to -1 and +1.

| Coefficient Type | Use Case | Interpretation |
|------------------|----------|----------------|
| Uncoded | Natural units | Change in Y per natural unit change |
| Coded | Comparing factor importance | Change in Y per level change (-1 to +1) |

**Example:**

- Uncoded: Temperature coef = 0.234 per °C
- Coded: Temperature coef = 2.34 (scaled to show effect from low to high level)

**Converting:**

```
Coded Coef = Uncoded Coef × (High - Low) / 2
```

---

## Stepwise Regression Selection

### Selection Methods

| Method | Description | Use When |
|--------|-------------|----------|
| Forward | Add predictors one at a time | Many potential predictors |
| Backward | Remove predictors one at a time | Start with full model |
| Stepwise | Add/remove at each step | General purpose |
| Best Subsets | Evaluate all combinations | Fewer predictors (< 15) |

### Selection Criteria

| Criterion | Goal | Notes |
|-----------|------|-------|
| R²(adj) | Maximize | Penalizes extra predictors |
| Mallows' Cp | Minimize, ≈ p | p = # of parameters |
| AIC | Minimize | Balance fit vs complexity |
| BIC | Minimize | Stronger penalty than AIC |
| PRESS | Minimize | Prediction error |

---

## Reading the Regression Equation

### Multiple Regression Form

```
ŷ = b₀ + b₁X₁ + b₂X₂ + ... + bₖXₖ
```

### With Interactions

```
ŷ = b₀ + b₁X₁ + b₂X₂ + b₁₂X₁X₂
```

**Interpreting Interactions:**

- b₁₂ = how the effect of X₁ changes at different levels of X₂
- If b₁₂ > 0: effect of X₁ is stronger when X₂ is high
- If b₁₂ < 0: effect of X₁ is weaker when X₂ is high

### With Quadratic Terms

```
ŷ = b₀ + b₁X + b₂X²
```

**Interpreting Quadratics:**

- If b₂ > 0: U-shaped relationship (minimum exists)
- If b₂ < 0: Inverted U-shaped (maximum exists)
- Optimal X = -b₁ / (2b₂)

---

## Practical Tips

### Before Interpreting Coefficients

1. **Check residual plots** - Validate model assumptions
2. **Check R²(adj)** - Is the model explaining enough variance?
3. **Check VIF** - Are predictors too correlated?
4. **Check for outliers** - Influential points distorting results?

### Common Mistakes

1. ❌ Interpreting p > 0.05 as "no effect" (absence of evidence ≠ evidence of absence)
2. ❌ Comparing coefficients on different scales
3. ❌ Ignoring interactions when they exist
4. ❌ Using individual t-tests when ANOVA F-test is not significant
5. ❌ Over-interpreting R² without checking prediction error

### For Certification Exams

- Always state the null hypothesis being tested
- Distinguish between statistical and practical significance
- Know how to hand-calculate t-values: t = Coef / SE
- Remember: F = MSR / MSE for overall model test
