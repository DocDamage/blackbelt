/**
 * Interactive Statistical Calculators
 * 
 * Real-time calculations for Six Sigma and quality metrics.
 */

export interface CalculationResult {
  result: string;
  interpretation: string;
  details?: Record<string, number | string>;
}

/**
 * Calculate Process Capability (Cp, Cpk, Cpu, Cpl)
 */
export function calculateCpk(
  mean: number,
  usl: number,
  lsl: number,
  stdDev: number
): CalculationResult {
  const cpu = (usl - mean) / (3 * stdDev);
  const cpl = (mean - lsl) / (3 * stdDev);
  const cpk = Math.min(cpu, cpl);
  const cp = (usl - lsl) / (6 * stdDev);
  
  // Calculate DPMO approximation
  const z = 3 * cpk;
  const dpmo = Math.round(1000000 * (1 - normalCDF(z)));
  
  let interpretation: string;
  let rating: string;
  
  if (cpk < 1.0) {
    rating = '🔴 NOT CAPABLE';
    interpretation = 'Process produces defects. Immediate improvement needed.';
  } else if (cpk < 1.33) {
    rating = '🟡 MARGINALLY CAPABLE';
    interpretation = 'Process barely meets requirements. Monitor closely.';
  } else if (cpk < 1.67) {
    rating = '🟢 CAPABLE';
    interpretation = 'Process meets requirements. Standard for most industries.';
  } else if (cpk < 2.0) {
    rating = '🔵 HIGHLY CAPABLE';
    interpretation = 'Excellent process performance.';
  } else {
    rating = '⭐ SIX SIGMA';
    interpretation = 'World-class performance (3.4 DPMO).';
  }
  
  return {
    result: `**${rating}**

**Cpk = ${cpk.toFixed(2)}**
• Cp (potential) = ${cp.toFixed(2)}
• Cpu (upper) = ${cpu.toFixed(2)}
• Cpl (lower) = ${cpl.toFixed(2)}

**Estimated Performance:**
• DPMO ≈ ${dpmo.toLocaleString()}
• Yield ≈ ${((1 - dpmo / 1000000) * 100).toFixed(2)}%
• Sigma Level ≈ ${(3 * cpk).toFixed(2)}σ`,
    interpretation,
    details: { cpk, cp, cpu, cpl, dpmo, z: 3 * cpk }
  };
}

/**
 * Calculate Sample Size for Mean Estimation
 */
export function calculateSampleSizeMean(
  confidence: number,
  margin: number,
  stdDev: number
): CalculationResult {
  const zScores: Record<number, number> = {
    90: 1.645,
    95: 1.96,
    99: 2.576
  };
  
  const z = zScores[confidence] || 1.96;
  const n = Math.ceil((Math.pow(z * stdDev, 2)) / Math.pow(margin, 2));
  
  return {
    result: `**Sample Size = ${n}**

**Parameters:**
• Confidence Level: ${confidence}%
• Margin of Error: ±${margin}
• Standard Deviation: ${stdDev}
• Z-Score: ${z}

**Formula Used:**
n = (Z² × σ²) / E²
n = (${z}² × ${stdDev}²) / ${margin}²
n = ${n}`,
    interpretation: n >= 30 
      ? 'Sample size adequate for normal distribution assumption.'
      : 'Sample size small. Consider increasing or using t-distribution.',
    details: { n, z, confidence, margin, stdDev }
  };
}

/**
 * Calculate Sample Size for Proportion
 */
export function calculateSampleSizeProportion(
  confidence: number,
  margin: number,
  p: number = 0.5
): CalculationResult {
  const zScores: Record<number, number> = {
    90: 1.645,
    95: 1.96,
    99: 2.576
  };
  
  const z = zScores[confidence] || 1.96;
  const n = Math.ceil((Math.pow(z, 2) * p * (1 - p)) / Math.pow(margin, 2));
  
  return {
    result: `**Sample Size = ${n}**

**Parameters:**
• Confidence Level: ${confidence}%
• Margin of Error: ±${(margin * 100).toFixed(1)}%
• Estimated Proportion: ${(p * 100).toFixed(0)}%
• Z-Score: ${z}

**Formula Used:**
n = Z² × p × (1-p) / E²
n = ${z}² × ${p} × ${1-p} / ${margin}²
n = ${n}`,
    interpretation: `Using ${(p * 100).toFixed(0)}% estimated proportion (conservative estimate). If proportion is known, use actual value to reduce sample size.`,
    details: { n, z, p, confidence, margin }
  };
}

/**
 * Calculate Gage R&R (%Study Var)
 */
export function calculateGageRR(
  partVariation: number,
  appraiserVariation: number,
  equipmentVariation: number
): CalculationResult {
  const grr = Math.sqrt(Math.pow(appraiserVariation, 2) + Math.pow(equipmentVariation, 2));
  const total = Math.sqrt(Math.pow(grr, 2) + Math.pow(partVariation, 2));
  const percentStudyVar = (grr / total) * 100;
  
  // Calculate NDC
  const ndc = Math.floor(1.41 * (partVariation / grr));
  
  let rating: string;
  let interpretation: string;
  
  if (percentStudyVar < 10) {
    rating = '✅ ACCEPTABLE';
    interpretation = 'Measurement system acceptable for all applications.';
  } else if (percentStudyVar < 30) {
    rating = '⚠️ CONDITIONAL';
    interpretation = 'Acceptable depending on application, cost, and importance.';
  } else {
    rating = '❌ UNACCEPTABLE';
    interpretation = 'Measurement system needs improvement before use.';
  }
  
  return {
    result: `**${rating}**

**Gage R&R = ${percentStudyVar.toFixed(1)}%**
• Equipment (Repeatability): ${equipmentVariation.toFixed(3)}
• Appraiser (Reproducibility): ${appraiserVariation.toFixed(3)}
• Part Variation: ${partVariation.toFixed(3)}
• Total Variation: ${total.toFixed(3)}

**Number of Distinct Categories (NDC) = ${ndc}**
${ndc >= 5 ? '✅ Adequate discrimination' : '❌ Cannot adequately distinguish parts'}`,
    interpretation,
    details: { grr, percentStudyVar, ndc, total }
  };
}

/**
 * Sigma Level to DPMO Conversion
 */
export function sigmaToDpmo(sigma: number): CalculationResult {
  // Using 1.5 sigma shift
  const dpmo = Math.round(1000000 * (1 - normalCDF(sigma - 1.5)));
  const processYield = ((1 - dpmo / 1000000) * 100).toFixed(4);
  
  let level: string;
  switch (Math.floor(sigma)) {
    case 6: level = 'Six Sigma'; break;
    case 5: level = 'Five Sigma'; break;
    case 4: level = 'Four Sigma'; break;
    case 3: level = 'Three Sigma'; break;
    case 2: level = 'Two Sigma'; break;
    default: level = `${sigma.toFixed(1)} Sigma`;
  }
  
  return {
    result: `**${level} Performance**

**Sigma Level:** ${sigma.toFixed(2)}σ
**DPMO:** ${dpmo.toLocaleString()}
**Yield:** ${processYield}%

**Benchmarks:**
• 6σ = 3.4 DPMO (99.99966%)
• 5σ = 233 DPMO (99.977%)
• 4σ = 6,210 DPMO (99.38%)
• 3σ = 66,807 DPMO (93.3%)
• 2σ = 308,538 DPMO (69.1%)`,
    interpretation: '',
    details: { sigma, dpmo, yield: parseFloat(processYield) }
  };
}

/**
 * Cost of Poor Quality (COPQ) Calculator
 */
export function calculateCopq(
  appraisalCosts: number,
  internalFailureCosts: number,
  externalFailureCosts: number,
  preventionCosts: number,
  totalSales: number
): CalculationResult {
  const totalCopq = appraisalCosts + internalFailureCosts + externalFailureCosts;
  const totalQualityCosts = totalCopq + preventionCosts;
  const copqPercent = (totalCopq / totalSales) * 100;
  
  // Rule of thumb: COPQ typically 10-30% of sales in poor organizations
  // Best in class: <10%
  
  let benchmark: string;
  if (copqPercent < 10) {
    benchmark = '🏆 World Class';
  } else if (copqPercent < 15) {
    benchmark = '✅ Industry Average';
  } else if (copqPercent < 25) {
    benchmark = '⚠️ Above Average - Improvement Needed';
  } else {
    benchmark = '🔴 High - Urgent Action Required';
  }
  
  return {
    result: `**Cost of Poor Quality Analysis**

${benchmark}

**Total COPQ: $${totalCopq.toLocaleString()} (${copqPercent.toFixed(1)}% of sales)**

**Breakdown:**
• Appraisal Costs: $${appraisalCosts.toLocaleString()} (${((appraisalCosts/totalCopq)*100).toFixed(1)}%)
• Internal Failure: $${internalFailureCosts.toLocaleString()} (${((internalFailureCosts/totalCopq)*100).toFixed(1)}%)
• External Failure: $${externalFailureCosts.toLocaleString()} (${((externalFailureCosts/totalCopq)*100).toFixed(1)}%)
• Prevention Costs: $${preventionCosts.toLocaleString()} (not in COPQ)

**Total Quality Costs: $${totalQualityCosts.toLocaleString()}**

**Benchmarks:**
• World Class: <10% of sales
• Industry Average: 10-15%
• Needs Improvement: 15-25%
• Crisis Level: >25%`,
    interpretation: externalFailureCosts > internalFailureCosts 
      ? 'External failures exceed internal failures. Focus on early detection.'
      : 'Good detection of defects before they reach customers.',
    details: { totalCopq, copqPercent, totalQualityCosts }
  };
}

/**
 * Control Chart Constants
 */
export function getControlChartConstants(subgroupSize: number): Record<string, number> {
  const constants: Record<number, Record<string, number>> = {
    2: { A2: 1.880, A3: 2.659, d2: 1.128, D3: 0, D4: 3.267, B3: 0, B4: 3.267 },
    3: { A2: 1.023, A3: 1.954, d2: 1.693, D3: 0, D4: 2.574, B3: 0, B4: 2.568 },
    4: { A2: 0.729, A3: 1.628, d2: 2.059, D3: 0, D4: 2.282, B3: 0, B4: 2.266 },
    5: { A2: 0.577, A3: 1.427, d2: 2.326, D3: 0, D4: 2.114, B3: 0, B4: 2.089 },
    6: { A2: 0.483, A3: 1.287, d2: 2.534, D3: 0, D4: 2.004, B3: 0.030, B4: 1.970 },
    7: { A2: 0.419, A3: 1.182, d2: 2.704, D3: 0.076, D4: 1.924, B3: 0.118, B4: 1.882 },
    8: { A2: 0.373, A3: 1.099, d2: 2.847, D3: 0.136, D4: 1.864, B3: 0.185, B4: 1.815 },
    9: { A2: 0.337, A3: 1.032, d2: 2.970, D3: 0.184, D4: 1.816, B3: 0.239, B4: 1.761 },
    10: { A2: 0.308, A3: 0.975, d2: 3.078, D3: 0.223, D4: 1.777, B3: 0.284, B4: 1.716 }
  };
  
  return constants[subgroupSize] || constants[5] || { A2: 0.577, A3: 1.427, d2: 2.326, D3: 0, D4: 2.114, B3: 0, B4: 2.089 };
}

/**
 * Normal CDF approximation
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1 + sign * y);
}

/**
 * ANOVA (Analysis of Variance) Calculator
 * One-way ANOVA for comparing means across multiple groups
 */
export function calculateAnova(groupData: number[][]): CalculationResult {
  const k = groupData.length; // Number of groups
  const n = groupData.flat().length; // Total observations
  
  // Calculate group means and overall mean
  const groupMeans = groupData.map(group => 
    group.reduce((a, b) => a + b, 0) / group.length
  );
  const allData = groupData.flat();
  const overallMean = allData.reduce((a, b) => a + b, 0) / allData.length;
  
  // Calculate Sum of Squares
  const SSB = groupData.reduce((sum, group, i) => {
    const groupMean = groupMeans[i];
    if (groupMean === undefined) return sum;
    return sum + group.length * Math.pow(groupMean - overallMean, 2);
  }, 0); // Between groups
  
  const SSW = groupData.reduce((sum, group, i) => {
    const groupMean = groupMeans[i];
    if (groupMean === undefined) return sum;
    return sum + group.reduce((s, x) => s + Math.pow(x - groupMean, 2), 0);
  }, 0); // Within groups
  
  const SST = SSB + SSW; // Total
  
  // Degrees of freedom
  const dfB = k - 1;
  const dfW = n - k;
  const dfT = n - 1;
  
  // Mean Squares
  const MSB = SSB / dfB;
  const MSW = SSW / dfW;
  
  // F-statistic
  const F = MSB / MSW;
  
  // R-squared (effect size)
  const rSquared = SSB / SST;
  
  return {
    result: `**One-Way ANOVA Results**

**Groups:** ${k}
**Total Observations:** ${n}

**Sum of Squares:**
• Between Groups (SSB): ${SSB.toFixed(3)}
• Within Groups (SSW): ${SSW.toFixed(3)}
• Total (SST): ${SST.toFixed(3)}

**Degrees of Freedom:**
• Between: ${dfB}
• Within: ${dfW}
• Total: ${dfT}

**Mean Squares:**
• Between (MSB): ${MSB.toFixed(3)}
• Within (MSW): ${MSW.toFixed(3)}

**F-Statistic:** ${F.toFixed(3)}

**Effect Size (η²):** ${(rSquared * 100).toFixed(1)}%

**Interpretation:**
• Compare F to critical value from F-table
• F(${dfB}, ${dfW}) > F-critical → Significant difference between groups
• η² > 0.14 = large effect, > 0.06 = medium, > 0.01 = small`,
    interpretation: F > 4 ? 'Significant differences likely between group means' : 'Groups may not differ significantly',
    details: { F, dfB, dfW, SSB, SSW, MSB, MSW, rSquared }
  };
}

/**
 * Linear Regression Calculator
 * Simple linear regression: y = mx + b
 */
export function calculateRegression(x: number[], y: number[]): CalculationResult {
  const n = x.length;
  
  if (n === 0 || y.length === 0 || n !== y.length) {
    return {
      result: '**Error:** X and Y arrays must have the same length and contain data.',
      interpretation: 'Invalid input data',
      details: {}
    };
  }
  
  // Calculate means
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  
  // Calculate slope (m) and intercept (b)
  const numerator = x.reduce((sum, xi, i) => {
    const yi = y[i];
    if (yi === undefined) return sum;
    return sum + (xi - meanX) * (yi - meanY);
  }, 0);
  const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0);
  
  if (denominator === 0) {
    return {
      result: '**Error:** Cannot calculate regression - all X values are identical.',
      interpretation: 'Zero variance in X values',
      details: {}
    };
  }
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  
  // Calculate R-squared
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
  const ssResidual = y.reduce((sum, yi, i) => {
    const xi = x[i];
    if (xi === undefined) return sum;
    return sum + Math.pow(yi - (intercept + slope * xi), 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);
  const r = Math.sign(slope) * Math.sqrt(rSquared);
  
  // Standard error
  const mse = ssResidual / (n - 2);
  const seSlope = Math.sqrt(mse / denominator);
  const seIntercept = Math.sqrt(mse * (1/n + Math.pow(meanX, 2)/denominator));
  
  // Example prediction
  const exampleX = meanX;
  const predictedY = intercept + slope * exampleX;
  
  return {
    result: `**Linear Regression Results**

**Equation:** y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}

**Coefficients:**
• Slope (m): ${slope.toFixed(4)} ± ${seSlope.toFixed(4)}
• Intercept (b): ${intercept.toFixed(4)} ± ${seIntercept.toFixed(4)}

**Model Fit:**
• R² (R-squared): ${(rSquared * 100).toFixed(1)}%
• Correlation (r): ${r.toFixed(3)}
• Standard Error: ${Math.sqrt(mse).toFixed(4)}

**Interpretation:**
• Slope: For every 1 unit increase in x, y ${slope > 0 ? 'increases' : 'decreases'} by ${Math.abs(slope).toFixed(4)} units
• R²: Model explains ${(rSquared * 100).toFixed(1)}% of variance in y
• Correlation: ${Math.abs(r) > 0.7 ? 'Strong' : Math.abs(r) > 0.5 ? 'Moderate' : 'Weak'} ${r > 0 ? 'positive' : 'negative'} relationship

**Example Prediction:**
At x = ${exampleX.toFixed(2)}, predicted y = ${predictedY.toFixed(4)}`,
    interpretation: rSquared > 0.7 ? 'Strong predictive model' : rSquared > 0.5 ? 'Moderate predictive power' : 'Weak model - consider other factors',
    details: { slope, intercept, rSquared, r, seSlope, seIntercept }
  };
}

/**
 * Gage R&R (Repeatability and Reproducibility) Calculator
 * ANOVA Method for measurement system analysis
 */
export function calculateGageRr(
  measurements: number[][][], // [parts][operators][trials]
  tolerance: number
): CalculationResult {
  const numParts = measurements.length;
  const numOperators = measurements[0]?.length || 0;
  const numTrials = measurements[0]?.[0]?.length || 0;
  
  // Validate data
  if (numParts === 0 || numOperators === 0 || numTrials === 0) {
    return {
      result: '**Error:** Invalid measurement data. Please provide data in format [parts][operators][trials].',
      interpretation: 'No valid measurements provided',
      details: {}
    };
  }
  
  // Calculate means
  const partMeans: number[] = [];
  const operatorMeans: number[] = [];
  
  for (let p = 0; p < numParts; p++) {
    const partData = measurements[p];
    if (!partData) continue;
    let partSum = 0;
    let partCount = 0;
    for (let o = 0; o < numOperators; o++) {
      const opData = partData[o];
      if (!opData) continue;
      for (let t = 0; t < numTrials; t++) {
        const val = opData[t];
        if (val !== undefined) {
          partSum += val;
          partCount++;
        }
      }
    }
    if (partCount > 0) {
      partMeans.push(partSum / partCount);
    }
  }
  
  for (let o = 0; o < numOperators; o++) {
    let opSum = 0;
    let opCount = 0;
    for (let p = 0; p < numParts; p++) {
      const partData = measurements[p];
      if (!partData) continue;
      const opData = partData[o];
      if (!opData) continue;
      for (let t = 0; t < numTrials; t++) {
        const val = opData[t];
        if (val !== undefined) {
          opSum += val;
          opCount++;
        }
      }
    }
    if (opCount > 0) {
      operatorMeans.push(opSum / opCount);
    }
  }
  
  // Calculate variance components (simplified)
  const allMeasurements = measurements.flat(2).filter((v): v is number => v !== undefined);
  if (allMeasurements.length === 0) {
    return {
      result: '**Error:** No valid measurements found.',
      interpretation: 'Empty measurement data',
      details: {}
    };
  }
  const grandMean = allMeasurements.reduce((a, b) => a + b, 0) / allMeasurements.length;
  
  // Repeatability (Equipment Variation)
  let repeatabilitySum = 0;
  let repeatabilityCount = 0;
  for (let p = 0; p < numParts; p++) {
    const partData = measurements[p];
    if (!partData) continue;
    for (let o = 0; o < numOperators; o++) {
      const trials = partData[o];
      if (!trials || trials.length === 0) continue;
      const trialMean = trials.reduce((a, b) => a + (b || 0), 0) / trials.length;
      trials.forEach(m => {
        if (m !== undefined) {
          repeatabilitySum += Math.pow(m - trialMean, 2);
          repeatabilityCount++;
        }
      });
    }
  }
  const EV = repeatabilityCount > 0 ? Math.sqrt(repeatabilitySum / repeatabilityCount) : 0;
  
  // Reproducibility (Appraiser Variation) - simplified
  let reproducibilitySum = 0;
  operatorMeans.forEach(opMean => {
    reproducibilitySum += Math.pow(opMean - grandMean, 2);
  });
  const AV = Math.sqrt(reproducibilitySum / (numOperators - 1));
  
  // Gage R&R
  const GRR = Math.sqrt(Math.pow(EV, 2) + Math.pow(AV, 2));
  
  // Part variation (simplified)
  let partSum = 0;
  partMeans.forEach(partMean => {
    partSum += Math.pow(partMean - grandMean, 2);
  });
  const PV = Math.sqrt(partSum / (numParts - 1));
  
  // Total variation
  const TV = Math.sqrt(Math.pow(GRR, 2) + Math.pow(PV, 2));
  
  // % of tolerance
  const pctTolerance = (6 * GRR / tolerance) * 100;
  
  // % contribution
  const pctGRR = (Math.pow(GRR, 2) / Math.pow(TV, 2)) * 100;
  const pctEV = (Math.pow(EV, 2) / Math.pow(TV, 2)) * 100;
  const pctAV = (Math.pow(AV, 2) / Math.pow(TV, 2)) * 100;
  const pctPV = (Math.pow(PV, 2) / Math.pow(TV, 2)) * 100;
  
  // AIAG Criteria
  let acceptability: string;
  if (pctTolerance < 10) {
    acceptability = '✅ ACCEPTABLE - Gage system is acceptable';
  } else if (pctTolerance < 30) {
    acceptability = '⚠️ MARGINAL - May be acceptable depending on application';
  } else {
    acceptability = '❌ UNACCEPTABLE - Gage system needs improvement';
  }
  
  return {
    result: `**Gage R&R Study Results (ANOVA Method)**

**Study Design:**
• Parts: ${numParts}
• Operators: ${numOperators}
• Trials: ${numTrials}
• Tolerance: ±${tolerance/2}

**Standard Deviations:**
• Equipment Variation (EV): ${EV.toFixed(4)}
• Appraiser Variation (AV): ${AV.toFixed(4)}
• Gage R&R (GRR): ${GRR.toFixed(4)}
• Part Variation (PV): ${PV.toFixed(4)}
• Total Variation (TV): ${TV.toFixed(4)}

**% of Tolerance (6σ):**
• GRR: ${pctTolerance.toFixed(1)}%
${acceptability}

**% Contribution to Variance:**
• Repeatability (EV): ${pctEV.toFixed(1)}%
• Reproducibility (AV): ${pctAV.toFixed(1)}%
• GRR Total: ${pctGRR.toFixed(1)}%
• Part-to-Part (PV): ${pctPV.toFixed(1)}%

**AIAG Criteria (% of Tolerance):**
• < 10%: Acceptable
• 10-30%: Marginal
• > 30%: Unacceptable

**Next Steps:**
${pctEV > pctAV ? '• Focus on equipment calibration/procedure' : '• Focus on operator training'}
${pctGRR > 30 ? '• Investigate measurement system improvement' : '• Monitor ongoing performance'}`,
    interpretation: pctTolerance < 10 ? 'Measurement system acceptable' : pctTolerance < 30 ? 'Evaluate for specific application' : 'Improvement required',
    details: { EV, AV, GRR, PV, TV, pctTolerance, pctGRR }
  };
}

/**
 * Parse calculation request from user query
 */
export function parseCalculationRequest(query: string): { type: string; params: number[] } | null {
  const q = query.toLowerCase();
  
  // Cpk calculation
  if (q.includes('cpk') && (q.includes('mean=') || q.includes('usl=') || q.includes('calculate'))) {
    const mean = extractNumber(q, 'mean=') || extractNumber(q, 'mean ');
    const usl = extractNumber(q, 'usl=') || extractNumber(q, 'usl ');
    const lsl = extractNumber(q, 'lsl=') || extractNumber(q, 'lsl ');
    const stdDev = extractNumber(q, 'std=') || extractNumber(q, 'stdev=') || extractNumber(q, 'sigma=');
    
    if (mean && usl && lsl && stdDev) {
      return { type: 'cpk', params: [mean, usl, lsl, stdDev] };
    }
  }
  
  // Sample size
  if (q.includes('sample size') && q.includes('confidence')) {
    const confidence = extractNumber(q, 'confidence=') || extractNumber(q, 'confidence ') || 95;
    const margin = extractNumber(q, 'margin=') || extractNumber(q, 'margin ') || 0.05;
    const stdDev = extractNumber(q, 'std=') || extractNumber(q, 'stdev=');
    
    if (stdDev) {
      return { type: 'sampleSizeMean', params: [confidence, margin, stdDev] };
    }
  }
  
  // Sigma to DPMO
  if (q.includes('sigma') && (q.includes('dpmo') || q.includes('convert'))) {
    const sigma = extractNumber(q, 'sigma=') || extractNumber(q, 'sigma ') || extractNumber(q, 'σ=');
    if (sigma) {
      return { type: 'sigmaDpmo', params: [sigma] };
    }
  }
  
  return null;
}

function extractNumber(text: string, prefix: string): number | null {
  const regex = new RegExp(`${prefix}([\\d.]+)`);
  const match = text.match(regex);
  return match && match[1] ? parseFloat(match[1]) : null;
}
