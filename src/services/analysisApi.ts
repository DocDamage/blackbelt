/**
 * Six Sigma Analysis API Client
 * Connects frontend to Python analysis backend
 */

const API_BASE_URL = 'http://localhost:8001';

export interface DescriptiveResult {
    column: string;
    count: number;
    mean: number;
    std: number;
    min: number;
    max: number;
    median: number;
    q1: number;
    q3: number;
    variance: number;
}

export interface CapabilityResult {
    column: string;
    usl: number;
    lsl: number;
    mean: number;
    std: number;
    cp: number;
    cpk: number;
    cpu: number;
    cpl: number;
    ppm_above_usl: number;
    ppm_below_lsl: number;
    sigma_level: number;
    capable: boolean;
}

export interface RegressionCoefficient {
    coefficient: number;
    std_error: number;
    t_value: number;
    p_value: number;
    significant: boolean;
}

export interface RegressionResult {
    r_squared: number;
    adj_r_squared: number;
    f_statistic: number;
    f_pvalue: number;
    coefficients: Record<string, RegressionCoefficient>;
    residual_std_error: number;
    observations: number;
}

export interface TTestResult {
    test_type: string;
    t_statistic: number;
    p_value: number;
    df: number;
    mean_difference: number | null;
    confidence_interval: [number, number];
    significant: boolean;
    alpha: number;
}

export interface ControlChartResult {
    chart_type: string;
    center_line: number;
    ucl: number;
    lcl: number;
    subgroup_size: number;
    out_of_control_points: number[];
    data_points: number[];
}

export interface AnalysisResponse<T> {
    analysis_id: string;
    timestamp: string;
    analysis_type: string;
    results: T;
    metadata: Record<string, unknown>;
}

class AnalysisApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Check if API is available
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(this.baseUrl);
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Upload file and get preview
     */
    async uploadFile(file: File): Promise<{
        filename: string;
        rows: number;
        columns: string[];
        dtypes: Record<string, string>;
        preview: Record<string, unknown>[];
        numeric_columns: string[];
    }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Descriptive statistics
     */
    async descriptive(file: File, columns?: string[]): Promise<AnalysisResponse<DescriptiveResult[]>> {
        const formData = new FormData();
        formData.append('file', file);
        if (columns) {
            formData.append('columns', columns.join(','));
        }

        const response = await fetch(`${this.baseUrl}/analyze/descriptive`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Analysis failed: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Process capability analysis (Cpk)
     */
    async capability(file: File, column: string, usl: number, lsl: number, target?: number): Promise<AnalysisResponse<CapabilityResult>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('column', column);
        formData.append('usl', usl.toString());
        formData.append('lsl', lsl.toString());
        if (target !== undefined) {
            formData.append('target', target.toString());
        }

        const response = await fetch(`${this.baseUrl}/analyze/capability`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Capability analysis failed');
        }

        return response.json();
    }

    /**
     * Linear regression
     */
    async regression(file: File, response_col: string, predictors: string[]): Promise<AnalysisResponse<RegressionResult>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('response', response_col);
        formData.append('predictors', predictors.join(','));

        const res = await fetch(`${this.baseUrl}/analyze/regression`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Regression analysis failed');
        }

        return res.json();
    }

    /**
     * T-test analysis
     */
    async ttest(
        file: File,
        column1: string,
        testType: 'one-sample' | 'two-sample' | 'paired',
        column2?: string,
        hypothesizedMean?: number,
        alpha: number = 0.05
    ): Promise<AnalysisResponse<TTestResult>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('column1', column1);
        formData.append('test_type', testType);
        formData.append('alpha', alpha.toString());

        if (column2) {
            formData.append('column2', column2);
        }
        if (hypothesizedMean !== undefined) {
            formData.append('hypothesized_mean', hypothesizedMean.toString());
        }

        const response = await fetch(`${this.baseUrl}/analyze/ttest`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'T-test failed');
        }

        return response.json();
    }

    /**
     * Control chart analysis
     */
    async controlChart(
        file: File,
        column: string,
        chartType: 'xbar-r' | 'imr' = 'xbar-r',
        subgroupSize: number = 5
    ): Promise<AnalysisResponse<ControlChartResult>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('column', column);
        formData.append('chart_type', chartType);
        formData.append('subgroup_size', subgroupSize.toString());

        const response = await fetch(`${this.baseUrl}/analyze/control-chart`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Control chart analysis failed');
        }

        return response.json();
    }

    /**
     * Export results as JSON
     */
    async exportJson(analysisId: string): Promise<Record<string, unknown>> {
        const response = await fetch(`${this.baseUrl}/export/json/${analysisId}`);

        if (!response.ok) {
            throw new Error('Export failed');
        }

        return response.json();
    }

    /**
     * Get download URL for CSV export
     */
    getCsvExportUrl(analysisId: string): string {
        return `${this.baseUrl}/export/csv/${analysisId}`;
    }

    /**
     * List all stored analyses
     */
    async listResults(): Promise<{
        count: number;
        analyses: { analysis_id: string; type: string; timestamp: string }[];
    }> {
        const response = await fetch(`${this.baseUrl}/results`);
        return response.json();
    }
}

// Singleton instance
export const analysisApi = new AnalysisApiClient();

// Export for testing/custom base URL
export { AnalysisApiClient };
