# Black Belt Exam-Style Coefficient Questions

## Practice Problems with Step-by-Step Solutions

---

## Question 1: Basic Coefficient Interpretation

**A regression analysis for predicting cycle time (minutes) yields:**

| Term | Coef | SE Coef | T-Value | P-Value |
|------|------|---------|---------|---------|
| Constant | 45.2 | 3.1 | 14.58 | 0.000 |
| Operators | -2.4 | 0.8 | -3.00 | 0.005 |
| Machine Speed | 0.15 | 0.03 | 5.00 | 0.000 |

**Questions:**
a) What is the predicted cycle time when Operators = 5 and Machine Speed = 100?
b) Is the Operators coefficient significant at α = 0.05?
c) How much does cycle time change for each additional operator?

### Solution

**a) Predicted Cycle Time:**

```
ŷ = 45.2 + (-2.4)(5) + (0.15)(100)
ŷ = 45.2 - 12 + 15
ŷ = 48.2 minutes
```

**b) Significance Test:**

- H₀: β_Operators = 0 (no effect)
- H₁: β_Operators ≠ 0 (has effect)
- P-value = 0.005 < α = 0.05
- **Conclusion: Reject H₀. Operators is statistically significant.**

**c) Interpretation:**

- Coefficient = -2.4
- For each additional operator, cycle time **decreases** by 2.4 minutes
- The negative sign indicates an inverse relationship

---

## Question 2: Comparing Coefficients

**A yield (%) model with coded factors (-1 to +1) shows:**

| Term | Coded Coef | SE Coef | T-Value | P-Value |
|------|------------|---------|---------|---------|
| Temperature | 4.5 | 0.8 | 5.63 | 0.000 |
| Pressure | 2.1 | 0.8 | 2.63 | 0.015 |
| Catalyst | 6.2 | 0.8 | 7.75 | 0.000 |

**Questions:**
a) Which factor has the largest effect on yield?
b) If Temperature moves from low (-1) to high (+1), how much does yield change?
c) Rank the factors by importance.

### Solution

**a) Largest Effect:**

- Compare |Coded Coefficients|: |4.5|, |2.1|, |6.2|
- **Catalyst has the largest effect (6.2)**

**b) Temperature Effect:**

- Moving from -1 to +1 is a change of 2 coded units
- Effect = 2 × 4.5 = 9% yield increase
- OR: Coded coef already represents half-effect, so full effect = 2 × 4.5 = 9%

**c) Factor Ranking:**

1. Catalyst (6.2) - Most important
2. Temperature (4.5) - Second
3. Pressure (2.1) - Least important

⚠️ **TRAP ALERT:** Only compare coded coefficients when factors use the same scale!

---

## Question 3: P-Value Interpretation

**Given the following output:**

| Term | Coef | P-Value |
|------|------|---------|
| Constant | 120.5 | 0.000 |
| Factor A | 8.3 | 0.023 |
| Factor B | 2.1 | 0.312 |
| Factor C | -5.7 | 0.087 |
| A*B | 3.4 | 0.145 |

**At α = 0.05, which terms are statistically significant?**

### Solution

| Term | P-Value | Significant at α = 0.05? |
|------|---------|--------------------------|
| Constant | 0.000 | Yes (0.000 < 0.05) |
| Factor A | 0.023 | **Yes** (0.023 < 0.05) |
| Factor B | 0.312 | No (0.312 > 0.05) |
| Factor C | 0.087 | No (0.087 > 0.05) ⚠️ |
| A*B | 0.145 | No (0.145 > 0.05) |

**Key Insight on Factor C:**

- P-value = 0.087 is close to 0.05
- At α = 0.10, it would be significant
- Consider practical significance: -5.7 is a substantial effect
- May want to retain in model and investigate further

---

## Question 4: T-Value Calculation

**You are given:**

- Coefficient = 3.6
- Standard Error = 1.2
- Sample size = 25
- Number of predictors = 3

**Questions:**
a) Calculate the t-value
b) What are the degrees of freedom?
c) Using t-critical ≈ 2.08 (df=21, α=0.05), is this coefficient significant?

### Solution

**a) T-Value:**

```
t = Coef / SE Coef
t = 3.6 / 1.2
t = 3.0
```

**b) Degrees of Freedom:**

```
df = n - k - 1
df = 25 - 3 - 1
df = 21
```

**c) Significance Test:**

- |t| = 3.0 > t-critical = 2.08
- **Conclusion: Coefficient is significant at α = 0.05**
- The coefficient is 3 standard errors away from zero

---

## Question 5: Sign Errors and Interpretation

**A defect rate model shows:**

```
Defect Rate = 5.2 - 0.3(Training Hours) + 0.8(Machine Age)
```

**Question:** Explain what each coefficient means in practical terms.

### Solution

**Constant (5.2):**

- Baseline defect rate when Training Hours = 0 and Machine Age = 0
- May not be physically meaningful (new machines, no training)

**Training Hours (-0.3):**

- Negative coefficient → defect rate DECREASES with training
- Each additional hour of training reduces defect rate by 0.3%
- This makes practical sense!

**Machine Age (+0.8):**

- Positive coefficient → defect rate INCREASES with age
- Each additional year of machine age increases defect rate by 0.8%
- This also makes practical sense (older machines = more defects)

⚠️ **SIGN CHECK:** Always verify coefficients align with domain knowledge!

- Negative signs reduce Y when X increases
- Positive signs increase Y when X increases

---

## Question 6: Interaction Effects

**Model with interaction:**

```
Output = 50 + 4(Temp) + 3(Pressure) - 2(Temp×Pressure)
```

**Questions:**
a) What is the effect of Temperature when Pressure = 0?
b) What is the effect of Temperature when Pressure = 5?
c) Interpret the negative interaction coefficient.

### Solution

**a) Effect of Temp when Pressure = 0:**

```
Effect = 4 + (-2)(0) = 4
```

Temperature effect = +4 units per degree

**b) Effect of Temp when Pressure = 5:**

```
Effect = 4 + (-2)(5) = 4 - 10 = -6
```

Temperature effect = -6 units per degree!
The effect REVERSES at high pressure!

**c) Interaction Interpretation:**

- Negative interaction (-2) means the factors work against each other
- At high pressure, increasing temperature actually decreases output
- At low pressure, temperature has its expected positive effect
- **You cannot interpret main effects without considering interactions!**

---

## Question 7: VIF and Multicollinearity

**Regression output shows:**

| Term | Coef | SE Coef | VIF |
|------|------|---------|-----|
| X1 | 2.3 | 1.8 | 12.4 |
| X2 | -1.1 | 1.5 | 11.8 |
| X3 | 4.5 | 0.6 | 1.2 |

**Questions:**
a) Which variables have multicollinearity issues?
b) What is the likely cause?
c) How does this affect interpretation?

### Solution

**a) Multicollinearity Assessment:**

- X1: VIF = 12.4 > 10 → **Severe multicollinearity**
- X2: VIF = 11.8 > 10 → **Severe multicollinearity**
- X3: VIF = 1.2 < 5 → No issue

**b) Likely Cause:**

- X1 and X2 are highly correlated with each other
- When you try to predict X1 from X2 (or vice versa), R² is very high
- They contain similar information

**c) Effects on Interpretation:**

- Coefficients for X1 and X2 are unstable (large SE relative to Coef)
- Individual effects are hard to separate
- t-tests may show insignificant when combined effect is significant
- **Solution options:**
  1. Remove one of the correlated variables
  2. Combine them into a single variable
  3. Use principal component analysis
  4. Collect more data

---

## Question 8: Model Adequacy Check

**Model Summary:**

```
S = 4.25    R-sq = 89.2%    R-sq(adj) = 87.8%    R-sq(pred) = 82.1%
```

**Questions:**
a) Interpret R-sq
b) Why is R-sq(adj) lower than R-sq?
c) What does the gap between R-sq(adj) and R-sq(pred) suggest?

### Solution

**a) R-sq Interpretation:**

- 89.2% of the variation in the response is explained by the model
- The model accounts for most of the variability
- 10.8% remains unexplained (residual/error)

**b) Why R-sq(adj) < R-sq:**

- R-sq always increases when adding predictors (even useless ones)
- R-sq(adj) penalizes for number of predictors
- Formula: R²(adj) = 1 - (1-R²)(n-1)/(n-k-1)
- Small penalty here (89.2% → 87.8%) suggests predictors are useful

**c) Gap Analysis:**

- R-sq(adj) = 87.8%
- R-sq(pred) = 82.1%
- Gap = 5.7%
- **Moderate gap suggests some overfitting**
- Model may not predict new data as well as it fits current data
- Consider removing weakly significant terms

---

## Question 9: Converting Coded to Uncoded

**DOE with coded coefficients:**

- Temperature: Low = 150°C, High = 200°C, Coded Coef = 8.5
- Pressure: Low = 10 psi, High = 30 psi, Coded Coef = -3.2

**Calculate the uncoded coefficients.**

### Solution

**Temperature:**

```
Range = 200 - 150 = 50°C
Half-range = 25°C
Uncoded Coef = Coded Coef / Half-range
Uncoded Coef = 8.5 / 25 = 0.34 per °C
```

**Pressure:**

```
Range = 30 - 10 = 20 psi
Half-range = 10 psi
Uncoded Coef = Coded Coef / Half-range
Uncoded Coef = -3.2 / 10 = -0.32 per psi
```

**Verification:**

- Moving Temp from 150 to 200 (Δ=50): Effect = 50 × 0.34 = 17 ✓ (should be 2 × 8.5 = 17)
- Moving Pressure from 10 to 30 (Δ=20): Effect = 20 × (-0.32) = -6.4 ✓ (should be 2 × (-3.2) = -6.4)

---

## Question 10: Complete Analysis Problem

**A Black Belt runs a regression and gets:**

| Term | Coef | SE Coef | T-Value | P-Value | VIF |
|------|------|---------|---------|---------|-----|
| Constant | 78.3 | 5.2 | 15.06 | 0.000 | - |
| Speed | 1.45 | 0.35 | 4.14 | 0.000 | 1.8 |
| Feed | -0.82 | 0.28 | -2.93 | 0.007 | 2.1 |
| Depth | 2.10 | 0.95 | 2.21 | 0.035 | 1.5 |
| Speed*Feed | -0.15 | 0.12 | -1.25 | 0.222 | 1.3 |

**Model Summary: S = 3.45, R-sq = 82.4%, R-sq(adj) = 79.1%**

**Complete Analysis:**

### Step 1: Assess Overall Model

- R-sq = 82.4% (good explanatory power)
- R-sq(adj) = 79.1% (reasonable, ~3% adjustment)
- S = 3.45 (typical prediction error)

### Step 2: Check Multicollinearity

- All VIF < 5 → No multicollinearity issues ✓

### Step 3: Identify Significant Terms (α = 0.05)

- Constant: p = 0.000 ✓
- Speed: p = 0.000 ✓ **Significant**
- Feed: p = 0.007 ✓ **Significant**
- Depth: p = 0.035 ✓ **Significant**
- Speed*Feed: p = 0.222 ✗ Not significant

### Step 4: Interpret Coefficients

- Speed (+1.45): Each unit increase in speed increases response by 1.45
- Feed (-0.82): Each unit increase in feed decreases response by 0.82
- Depth (+2.10): Each unit increase in depth increases response by 2.10

### Step 5: Recommendations

1. Remove Speed*Feed interaction (not significant)
2. Rerun model with only main effects
3. To maximize response: increase Speed and Depth, decrease Feed
4. Optimal settings depend on constraints not given here

### Final Equation

```
ŷ = 78.3 + 1.45(Speed) - 0.82(Feed) + 2.10(Depth)
```

---

## Quick Reference: Exam Tips

### When Asked About Significance

1. State the hypothesis: H₀: β = 0, H₁: β ≠ 0
2. Compare p-value to α
3. Conclude: Reject or Fail to Reject H₀

### When Asked to Interpret Coefficients

1. State the direction (+ or -)
2. State the magnitude
3. Specify "per unit change in X, holding others constant"

### When Asked About Interactions

1. Calculate effect at different levels
2. Explain how one factor modifies another's effect
3. Note if effects reverse at different levels

### Common Pitfalls to Avoid

1. ❌ Comparing coefficients on different scales
2. ❌ Ignoring VIF when interpreting coefficients
3. ❌ Confusing statistical significance with practical significance
4. ❌ Interpreting main effects when interactions are significant
5. ❌ Using the model beyond the range of collected data
