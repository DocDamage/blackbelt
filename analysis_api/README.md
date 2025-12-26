# Six Sigma Analysis API

A FastAPI backend for automated statistical analysis with Python, designed for CI/CD integration.

## Features

- **File Upload**: Accept CSV/Excel from Minitab/JMP
- **Automated Analysis**: DOE, Regression, SPC, Capability
- **Export Results**: JSON, CSV, PDF reports
- **REST API**: Easy integration with dashboards and pipelines

## Quick Start

```bash
cd analysis_api
pip install -r requirements.txt
python main.py
```

API runs at: <http://localhost:8000>
Docs at: <http://localhost:8000/docs>

## API Endpoints

### Upload & Analyze

- `POST /upload` - Upload CSV/Excel file
- `POST /analyze/descriptive` - Descriptive statistics
- `POST /analyze/capability` - Process capability (Cpk)
- `POST /analyze/regression` - Linear regression
- `POST /analyze/doe` - DOE analysis
- `POST /analyze/control-chart` - Control chart limits
- `POST /analyze/ttest` - T-test

### Export

- `GET /export/json/{analysis_id}` - Export as JSON
- `GET /export/csv/{analysis_id}` - Export as CSV
- `GET /export/report/{analysis_id}` - Generate PDF report

## CI/CD Integration

```yaml
# GitHub Actions example
- name: Run Six Sigma Analysis
  run: |
    curl -X POST http://localhost:8000/analyze/capability \
      -F "file=@data.csv" \
      -F "column=Measurement" \
      -F "usl=10.5" \
      -F "lsl=9.5" \
      -o results.json
```

## Dashboard Integration

```javascript
// Fetch analysis results
const response = await fetch('http://localhost:8000/analyze/descriptive', {
  method: 'POST',
  body: formData
});
const results = await response.json();
```
