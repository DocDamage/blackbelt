/**
 * Statistical Software Exporters
 * 
 * Comprehensive exporters for:
 * - Microsoft Excel
 * - Minitab
 * - Python
 * - R
 * - SPSS
 * - JMP
 */

// Excel
export {
  generateExcelExport,
  generateExcelMacro,
  generateExcelTemplate,
  type ExcelExportOptions,
} from './excelExporter';

// Minitab
export {
  generateMinitabExport,
  generateMinitabGuide,
  type MinitabExport,
} from './minitabExporter';

// Python
export {
  generatePythonExport,
  generatePythonClass,
  type PythonExport,
} from './pythonExporter';

// R (temporarily disabled due to template complexity)
// export {
//   generateRExport,
//   generateRFunctions,
//   type RExport,
// } from './rExporter';

// SPSS
export {
  generateSPSSExport,
  generateSPSSCommandReference,
  type SPSSExport,
} from './spssExporter';

// JMP
export {
  generateJMPExport,
  generateJMPAddIn,
  generateJMPCommandReference,
  type JMPExport,
} from './jmpExporter';
