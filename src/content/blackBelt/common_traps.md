# Common Statistical Traps: Sign Errors, Confounding & Aliasing

## Understanding the Pitfalls That Trip Up Six Sigma Practitioners

---

## Part 1: Sign Errors in Regression

### What Are Sign Errors?

A sign error occurs when the coefficient has the opposite sign from what theory or domain knowledge predicts. This often indicates a modeling problem rather than a true relationship reversal.

### Common Causes of Sign Errors

#### 1. Multicollinearity

**Symptom:** Sign flip when adding/removing variables
**Why it happens:** Correlated predictors compete for explaining variance

**Example:**

```
Model 1: Sales = 100 + 5(Advertising)     ← Positive, makes sense
Model 2: Sales = 100 - 2(Advertising) + 8(Market Size)   ← Sign flipped!
```

**What happened:** Advertising and Market Size are highly correlated. When both are in the model, the coefficient for Advertising becomes negative even though advertising clearly helps sales.

**Detection:** Check VIF > 10
**Solution:** Remove one correlated variable or combine them

---

#### 2. Omitted Variable Bias

**Symptom:** Coefficient has wrong sign because a confounding variable is missing

**Classic Example (Simpson's Paradox):**

```
Hospital A: 90% survival rate, treats mostly mild cases
Hospital B: 80% survival rate, treats mostly severe cases

Naive analysis: "Hospital A is better"
Reality: Hospital B is better for both mild AND severe cases!
```

**In Regression Terms:**

```
Wrong model:  Survival = β₀ + β₁(Hospital)   ← Hospital A looks better
Right model:  Survival = β₀ + β₁(Hospital) + β₂(Severity)   ← Hospital B is better
```

**Solution:** Include all relevant confounding variables

---

#### 3. Suppressor Variables

**Symptom:** A variable that wasn't significant alone becomes significant (and may flip signs) when another variable is added

**Why it happens:** The suppressor "suppresses" irrelevant variance in another predictor

**Example:**

```
Model 1: Job Performance = 50 + 0.1(Test Score)   ← p=0.45, not significant
Model 2: Job Performance = 50 + 2.5(Test Score) - 3.0(Anxiety)   ← Both significant!
```

**What happened:** Test-taking anxiety suppresses true ability on the test. Controlling for anxiety reveals the true relationship between ability and performance.

---

#### 4. Wrong Functional Form

**Symptom:** Sign seems wrong because relationship is nonlinear

**Example:**

```
Linear model:    Profit = 100 - 0.5(Advertising)   ← Negative?!
True relationship: Profit = 100 + 10(Advertising) - 0.01(Advertising²)
```

**Interpretation:** Advertising helps up to a point, then shows diminishing returns. A purely linear model picks up the overall declining trend in the data range.

**Solution:**

- Plot residuals vs X
- Try quadratic terms
- Use transformations

---

### Sign Error Detection Checklist

| Check | Question | Action if Yes |
|-------|----------|---------------|
| Domain Knowledge | Does sign contradict known relationships? | Investigate before reporting |
| VIF | Any VIF > 10? | Address multicollinearity |
| Residual Plots | Pattern in residuals vs fitted? | Consider transformations |
| Correlation Matrix | |r| > 0.8 between predictors? | Combine or remove variables |
| Added Variable | Does sign change when adding/removing vars? | Investigate relationships |

---

## Part 2: Confounding

### What is Confounding?

Confounding occurs when an unmeasured variable influences both the predictor (X) and response (Y), creating a spurious association or masking a true relationship.

```
Confounding Variable (Z)
       ↙         ↘
      X    →?→    Y
```

The observed X→Y relationship includes the Z effect.

---

### Classic Confounding Examples

#### Example 1: Ice Cream and Drowning

**Observed:** Ice cream sales and drowning deaths are positively correlated
**Confound:** Summer temperature increases both
**Truth:** Ice cream doesn't cause drowning!

#### Example 2: Shoe Size and Reading Ability

**Observed:** Children with larger shoes read better
**Confound:** Age (older children have bigger feet AND read better)
**Truth:** Growing feet doesn't improve reading

#### Example 3: Yellow Fingers and Lung Cancer

**Observed:** Yellow fingers associated with lung cancer
**Confound:** Smoking causes both yellow fingers AND lung cancer
**Truth:** Cleaning your fingers won't prevent cancer

---

### Confounding in Six Sigma Context

#### Manufacturing Example

**Project:** Reduce defects by improving training
**Observation:** Employees with more training have HIGHER defect rates
**Confound:** New employees get more training AND make more mistakes (inexperience)
**Truth:** Training helps, but the effect is hidden by experience level

**Solution:**

```
Wrong:   Defects = β₀ + β₁(Training Hours)   ← Shows training is harmful!
Right:   Defects = β₀ + β₁(Training Hours) + β₂(Experience)   ← Training helps
```

---

### Controlling for Confounding

#### Method 1: Randomization (Best option when possible)

- Randomly assign subjects to treatment groups
- Confounders are balanced across groups
- Only option for establishing causation

#### Method 2: Stratification

- Analyze within subgroups (strata) of the confounder
- e.g., Compare training effects separately for new vs experienced employees

#### Method 3: Statistical Adjustment

- Include confounders in regression model
- Requires measuring all relevant confounders
- Can never be 100% certain all confounders are included

#### Method 4: Matching

- Match cases and controls on confounding variables
- e.g., For each trained worker, find an untrained worker with same experience

---

### Confounding Detection

| Indicator | What to Look For |
|-----------|------------------|
| Coefficient Change | Adding variable changes other coefficients by >10% |
| Sign Reversal | Coefficient flips sign when confounder is added |
| Domain Knowledge | Known causal relationships suggest confounding |
| Stratified Analysis | Effect direction differs within strata |

---

## Part 3: Aliasing in DOE

### What is Aliasing?

In fractional factorial designs, aliasing occurs when effects are mathematically confounded—you cannot separate them because they share the same pattern in the design.

```
If A is aliased with BC:
When you estimate "Effect A," you're actually estimating A + BC combined
```

---

### Why Aliasing Happens

Full factorial designs estimate all effects independently:

- 2³ = 8 runs for 3 factors → Can estimate A, B, C, AB, AC, BC, ABC

Fractional factorials use fewer runs:

- 2³⁻¹ = 4 runs for 3 factors → Some effects are confounded

**The trade-off:** Fewer runs = More aliasing

---

### Resolution and Aliasing Structure

| Resolution | Main Effects | 2-Factor Interactions | Aliasing Pattern |
|------------|--------------|----------------------|------------------|
| III | Aliased with 2FI | Aliased with main effects | A = BC |
| IV | Clear | Aliased with other 2FI | AB = CD |
| V | Clear | Clear | ABC = DEF |
| Full | Clear | Clear | All estimable |

---

### Example: Resolution III Design (2³⁻¹ = 4 runs)

**Design Matrix:**

| Run | A | B | C = AB |
|-----|---|---|--------|
| 1 | - | - | + |
| 2 | + | - | - |
| 3 | - | + | - |
| 4 | + | + | + |

**Aliasing Structure:**

```
A = BC
B = AC  
C = AB
```

**Problem:** If your analysis shows "A has a significant effect," you don't know if it's:

1. Factor A (main effect), OR
2. B×C interaction, OR
3. Some combination of both!

---

### Example: Resolution IV Design (2⁴⁻¹ = 8 runs)

**Aliasing Structure:**

```
A = BCD      (Main effects aliased with 3-factor interactions - usually negligible)
B = ACD
C = ABD
D = ABC
AB = CD      (2-factor interactions aliased with other 2-factor interactions!)
AC = BD
AD = BC
```

**Key Issue:** If AB is significant, you don't know if it's the Temperature×Pressure interaction or the Time×Catalyst interaction!

---

### Foldover Designs: Breaking Aliases

To de-alias effects, you can add a **foldover** (mirror runs with all signs reversed):

**Original 2⁴⁻¹ with generator D = ABC:**

| A | B | C | D |
|---|---|---|---|
| - | - | - | - |
| + | - | - | + |
| - | + | - | + |
| + | + | - | - |
| - | - | + | + |
| + | - | + | - |
| - | + | + | - |
| + | + | + | + |

**Foldover (reverse D signs):**
Add 8 more runs with D = -ABC → Now have full 2⁴ = 16 runs

**Result:** All 2-factor interactions are now de-aliased!

---

### DOE Aliasing Traps

#### Trap 1: Ignoring Aliasing in Interpretation

**Wrong:** "Factor A is the most important variable"
**Right:** "The A main effect or the BC interaction appears significant. We need confirmation runs to distinguish them."

#### Trap 2: Assuming Interactions Don't Exist

**Common assumption:** "We'll use Resolution III because interactions are negligible"
**Reality:** Interactions are often significant in manufacturing!
**Rule of thumb:** Use at least Resolution IV for important screening studies

#### Trap 3: Not Checking the Alias Structure

**Before running DOE:** Always print the alias structure in Minitab

- Stat → DOE → Factorial → Create Factorial Design
- After design: Display Design → Alias Structure

---

### Reading Alias Structures in Minitab

**Minitab Output Example:**

```
Alias Structure (up to order 3)

I + ABCD

A + BCD
B + ACD
C + ABD
D + ABC

AB + CD
AC + BD
AD + BC

ABC + D
ABD + C
ACD + B
BCD + A
```

**How to read it:**

- `I + ABCD` is the **defining relation** (identity generator)
- Main effects (A, B, C, D) are aliased with 3-way interactions
- 2-way interactions are aliased in pairs (AB+CD, etc.)

---

### Choosing the Right Resolution

| Situation | Minimum Resolution | Runs for k Factors |
|-----------|-------------------|-------------------|
| Initial screening, many factors | III | 2^(k-p) ≥ k+1 |
| Important screening, need main effects | IV | More runs |
| Need to estimate 2FI | V | More runs |
| Need all effects | Full | 2^k runs |

---

## Part 4: Combined Trap Scenarios

### Scenario 1: The Suspicious Coefficient

**You run a regression and get:**

```
Downtime = 50 - 2.3(Maintenance) + 0.8(Machine Age)
                 ↑ This seems wrong!
```

**Analysis Steps:**

1. ❓ Does less maintenance really mean less downtime?
2. ✓ Check VIF: Maintenance VIF = 1.2 (OK)
3. ⚠️ Possible confound: Old machines get MORE maintenance because they break more!
4. ✓ Add Machine Age × Maintenance interaction
5. 📊 Re-analyze with stratification by machine age

**Result:** Within machine age groups, maintenance DOES reduce downtime. The negative coefficient was due to confounding.

---

### Scenario 2: The Misleading DOE

**2⁴⁻¹ factorial shows Factor A is significant (p=0.001)**

**Before celebrating:**

1. Check alias structure: A is aliased with BCD
2. Ask: Is a 3-way interaction plausible?
3. If uncertain: Run confirmation experiment changing only A
4. If A alone affects response: Probably A's main effect
5. If no effect: It was the BCD interaction!

---

### Scenario 3: The Flip-Flopping Coefficient

**Adding variables changes coefficients dramatically:**

```
Model 1: Y = 10 + 5X₁
Model 2: Y = 10 + 2X₁ + 4X₂
Model 3: Y = 10 - 1X₁ + 4X₂ + 3X₃   ← X₁ flipped negative!
```

**Investigation:**

1. Check correlation: r(X₁, X₃) = 0.85 → Collinear!
2. Check VIF in Model 3: VIF(X₁) = 8.2, VIF(X₃) = 7.8
3. Decide: Keep X₁ or X₃, not both
4. Alternative: Create composite variable X₁₃ = (X₁ + X₃)/2

---

## Summary: Prevention and Detection

### Before Analysis

- [ ] List potential confounders from domain knowledge
- [ ] Plan DOE with adequate resolution
- [ ] Check correlation matrix of predictors
- [ ] Ensure randomization where possible

### During Analysis

- [ ] Calculate VIF for all predictors
- [ ] Check alias structure for DOE
- [ ] Plot residuals vs fitted and vs each X
- [ ] Test sensitivity by adding/removing variables

### Interpretation Red Flags

| Flag | Possible Cause | Action |
|------|---------------|--------|
| Sign opposite to theory | Confounding or collinearity | Investigate relationships |
| Large coefficient change when adding var | Confounding | Include or stratify |
| VIF > 10 | Multicollinearity | Remove or combine variables |
| Interactions significant | Aliased effects (DOE) | Run confirmation experiment |
| |t| > 2 but wrong sign | Model misspecification | Check functional form |

### Reporting Guidelines

1. Always report alias structure with DOE results
2. Note any confounding concerns
3. State which confounders were controlled
4. Acknowledge limitations in causal interpretation
5. Recommend confirmation experiments when uncertain
