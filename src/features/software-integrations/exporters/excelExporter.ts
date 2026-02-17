/**
 * Excel Export Generator
 * 
 * Generates actual Excel-compatible files using CSV format with Excel-specific features
 * including formulas, formatting hints, and structure optimization
 */

import type { Dataset, AnalysisResults, ExportConfig } from '../types';

export interface ExcelExportOptions {
  includeFormulas: boolean;
  includeCharts: boolean;
  includePivotTables: boolean;
  sheetNames?: string[];
}

interface ExcelSheet {
  name: string;
  data: (string | number | null)[][];
  formulas?: Record<string, string>;
  formats?: Record<string, string>;
}

/**
 * Generate Excel-compatible CSV content with embedded formula hints
 */
export function generateExcelExport(
  dataset: Dataset,
  results: AnalysisResults,
  config: ExportConfig
): { content: string; filename: string; sheets: ExcelSheet[] } {
  const sheets: ExcelSheet[] = [];
  
  // Sheet 1: Raw Data
  sheets.push(generateRawDataSheet(dataset));
  
  // Sheet 2: Summary Statistics
  if (results.statistics) {
    sheets.push(generateStatisticsSheet(results.statistics, dataset));
  }
  
  // Sheet 3: Capability Analysis
  if (results.capability && config.includeFormulas) {
    sheets.push(generateCapabilitySheet(results.capability, dataset));
  }
  
  // Sheet 4: Regression Analysis
  if (results.regression) {
    sheets.push(generateRegressionSheet(results.regression));
  }
  
  // Sheet 5: Control Chart Data
  if (results.controlChart) {
    sheets.push(generateControlChartSheet(results.controlChart));
  }
  
  // Generate CSV content (main sheet)
  const firstSheet = sheets[0];
  const mainContent = firstSheet ? generateCSV(firstSheet.data) : '';
  
  // Generate Excel XML 2003 format for multi-sheet support
  const xmlContent = generateExcelXML(sheets);
  
  return {
    content: config.includeFormulas ? xmlContent : mainContent,
    filename: `${dataset.name.replace(/\s+/g, '_')}_Analysis.xls`,
    sheets,
  };
}

function generateRawDataSheet(dataset: Dataset): ExcelSheet {
  const headers = dataset.columns.map(col => col.name);
  const rows = dataset.rows.map(row => 
    row.map((cell, idx) => {
      const col = dataset.columns[idx];
      if (col && col.type === 'numeric' && typeof cell === 'number') {
        return Number(cell.toFixed(4));
      }
      return cell ?? '';
    })
  );
  
  return {
    name: 'Raw Data',
    data: [headers, ...rows],
    formulas: {},
  };
}

function generateStatisticsSheet(
  stats: NonNullable<AnalysisResults['statistics']>,
  dataset: Dataset
): ExcelSheet {
  const data: (string | number)[][] = [
    ['Descriptive Statistics', ''],
    ['', ''],
    ['Statistic', 'Value'],
    ['Count', stats.count],
    ['Mean', Number(stats.mean.toFixed(4))],
    ['Median', Number(stats.median.toFixed(4))],
    ['Standard Deviation', Number(stats.stdDev.toFixed(4))],
    ['Minimum', Number(stats.min.toFixed(4))],
    ['Maximum', Number(stats.max.toFixed(4))],
    ['Q1 (25th Percentile)', Number(stats.q1.toFixed(4))],
    ['Q3 (75th Percentile)', Number(stats.q3.toFixed(4))],
  ];
  
  if (stats.skewness !== undefined) {
    data.push(['Skewness', Number(stats.skewness.toFixed(4))]);
  }
  if (stats.kurtosis !== undefined) {
    data.push(['Kurtosis', Number(stats.kurtosis.toFixed(4))]);
  }
  
  // Add Excel formulas for dynamic calculation
  const formulas: Record<string, string> = {};
  const dataRange = `Raw Data!B2:B${dataset.rows.length + 1}`;
  
  formulas['B4'] = `COUNT(${dataRange})`;
  formulas['B5'] = `AVERAGE(${dataRange})`;
  formulas['B6'] = `MEDIAN(${dataRange})`;
  formulas['B7'] = `STDEV.S(${dataRange})`;
  formulas['B8'] = `MIN(${dataRange})`;
  formulas['B9'] = `MAX(${dataRange})`;
  formulas['B10'] = `QUARTILE(${dataRange}, 1)`;
  formulas['B11'] = `QUARTILE(${dataRange}, 3)`;
  
  return {
    name: 'Statistics',
    data,
    formulas,
  };
}

function generateCapabilitySheet(
  capability: NonNullable<AnalysisResults['capability']>,
  dataset: Dataset
): ExcelSheet {
  const data: (string | number)[][] = [
    ['Process Capability Analysis', ''],
    ['', ''],
    ['Parameter', 'Value', 'Formula/Note'],
    ['USL (Upper Spec Limit)', capability.usl ?? '', 'Specification'],
    ['LSL (Lower Spec Limit)', capability.lsl ?? '', 'Specification'],
    ['Target', capability.target ?? '', 'Target Value'],
    ['', '', ''],
    ['Capability Indices', '', ''],
    ['Cp', Number(capability.cp.toFixed(3)), '(USL-LSL)/(6*σ)'],
    ['Cpk', Number(capability.cpk.toFixed(3)), 'min(Cpu, Cpl)'],
    ['Cpu', Number(capability.cpu.toFixed(3)), '(USL-Mean)/(3*σ)'],
    ['Cpl', Number(capability.cpl.toFixed(3)), '(Mean-LSL)/(3*σ)'],
    ['Pp', Number(capability.pp.toFixed(3)), 'Overall Performance'],
    ['Ppk', Number(capability.ppk.toFixed(3)), 'Overall Capability'],
    ['', '', ''],
    ['Sigma Level', Number(capability.sigmaLevel.toFixed(2)), 'Cpk × 3'],
    ['DPMO', capability.dpmo, 'Defects Per Million'],
  ];
  
  // Excel formulas
  const formulas: Record<string, string> = {};
  const dataRange = `Raw Data!B2:B${dataset.rows.length + 1}`;
  
  formulas['B10'] = `=(B4-B5)/(6*STDEV.S(${dataRange}))`; // Cp
  formulas['B11'] = `=MIN(B12,B13)`; // Cpk
  formulas['B12'] = `=(B4-AVERAGE(${dataRange}))/(3*STDEV.S(${dataRange}))`; // Cpu
  formulas['B13'] = `=(AVERAGE(${dataRange})-B5)/(3*STDEV.S(${dataRange}))`; // Cpl
  formulas['B16'] = `=B11*3`; // Sigma Level
  
  return {
    name: 'Capability',
    data,
    formulas,
  };
}

function generateRegressionSheet(
  regression: NonNullable<AnalysisResults['regression']>
): ExcelSheet {
  const data: (string | number)[][] = [
    ['Regression Analysis', ''],
    ['', ''],
    ['Model Summary', '', ''],
    ['R²', Number(regression.rSquared.toFixed(4)), 'Coefficient of Determination'],
    ['Adjusted R²', Number(regression.adjRSquared.toFixed(4)), 'Adjusted for predictors'],
    ['', '', ''],
    ['Coefficients', '', '', '', ''],
    ['Term', 'Coefficient', 'Std Error', 't-Statistic', 'p-Value'],
  ];
  
  regression.coefficients.forEach(coef => {
    data.push([
      coef.name,
      Number(coef.coefficient.toFixed(6)),
      Number(coef.stdError.toFixed(6)),
      Number(coef.tStat.toFixed(4)),
      Number(coef.pValue.toFixed(4)),
    ]);
  });
  
  data.push(['', '', '', '', '']);
  data.push(['Regression Equation', '', '', '', '']);
  data.push([regression.equation, '', '', '', '']);
  
  return {
    name: 'Regression',
    data,
  };
}

function generateControlChartSheet(
  controlChart: NonNullable<AnalysisResults['controlChart']>
): ExcelSheet {
  const data: (string | number | boolean)[][] = [
    ['Control Chart Data', '', '', '', ''],
    ['Chart Type:', controlChart.chartType, '', '', ''],
    ['Center Line:', controlChart.centerLine, '', '', ''],
    ['UCL:', controlChart.ucl, '', '', ''],
    ['LCL:', controlChart.lcl, '', '', ''],
    ['', '', '', '', ''],
    ['Sample', 'Value', 'UCL', 'LCL', 'Out of Control'],
  ];
  
  controlChart.points.forEach(point => {
    data.push([
      point.sample,
      Number(point.value.toFixed(3)),
      controlChart.ucl,
      controlChart.lcl,
      point.outOfControl ? 'YES' : 'NO',
    ]);
  });
  
  return {
    name: 'Control Chart',
    data: data as (string | number)[][],
  };
}

/**
 * Generate CSV format
 */
function generateCSV(data: (string | number | null)[][]): string {
  return data.map(row => 
    row.map(cell => {
      if (cell === null || cell === undefined) return '';
      const str = String(cell);
      // Escape cells with commas or quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  ).join('\n');
}

/**
 * Generate Excel 2003 XML format for multi-sheet support
 */
function generateExcelXML(sheets: ExcelSheet[]): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Six Sigma Training Platform</Author>
    <Created>${new Date().toISOString()}</Created>
    <Version>1.0</Version>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF" ss:Bold="1"/>
    </Style>
    <Style ss:ID="value">
      <NumberFormat ss:Format="0.0000"/>
    </Style>
  </Styles>`;
  
  const xmlSheets = sheets.map(sheet => generateSheetXML(sheet)).join('\n');
  
  const xmlFooter = '</Workbook>';
  
  return xmlHeader + '\n' + xmlSheets + '\n' + xmlFooter;
}

function generateSheetXML(sheet: ExcelSheet): string {
  let xml = `  <Worksheet ss:Name="${escapeXml(sheet.name)}">
    <Table>`;
  
  sheet.data.forEach((row, rowIdx) => {
    xml += '\n      <Row>';
    row.forEach(cell => {
      const style = rowIdx === 0 ? ' ss:StyleID="header"' : '';
      const type = typeof cell === 'number' ? 'Number' : 'String';
      const value = cell === null || cell === undefined ? '' : escapeXml(String(cell));
      xml += `<Cell${style}><Data ss:Type="${type}">${value}</Data></Cell>`;
    });
    xml += '</Row>';
  });
  
  xml += `
    </Table>
  </Worksheet>`;
  
  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate Excel VBA macro for Six Sigma analysis automation
 */
export function generateExcelMacro(): string {
  return `' Six Sigma Analysis Macro
' Generated by Six Sigma Training Platform

Sub RunSixSigmaAnalysis()
    Dim ws As Worksheet
    Dim dataRange As Range
    Dim lastRow As Long
    
    ' Set reference to Raw Data sheet
    Set ws = ThisWorkbook.Worksheets("Raw Data")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    Set dataRange = ws.Range("B2:B" & lastRow)
    
    ' Calculate descriptive statistics
    With ThisWorkbook.Worksheets("Statistics")
        .Range("B4").Value = Application.WorksheetFunction.Count(dataRange)
        .Range("B5").Value = Application.WorksheetFunction.Average(dataRange)
        .Range("B6").Value = Application.WorksheetFunction.Median(dataRange)
        .Range("B7").Value = Application.WorksheetFunction.StDev_S(dataRange)
        .Range("B8").Value = Application.WorksheetFunction.Min(dataRange)
        .Range("B9").Value = Application.WorksheetFunction.Max(dataRange)
    End With
    
    ' Create histogram
    Call CreateHistogram(dataRange)
    
    MsgBox "Six Sigma Analysis Complete!", vbInformation
End Sub

Sub CreateHistogram(dataRange As Range)
    ' Create histogram chart
    Dim cht As Chart
    Set cht = Charts.Add
    With cht
        .ChartType = xlColumnClustered
        .SetSourceData Source:=dataRange
        .HasTitle = True
        .ChartTitle.Text = "Process Data Histogram"
    End With
End Sub

Sub CalculateCapability(usl As Double, lsl As Double)
    ' Calculate process capability indices
    Dim ws As Worksheet
    Dim dataRange As Range
    Dim mean As Double, stdDev As Double
    Dim cp As Double, cpk As Double
    
    Set ws = ThisWorkbook.Worksheets("Raw Data")
    Set dataRange = ws.Range("B2:B" & ws.Cells(ws.Rows.Count, 1).End(xlUp).Row)
    
    mean = Application.WorksheetFunction.Average(dataRange)
    stdDev = Application.WorksheetFunction.StDev_S(dataRange)
    
    cp = (usl - lsl) / (6 * stdDev)
    cpk = Application.WorksheetFunction.Min( _
        (usl - mean) / (3 * stdDev), _
        (mean - lsl) / (3 * stdDev))
    
    With ThisWorkbook.Worksheets("Capability")
        .Range("B4").Value = usl
        .Range("B5").Value = lsl
        .Range("B10").Value = cp
        .Range("B11").Value = cpk
    End With
End Sub
`;
}

/**
 * Generate Excel template file structure
 */
export function generateExcelTemplate(): string {
  return `# Six Sigma Excel Template Guide

## Workbook Structure

### Sheet 1: Raw Data
- Column A: Sample ID (optional)
- Column B: Measurement values
- Column C: Subgroup identifier (for X-bar charts)
- Column D: Timestamp (optional)

### Sheet 2: Statistics
- Auto-calculated using Excel formulas
- Links to Raw Data sheet
- Updates automatically when data changes

### Sheet 3: Capability
- Enter USL/LSL in cells B4:B5
- Capability indices auto-calculate
- Interpretation guidelines included

### Sheet 4: Control Chart
- Copy data from Raw Data
- Control limits auto-calculate
- Out-of-control points highlighted

## Formulas Used

### Cp (Process Potential)
\`= (USL - LSL) / (6 * STDEV.S(data))\`

### Cpk (Process Capability)
\`= MIN((USL - AVERAGE(data))/(3*STDEV.S(data)), (AVERAGE(data)-LSL)/(3*STDEV.S(data)))\`

### Sigma Level
\`= Cpk * 3\`

### DPMO
\`= (1 - NORMSDIST(Cpk * 3)) * 1000000 * 2\`

## Tips
1. Use "Data" > "Data Validation" to prevent entry errors
2. Apply conditional formatting to highlight outliers
3. Create pivot tables for subgroup analysis
4. Use Solver for optimization problems
`;
}
