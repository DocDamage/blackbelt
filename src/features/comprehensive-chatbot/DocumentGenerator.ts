/**
 * Document Generation Utilities
 * 
 * Generate Excel spreadsheets and Word documents from chatbot content.
 * 
 * Technical Debt Fixes:
 * - Issue 59: Dynamic import for xlsx library to reduce initial bundle size
 * - Issue 58: Browser compatibility checks for document downloads
 * - Issue 62: Comprehensive error handling for document generation
 */

// Dynamic import for xlsx to reduce bundle size (Issue 59)
// This splits the xlsx library into a separate chunk that's only loaded when needed
type XLSXType = typeof import('xlsx');

// Cache for the xlsx module to avoid reloading
let xlsxCache: XLSXType | null = null;

/**
 * Dynamically import xlsx library (Issue 59 fix)
 */
async function getXLSX(): Promise<XLSXType> {
  if (xlsxCache) {
    return xlsxCache;
  }
  const xlsx = await import('xlsx');
  xlsxCache = xlsx;
  return xlsx;
}

export interface DocumentOptions {
  title: string;
  fileName: string;
  content: string;
  type: 'excel' | 'word';
}

export interface SpreadsheetData {
  sheetName: string;
  headers: string[];
  rows: (string | number)[][];
  formats?: Record<number, string>; // column index to format
}

/**
 * Result type for document generation (Issue 62 fix)
 */
export interface DocumentResult {
  success: boolean;
  blob?: Blob;
  error?: string;
}

/**
 * Browser compatibility check result (Issue 58 fix)
 */
export interface CompatibilityResult {
  supported: boolean;
  browser: string;
  issues: string[];
  workarounds: string[];
}

/**
 * Check browser compatibility for document downloads (Issue 58 fix)
 */
export function checkBrowserCompatibility(): CompatibilityResult {
  const issues: string[] = [];
  const workarounds: string[] = [];
  
  // Detect browser
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
    browser = 'Chrome';
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browser = 'Safari';
    // Safari on iOS has limited download support
    if (/iPad|iPhone|iPod/.test(ua)) {
      issues.push('iOS Safari has limited download support; files may open in new tab instead of downloading');
      workarounds.push('Use "Share" button to save files on iOS');
      workarounds.push('Consider using a desktop browser for best experience');
    }
  } else if (ua.indexOf('Firefox') > -1) {
    browser = 'Firefox';
  } else if (ua.indexOf('Edg') > -1) {
    browser = 'Edge';
  }
  
  // Check Blob support
  if (typeof Blob === 'undefined') {
    issues.push('Browser does not support Blob API');
    workarounds.push('Please use a modern browser (Chrome, Firefox, Safari, Edge)');
  }
  
  // Check URL.createObjectURL support
  if (typeof URL === 'undefined' || !URL.createObjectURL) {
    issues.push('Browser does not support URL.createObjectURL');
    workarounds.push('Please use a modern browser');
  }
  
  // Check download attribute support
  const a = document.createElement('a');
  if (!('download' in a)) {
    issues.push('Browser does not support download attribute');
    workarounds.push('Right-click and "Save As" when file opens in new tab');
  }
  
  return {
    supported: issues.length === 0 || (issues.length === 1 && browser === 'Safari' && /iPad|iPhone|iPod/.test(ua)),
    browser,
    issues,
    workarounds
  };
}

/**
 * Generate Excel workbook from data
 * Now with async loading and error handling (Issues 59, 62 fixes)
 */
export async function generateExcel(
  sheets: SpreadsheetData[],
  _fileName: string = 'export.xlsx'
): Promise<DocumentResult> {
  try {
    // Validate input
    if (!sheets || sheets.length === 0) {
      return { success: false, error: 'No data provided for spreadsheet generation' };
    }
    
    // Check for memory limits (rough estimate: 100KB per 1000 cells)
    const totalCells = sheets.reduce((sum, sheet) => 
      sum + (sheet.headers.length * sheet.rows.length), 0);
    if (totalCells > 100000) { // ~10MB estimate
      return { 
        success: false, 
        error: 'Data set too large for browser generation. Consider splitting into multiple files or using server-side generation.' 
      };
    }
    
    // Dynamically load xlsx library (Issue 59 fix)
    const XLSX = await getXLSX();
    
    const wb = XLSX.utils.book_new();
    
    sheets.forEach(sheet => {
      // Create worksheet data
      const wsData = [sheet.headers, ...sheet.rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Auto-size columns
      const colWidths = sheet.headers.map((header, colIndex) => {
        const headerLength = header?.length ?? 0;
        const rowLengths = sheet.rows.map(row => {
          const cell = row[colIndex];
          return cell ? String(cell).length : 0;
        });
        const maxLength = Math.max(headerLength, ...rowLengths);
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;
      
      // Add number formatting
      if (sheet.formats) {
        Object.entries(sheet.formats).forEach(([col, fmt]) => {
          const colNum = parseInt(col);
          sheet.rows.forEach((_, rowIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colNum });
            if (ws[cellRef] && fmt) {
              ws[cellRef].z = fmt;
            }
          });
        });
      }
      
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
    });
    
    // Generate blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    
    return { success: true, blob };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during Excel generation';
    console.error('Excel generation failed:', error);
    return { success: false, error: `Failed to generate Excel file: ${errorMessage}` };
  }
}

/**
 * Generate Word document content (HTML format that Word can open)
 */
export function generateWordDocument(
  title: string,
  content: string,
  metadata?: {
    author?: string;
    company?: string;
    date?: string;
  }
): Blob {
  const date = metadata?.date || new Date().toLocaleDateString();
  const author = metadata?.author || 'Six Sigma Assistant';
  const company = metadata?.company || '';
  
  // Convert markdown-style content to HTML
  const htmlContent = convertToHtml(content);
  
  const htmlContent2 = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; }
    h1 { font-size: 16pt; color: #2E5C8A; margin-top: 24pt; margin-bottom: 12pt; }
    h2 { font-size: 14pt; color: #2E5C8A; margin-top: 18pt; margin-bottom: 10pt; }
    h3 { font-size: 12pt; color: #2E5C8A; margin-top: 12pt; margin-bottom: 8pt; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    th, td { border: 1px solid #CCCCCC; padding: 6pt; text-align: left; }
    th { background-color: #F2F2F2; font-weight: bold; }
    ul, ol { margin-left: 24pt; }
    .header { text-align: center; margin-bottom: 24pt; }
    .metadata { font-size: 10pt; color: #666666; margin-bottom: 24pt; }
    .footer { margin-top: 48pt; font-size: 10pt; color: #666666; border-top: 1px solid #CCCCCC; padding-top: 12pt; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <div class="metadata">
      Generated: ${date}<br>
      ${author ? `Author: ${author}<br>` : ''}
      ${company ? `Company: ${company}` : ''}
    </div>
  </div>
  
  ${htmlContent}
  
  <div class="footer">
    <p>This document was generated using the Six Sigma & Compliance Assistant.</p>
    <p>Generated on: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;
  
  return new Blob([htmlContent2], { type: 'application/msword' });
}

/**
 * Convert markdown-style content to HTML
 */
function convertToHtml(content: string): string {
  const html = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\*\*\*(.*?)\*\*\*/gim, '<h2>$1</h2>')
    .replace(/^\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^• (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Tables (simple conversion)
    .replace(/\|(.*)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    // Line breaks
    .replace(/\n/g, '<br>')
    // Clean up extra breaks
    .replace(/<br><br><br>/g, '<br><br>')
    .replace(/<br><\/li>/g, '</li>');
  
  return html;
}

/**
 * Generate Cpk Analysis Spreadsheet
 * Now returns DocumentResult with error handling (Issue 62 fix)
 */
export async function generateCpkSpreadsheet(
  data: {
    processName: string;
    usl: number;
    lsl: number;
    measurements: number[];
  }
): Promise<DocumentResult> {
  try {
    // Validate input
    if (!data.measurements || data.measurements.length < 2) {
      return { success: false, error: 'At least 2 measurements required for Cpk analysis' };
    }
    if (data.usl <= data.lsl) {
      return { success: false, error: 'USL must be greater than LSL' };
    }
    
    // Calculate statistics
    const n = data.measurements.length;
    const mean = data.measurements.reduce((a, b) => a + b, 0) / n;
    const variance = data.measurements.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
    
    if (variance === 0) {
      return { success: false, error: 'All measurements are identical (zero variance)' };
    }
    
    const stdDev = Math.sqrt(variance);
    const cpu = (data.usl - mean) / (3 * stdDev);
    const cpl = (mean - data.lsl) / (3 * stdDev);
    const cpk = Math.min(cpu, cpl);
    const cp = (data.usl - data.lsl) / (6 * stdDev);
    
    const sheets: SpreadsheetData[] = [
      {
        sheetName: 'Summary',
        headers: ['Statistic', 'Value', 'Interpretation'],
        rows: [
          ['Process Name', data.processName, ''],
          ['Sample Size (n)', n, ''],
          ['USL', data.usl, 'Upper Specification Limit'],
          ['LSL', data.lsl, 'Lower Specification Limit'],
          ['Mean', mean.toFixed(4), 'Process average'],
          ['Std Dev', stdDev.toFixed(4), 'Process variation'],
          ['Cp', cp.toFixed(2), 'Process potential'],
          ['Cpk', cpk.toFixed(2), cpk >= 1.33 ? '✅ Capable' : cpk >= 1.0 ? '⚠️ Marginal' : '❌ Not Capable'],
          ['Cpu', cpu.toFixed(2), 'Upper capability'],
          ['Cpl', cpl.toFixed(2), 'Lower capability'],
        ]
      },
      {
        sheetName: 'Measurements',
        headers: ['Sample #', 'Measurement', 'USL', 'LSL', 'Mean', 'Std Dev'],
        rows: data.measurements.map((m, i) => [i + 1, m, data.usl, data.lsl, mean.toFixed(4), stdDev.toFixed(4)]),
        formats: { 1: '0.0000' }
      }
    ];
    
    return generateExcel(sheets, `${data.processName}_Cpk_Analysis.xlsx`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during Cpk calculation';
    return { success: false, error: `Cpk analysis failed: ${errorMessage}` };
  }
}

/**
 * Generate FMEA Spreadsheet
 * Now returns DocumentResult with error handling (Issue 62 fix)
 */
export async function generateFmeaSpreadsheet(
  processName: string,
  failureModes: Array<{
    step: string;
    failureMode: string;
    effect: string;
    cause: string;
    currentControls: string;
    severity: number;
    occurrence: number;
    detection: number;
    recommendedAction: string;
  }>
): Promise<DocumentResult> {
  try {
    if (!failureModes || failureModes.length === 0) {
      return { success: false, error: 'No failure modes provided for FMEA' };
    }
    
    // Validate failure mode data
    for (const fm of failureModes) {
      if (fm.severity < 1 || fm.severity > 10 || fm.occurrence < 1 || fm.occurrence > 10 || fm.detection < 1 || fm.detection > 10) {
        return { success: false, error: 'Severity, Occurrence, and Detection ratings must be between 1 and 10' };
      }
    }
    
    const rows = failureModes.map(fm => [
      fm.step,
      fm.failureMode,
      fm.effect,
      fm.cause,
      fm.currentControls,
      fm.severity,
      fm.occurrence,
      fm.detection,
      fm.severity * fm.occurrence * fm.detection,
      fm.recommendedAction,
      '', // Action taken
      '', // Resp
      '', // Due date
      '', // Sev after
      '', // Occ after
      '', // Det after
      '' // RPN after
    ]);
    
    const sheets: SpreadsheetData[] = [
      {
        sheetName: 'PFMEA',
        headers: [
          'Process Step', 'Failure Mode', 'Effect', 'Potential Cause',
          'Current Controls', 'S', 'O', 'D', 'RPN', 'Recommended Action',
          'Action Taken', 'Resp', 'Due Date', 'S', 'O', 'D', 'RPN'
        ],
        rows
      },
      {
        sheetName: 'Rating Scales',
        headers: ['Rating', 'Severity', 'Occurrence', 'Detection'],
        rows: [
          [1, 'No effect', 'Extremely unlikely', 'Almost certain'],
          [2, 'Very minor', 'Very low', 'Very high'],
          [3, 'Minor', 'Low', 'High'],
          [4, 'Very low', 'Relatively low', 'Moderately high'],
          [5, 'Low', 'Moderate', 'Moderate'],
          [6, 'Moderate', 'Relatively moderate', 'Low'],
          [7, 'High', 'Moderately high', 'Very low'],
          [8, 'Very high', 'High', 'Remote'],
          [9, 'Serious', 'Very high', 'Very remote'],
          [10, 'Hazardous', 'Extremely high', 'Almost impossible']
        ]
      }
    ];
    
    return generateExcel(sheets, `${processName}_PFMEA.xlsx`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during FMEA generation';
    return { success: false, error: `FMEA generation failed: ${errorMessage}` };
  }
}

/**
 * Generate Control Plan Spreadsheet
 * Now returns DocumentResult with error handling (Issue 62 fix)
 */
export async function generateControlPlanSpreadsheet(
  productName: string,
  steps: Array<{
    step: string;
    product: string;
    process: string;
    device: string;
    characteristics: string;
    spec: string;
    method: string;
    sampleSize: string;
    frequency: string;
    reactionPlan: string;
  }>
): Promise<DocumentResult> {
  try {
    if (!steps || steps.length === 0) {
      return { success: false, error: 'No control plan steps provided' };
    }
    
    const sheets: SpreadsheetData[] = [{
      sheetName: 'Control Plan',
      headers: [
        'Process Step', 'Product/Process', 'Process Name/Description',
        'Device', 'Characteristics', 'Specification',
        'Method', 'Sample Size', 'Frequency', 'Reaction Plan'
      ],
      rows: steps.map(s => [
        s.step, s.product, s.process, s.device,
        s.characteristics, s.spec, s.method,
        s.sampleSize, s.frequency, s.reactionPlan
      ])
    }];
    
    return generateExcel(sheets, `${productName}_Control_Plan.xlsx`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during Control Plan generation';
    return { success: false, error: `Control Plan generation failed: ${errorMessage}` };
  }
}

/**
 * Generate Audit Checklist Word Document
 */
export function generateAuditChecklistDocument(
  standard: string,
  checklistItems: Array<{
    clause: string;
    requirement: string;
    evidence: string;
    finding: string;
  }>,
  auditInfo: {
    company: string;
    auditor: string;
    date: string;
    scope: string;
  }
): Blob {
  const content = `
# Internal Audit Report
## ${standard}

**Company:** ${auditInfo.company}
**Auditor:** ${auditInfo.auditor}
**Date:** ${auditInfo.date}
**Scope:** ${auditInfo.scope}

---

## Audit Checklist

${checklistItems.map(item => `
### Clause ${item.clause}

**Requirement:** ${item.requirement}

**Evidence Reviewed:** ${item.evidence}

**Finding:** ${item.finding || 'To be completed during audit'}

---
`).join('\n')}

## Summary

**Total Items Audited:** ${checklistItems.length}
**Non-Conformances:** [To be counted]
**Observations:** [To be counted]
**Opportunities for Improvement:** [To be counted]

## Corrective Actions Required

| Item | Description | Responsible | Due Date | Status |
|------|-------------|-------------|----------|--------|
| | | | | |

**Next Audit Date:** ___________
`;
  
  return generateWordDocument(
    `${standard} Internal Audit Report - ${auditInfo.company}`,
    content,
    {
      author: auditInfo.auditor,
      company: auditInfo.company,
      date: auditInfo.date
    }
  );
}

/**
 * Generate Compliance Matrix Spreadsheet
 * Now returns DocumentResult with error handling (Issue 62 fix)
 */
export async function generateComplianceMatrix(
  regulations: string[],
  requirements: Array<{
    regulation: string;
    clause: string;
    requirement: string;
    applicable: 'Yes' | 'No' | 'Partial';
    evidence: string;
    gap: string;
    action: string;
  }>
): Promise<DocumentResult> {
  try {
    if (!requirements || requirements.length === 0) {
      return { success: false, error: 'No compliance requirements provided' };
    }
    
    const sheets: SpreadsheetData[] = [
      {
        sheetName: 'Compliance Matrix',
        headers: [
          'Regulation', 'Clause', 'Requirement',
          'Applicable', 'Evidence of Compliance', 'Gap Identified', 'Action Required'
        ],
        rows: requirements.map(r => [
          r.regulation, r.clause, r.requirement,
          r.applicable, r.evidence, r.gap, r.action
        ])
      },
      {
        sheetName: 'Summary',
        headers: ['Regulation', 'Total Requirements', 'Applicable', 'Compliant', 'Gaps'],
        rows: regulations.map(reg => {
          const regReqs = requirements.filter(r => r.regulation === reg);
          const applicable = regReqs.filter(r => r.applicable === 'Yes').length;
          const gaps = regReqs.filter(r => r.gap && r.gap.trim() !== '').length;
          return [reg, regReqs.length, applicable, applicable - gaps, gaps];
        })
      }
    ];
    
    return generateExcel(sheets, 'Compliance_Matrix.xlsx');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during Compliance Matrix generation';
    return { success: false, error: `Compliance Matrix generation failed: ${errorMessage}` };
  }
}

/**
 * Generate Supplier Scorecard Spreadsheet
 * Now returns DocumentResult with error handling (Issue 62 fix)
 */
export async function generateSupplierScorecard(
  period: string,
  suppliers: Array<{
    name: string;
    ppm: number;
    otd: number;
    qualityScore: number;
    deliveryScore: number;
    overallScore: number;
    status: string;
  }>
): Promise<DocumentResult> {
  try {
    if (!suppliers || suppliers.length === 0) {
      return { success: false, error: 'No supplier data provided for scorecard' };
    }
    
    const sheets: SpreadsheetData[] = [
      {
        sheetName: 'Scorecard',
        headers: [
          'Supplier', 'PPM', 'On-Time Delivery %',
          'Quality Score', 'Delivery Score', 'Overall Score', 'Status'
        ],
        rows: suppliers.map(s => [
          s.name, s.ppm, `${s.otd}%`,
          s.qualityScore, s.deliveryScore, s.overallScore, s.status
        ])
      },
      {
        sheetName: 'Rating Scale',
        headers: ['Metric', 'Excellent', 'Good', 'Acceptable', 'Needs Improvement'],
        rows: [
          ['PPM', '< 100', '100-500', '500-1000', '> 1000'],
          ['On-Time Delivery', '> 98%', '95-98%', '90-95%', '< 90%'],
          ['Overall Score', '> 90', '80-90', '70-80', '< 70']
        ]
      }
    ];
    
    return generateExcel(sheets, `Supplier_Scorecard_${period}.xlsx`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during Supplier Scorecard generation';
    return { success: false, error: `Supplier Scorecard generation failed: ${errorMessage}` };
  }
}

/**
 * Trigger file download with browser compatibility and error handling
 * Issues 58 & 62: Browser compatibility checks and error handling
 */
export function downloadDocument(blob: Blob, fileName: string): { success: boolean; error?: string; fallbackUrl?: string } {
  try {
    // Check browser compatibility first
    const compatibility = checkBrowserCompatibility();
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Handle iOS Safari special case
    if (compatibility.browser === 'Safari' && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // On iOS, open in new tab as fallback
      window.open(url, '_blank');
      return { 
        success: true, 
        fallbackUrl: url,
        error: 'iOS detected: File opened in new tab. Use "Share" button to save.' 
      };
    }
    
    // Standard download for supported browsers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Delay URL revocation to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during download';
    console.error('Document download failed:', error);
    return { 
      success: false, 
      error: `Download failed: ${errorMessage}. Please try using a different browser or contact support.` 
    };
  }
}

/**
 * Safe document generation and download helper
 * Combines generation and download with full error handling
 */
export async function generateAndDownloadDocument(
  generator: () => Promise<DocumentResult>,
  fileName: string
): Promise<{ success: boolean; message: string }> {
  // Check compatibility first
  const compatibility = checkBrowserCompatibility();
  if (!compatibility.supported && compatibility.issues.length > 0) {
    return {
      success: false,
      message: `Browser compatibility issues detected:\n${compatibility.issues.join('\n')}\n\nWorkarounds:\n${compatibility.workarounds.join('\n')}`
    };
  }
  
  // Generate document
  const result = await generator();
  if (!result.success || !result.blob) {
    return {
      success: false,
      message: result.error || 'Document generation failed'
    };
  }
  
  // Download document
  const downloadResult = downloadDocument(result.blob, fileName);
  if (!downloadResult.success) {
    return {
      success: false,
      message: downloadResult.error || 'Download failed'
    };
  }
  
  return {
    success: true,
    message: downloadResult.error || `Successfully downloaded ${fileName}`
  };
}

export default {
  generateExcel,
  generateWordDocument,
  generateCpkSpreadsheet,
  generateFmeaSpreadsheet,
  generateControlPlanSpreadsheet,
  generateAuditChecklistDocument,
  generateComplianceMatrix,
  generateSupplierScorecard,
  downloadDocument,
  checkBrowserCompatibility,
  generateAndDownloadDocument
};
