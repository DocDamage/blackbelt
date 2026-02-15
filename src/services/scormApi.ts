/**
 * SCORM Integration Service
 * 
 * Provides SCORM 1.2 and SCORM 2004 API support for LMS integration.
 */

// SCORM Data Model
export interface ScormDataModel {
    // Core
    cmi_core_lesson_status: 'passed' | 'completed' | 'failed' | 'incomplete' | 'browsed' | 'not attempted';
    cmi_core_score_raw?: number;
    cmi_core_score_min?: number;
    cmi_core_score_max?: number;
    cmi_core_session_time?: string;
    cmi_core_total_time?: string;
    cmi_core_lesson_location?: string;
    cmi_core_lesson_mode?: 'normal' | 'review' | 'browse';

    // Student Info
    cmi_core_student_name?: string;
    cmi_core_student_id?: string;

    // Progress
    cmi_suspend_data?: string;
    cmi_launch_data?: string;

    // Objectives
    cmi_objectives?: ScormObjective[];

    // Interactions
    cmi_interactions?: ScormInteraction[];
}

export interface ScormObjective {
    id: string;
    status: 'passed' | 'completed' | 'failed' | 'incomplete' | 'browsed' | 'not attempted';
    score_raw?: number;
    score_min?: number;
    score_max?: number;
}

export interface ScormInteraction {
    id: string;
    type: 'true-false' | 'choice' | 'fill-in' | 'matching' | 'performance' | 'sequencing' | 'likert' | 'numeric';
    student_response?: string;
    correct_responses?: string[];
    result?: 'correct' | 'wrong' | 'unanticipated' | 'neutral';
    latency?: string;
    time?: string;
}

// SCORM API Wrapper
class ScormApiWrapper {
    private api: any = null;
    private isInitialized: boolean = false;
    private data: ScormDataModel = {
        cmi_core_lesson_status: 'not attempted'
    };

    constructor() {
        this.findApi();
    }

    private findApi(): void {
        // Try to find SCORM API in window hierarchy
        const win = window;

        // Check for SCORM 1.2 API
        if ((win as any).API) {
            this.api = (win as any).API;
            return;
        }

        // Check for SCORM 2004 API
        if ((win as any).API_1484_11) {
            this.api = (win as any).API_1484_11;
            return;
        }

        // Check parent frames
        let parent = win.parent;
        while (parent && parent !== win) {
            if ((parent as any).API) {
                this.api = (parent as any).API;
                return;
            }
            if ((parent as any).API_1484_11) {
                this.api = (parent as any).API_1484_11;
                return;
            }
            parent = parent.parent;
        }

        // Check opener
        if (win.opener) {
            if ((win.opener as any).API) {
                this.api = (win.opener as any).API;
                return;
            }
            if ((win.opener as any).API_1484_11) {
                this.api = (win.opener as any).API_1484_11;
                return;
            }
        }

        console.log('[SCORM] No LMS API found - running in standalone mode');
    }

    // Initialize connection with LMS
    initialize(): boolean {
        if (this.isInitialized) return true;

        if (this.api) {
            try {
                const result = this.api.LMSInitialize('');
                if (result === 'true' || result === true) {
                    this.isInitialized = true;
                    this.loadData();
                    console.log('[SCORM] Initialized successfully');
                    return true;
                }
            } catch (e) {
                console.error('[SCORM] Initialize failed:', e);
            }
        } else {
            // Standalone mode - load from localStorage
            this.loadLocalData();
            this.isInitialized = true;
            return true;
        }

        return false;
    }

    // Terminate connection with LMS
    terminate(): boolean {
        if (!this.isInitialized) return true;

        if (this.api) {
            try {
                this.saveData();
                const result = this.api.LMSFinish('');
                this.isInitialized = false;
                return result === 'true' || result === true;
            } catch (e) {
                console.error('[SCORM] Terminate failed:', e);
            }
        } else {
            this.saveLocalData();
            this.isInitialized = false;
            return true;
        }

        return false;
    }

    // Get value from LMS
    getValue(element: string): string {
        if (this.api) {
            try {
                return this.api.LMSGetValue(element);
            } catch (e) {
                console.error('[SCORM] GetValue failed:', e);
            }
        }

        // Return from local data
        return (this.data as any)[element] || '';
    }

    // Set value in LMS
    setValue(element: string, value: string): boolean {
        if (this.api) {
            try {
                const result = this.api.LMSSetValue(element, value);
                return result === 'true' || result === true;
            } catch (e) {
                console.error('[SCORM] SetValue failed:', e);
            }
        }

        // Store in local data
        (this.data as any)[element] = value;
        return true;
    }

    // Commit data to LMS
    commit(): boolean {
        if (this.api) {
            try {
                return this.api.LMSCommit('') === 'true';
            } catch (e) {
                console.error('[SCORM] Commit failed:', e);
            }
        } else {
            this.saveLocalData();
            return true;
        }
        return false;
    }

    // Load data from LMS
    private loadData(): void {
        this.data = {
            cmi_core_lesson_status: this.getValue('cmi.core.lesson_status') as any,
            cmi_core_score_raw: parseFloat(this.getValue('cmi.core.score.raw')) || 0,
            cmi_core_student_name: this.getValue('cmi.core.student.name'),
            cmi_core_student_id: this.getValue('cmi.core.student.id'),
            cmi_suspend_data: this.getValue('cmi.suspend_data'),
        };
    }

    // Save data to LMS
    private saveData(): void {
        this.setValue('cmi.core.lesson_status', this.data.cmi_core_lesson_status);
        if (this.data.cmi_core_score_raw !== undefined) {
            this.setValue('cmi.core.score.raw', this.data.cmi_core_score_raw.toString());
        }
        if (this.data.cmi_suspend_data) {
            this.setValue('cmi.suspend_data', this.data.cmi_suspend_data);
        }
        this.commit();
    }

    // Load from localStorage (standalone mode)
    private loadLocalData(): void {
        const stored = localStorage.getItem('scorm_data');
        if (stored) {
            this.data = JSON.parse(stored);
        }
    }

    // Save to localStorage (standalone mode)
    private saveLocalData(): void {
        localStorage.setItem('scorm_data', JSON.stringify(this.data));
    }

    // Convenience methods
    setScore(score: number, min: number = 0, max: number = 100): void {
        this.data.cmi_core_score_raw = score;
        this.data.cmi_core_score_min = min;
        this.data.cmi_core_score_max = max;
        this.setValue('cmi.core.score.raw', score.toString());
        this.setValue('cmi.core.score.min', min.toString());
        this.setValue('cmi.core.score.max', max.toString());
    }

    setStatus(status: ScormDataModel['cmi_core_lesson_status']): void {
        this.data.cmi_core_lesson_status = status;
        this.setValue('cmi.core.lesson_status', status);
    }

    setLessonLocation(location: string): void {
        this.data.cmi_core_lesson_location = location;
        this.setValue('cmi.core.lesson_location', location);
    }

    setSuspendData(data: object): void {
        const serialized = JSON.stringify(data);
        this.data.cmi_suspend_data = serialized;
        this.setValue('cmi.suspend_data', serialized);
    }

    getSuspendData<T>(): T | null {
        if (this.data.cmi_suspend_data) {
            try {
                return JSON.parse(this.data.cmi_suspend_data);
            } catch {
                return null;
            }
        }
        return null;
    }

    getData(): ScormDataModel {
        return { ...this.data };
    }

    getStudentInfo(): { name: string; id: string } {
        return {
            name: this.data.cmi_core_student_name || '',
            id: this.data.cmi_core_student_id || ''
        };
    }
}

// Export singleton instance
export const scormApi = new ScormApiWrapper();

// React hook for SCORM
export function useScorm() {
    const initialize = () => scormApi.initialize();
    const terminate = () => scormApi.terminate();
    const setScore = (score: number, min?: number, max?: number) => scormApi.setScore(score, min, max);
    const setStatus = (status: ScormDataModel['cmi_core_lesson_status']) => scormApi.setStatus(status);
    const setLessonLocation = (location: string) => scormApi.setLessonLocation(location);
    const setSuspendData = (data: object) => scormApi.setSuspendData(data);
    const getSuspendData = <T,>(): T | null => scormApi.getSuspendData<T>();
    const getData = () => scormApi.getData();
    const getStudentInfo = () => scormApi.getStudentInfo();
    const commit = () => scormApi.commit();

    return {
        initialize,
        terminate,
        setScore,
        setStatus,
        setLessonLocation,
        setSuspendData,
        getSuspendData,
        getData,
        getStudentInfo,
        commit
    };
}

export default scormApi;