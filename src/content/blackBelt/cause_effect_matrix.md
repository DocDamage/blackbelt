# Cause-and-Effect Matrix (C&E Matrix / X-Y Matrix)

## Overview

The Cause-and-Effect Matrix mathematically calculates the relationship between process input variables (causes/Xs) and key customer outcomes (effects/Ys). It helps teams objectively identify which inputs have the most significant influence, allowing them to focus improvement efforts and limited resources on the most critical areas.

---

## How the Matrix Works

### Step 1: List Customer Outputs (Ys)

Identify the key process outputs or customer Critical-to-Quality (CTQ) characteristics.

**Examples of Outputs (Ys):**

- Delivery time
- Product quality score
- Customer satisfaction rating
- Defect rate
- Cost per unit

### Step 2: Weight Customer Importance (1-10)

Assign a weighting to each output based on its importance to the customer.

| Weight | Meaning |
|--------|---------|
| 1-3 | Low importance |
| 4-6 | Moderate importance |
| 7-9 | High importance |
| 10 | Critical to customer |

### Step 3: List Process Inputs (Xs)

Identify and list the potential process input variables (causes) that may affect the outputs.

**Examples of Inputs (Xs):**

- Machine speed settings
- Raw material supplier
- Operator training level
- Temperature settings
- Inspection frequency

### Step 4: Determine Correlation Scores

Score the cause-and-effect relationship between each input (X) and output (Y) using a standard scale:

| Score | Relationship |
|-------|--------------|
| 0 | No relationship |
| 1 | Low/weak correlation |
| 3 | Moderate correlation |
| 9 | High/strong correlation |

### Step 5: Calculate Total Weighted Scores

```
Cell Score = Customer Importance × Correlation Score
Row Total = Sum of all cell scores for that input
```

### Step 6: Prioritize Inputs

Rank inputs by their total scores. The highest-scoring inputs are the **Key Process Input Variables (KPIVs)** that require further analysis (often via FMEA).

---

## Example C&E Matrix

|  | **Output Y1** | **Output Y2** | **Output Y3** | **Total** |
|--|---------------|---------------|---------------|-----------|
| **Customer Importance** | **9** | **7** | **5** | |
| **Input X1: Machine Speed** | 9 | 3 | 1 | 9×9 + 7×3 + 5×1 = **107** |
| **Input X2: Temperature** | 3 | 9 | 3 | 9×3 + 7×9 + 5×3 = **105** |
| **Input X3: Material Type** | 1 | 3 | 9 | 9×1 + 7×3 + 5×9 = **75** |
| **Input X4: Operator Skill** | 3 | 1 | 1 | 9×3 + 7×1 + 5×1 = **39** |

**Result:** Focus on Machine Speed (107) and Temperature (105) as KPIVs.

---

## Excel Template Formula

### Cell Score Formula

```excel
=CustomerImportance * CorrelationScore
```

### Row Total Formula

```excel
=SUMPRODUCT(ImportanceRow, CorrelationRow)
```

### Example Excel Setup

```
     |   A        |    B     |    C     |    D     |    E
-----|------------|----------|----------|----------|----------
  1  | Output     | Y1       | Y2       | Y3       | TOTAL
  2  | Importance | 9        | 7        | 5        |
  3  | X1: Speed  | 9        | 3        | 1        | =SUMPRODUCT($B$2:$D$2,B3:D3)
  4  | X2: Temp   | 3        | 9        | 3        | =SUMPRODUCT($B$2:$D$2,B4:D4)
  5  | X3: Material| 1       | 3        | 9        | =SUMPRODUCT($B$2:$D$2,B5:D5)
```

---

## Connection to Other Six Sigma Tools

### C&E Matrix → FMEA

The KPIVs identified in the C&E Matrix become the focus of the FMEA:

1. Top-scored Xs from C&E Matrix are analyzed for failure modes
2. Each failure mode gets RPN (Risk Priority Number)
3. Further prioritization for control actions

### C&E Matrix → DOE

High-impact Xs identified can become factors in a DOE:

1. Select top 3-5 KPIVs as experimental factors
2. Design factorial experiment
3. Quantify effects and interactions

### C&E Matrix → Control Plan

KPIVs are monitored in the Control phase:

1. Establish control limits for key Xs
2. Define monitoring frequency
3. Set response plans for out-of-control conditions

---

## Best Practices

### Do's ✅

- Include cross-functional team in scoring
- Use customer data to weight Ys
- Be consistent with correlation scale
- Document scoring rationale
- Update matrix as process knowledge grows

### Don'ts ❌

- Don't score alone (use team consensus)
- Don't skip low-scoring Xs entirely (may need verification)
- Don't confuse correlation with causation
- Don't forget to validate KPIVs with data

---

## Quick Reference: Scoring Guidelines

### Customer Importance (1-10)

| Score | Criteria |
|-------|----------|
| 10 | Customer explicitly requires, contractual |
| 8-9 | Critical to customer satisfaction |
| 6-7 | Important but not critical |
| 4-5 | Moderate importance |
| 1-3 | Nice to have, low priority |

### Correlation Score (0, 1, 3, 9)

| Score | Criteria |
|-------|----------|
| 9 | Direct cause-effect relationship, strong data supports |
| 3 | Moderate relationship, some data supports |
| 1 | Weak or possible relationship |
| 0 | No known relationship |

---

## KPIV Selection Criteria

After calculating totals, select KPIVs using these guidelines:

1. **Pareto Principle**: Focus on top 20% of Xs (vital few)
2. **Score Threshold**: Typically select Xs with scores > 50% of max possible
3. **Practical Limit**: Usually 5-8 KPIVs for manageable focus
4. **Validation Required**: Confirm with data before final selection

---

## Common Mistakes to Avoid

1. **Inflating Scores**: Tendency to score everything high - use 9 sparingly
2. **Missing Xs**: Not considering all potential inputs
3. **Importance Bias**: Weighting outputs equally when customer doesn't
4. **No Verification**: Accepting matrix results without data validation
5. **Static Analysis**: Not updating matrix as knowledge improves
