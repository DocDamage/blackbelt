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
