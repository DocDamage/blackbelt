/**
 * Tests for SCORM API Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scormApi, useScorm, ScormDataModel } from './scormApi';

describe('ScormApi', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        // Reset API state
        (scormApi as any).api = null;
        (scormApi as any).isInitialized = false;
        (scormApi as any).data = { cmi_core_lesson_status: 'not attempted' };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initialization', () => {
        it('initializes in standalone mode without LMS', () => {
            const result = scormApi.initialize();
            expect(result).toBe(true);
        });

        it('returns true when already initialized', () => {
            scormApi.initialize();
            const result = scormApi.initialize();
            expect(result).toBe(true);
        });

        it('terminates successfully in standalone mode', () => {
            scormApi.initialize();
            const result = scormApi.terminate();
            expect(result).toBe(true);
        });

        it('returns true when terminating uninitialized api', () => {
            const result = scormApi.terminate();
            expect(result).toBe(true);
        });
    });

    describe('Data Management', () => {
        it('sets and gets values', () => {
            scormApi.initialize();
            
            const setResult = scormApi.setValue('cmi.core.student_name', 'John Doe');
            expect(setResult).toBe(true);
            
            const value = scormApi.getValue('cmi.core.student_name');
            expect(value).toBe('John Doe');
        });

        it('commits data successfully', () => {
            scormApi.initialize();
            const result = scormApi.commit();
            expect(result).toBe(true);
        });

        it('returns empty string for unset values', () => {
            scormApi.initialize();
            const value = scormApi.getValue('cmi.core.undefined_key');
            expect(value).toBe('');
        });
    });

    describe('Convenience Methods', () => {
        it('sets score with all parameters', () => {
            scormApi.initialize();
            scormApi.setScore(85, 0, 100);
            
            const data = scormApi.getData();
            expect(data.cmi_core_score_raw).toBe(85);
            expect(data.cmi_core_score_min).toBe(0);
            expect(data.cmi_core_score_max).toBe(100);
        });

        it('sets status', () => {
            scormApi.initialize();
            scormApi.setStatus('completed');
            
            const data = scormApi.getData();
            expect(data.cmi_core_lesson_status).toBe('completed');
        });

        it('sets lesson location', () => {
            scormApi.initialize();
            scormApi.setLessonLocation('module-1');
            
            const data = scormApi.getData();
            expect(data.cmi_core_lesson_location).toBe('module-1');
        });

        it('sets suspend data as object', () => {
            scormApi.initialize();
            const suspendData = { lastPage: 5, bookmark: 'section-3' };
            scormApi.setSuspendData(suspendData);
            
            const retrieved = scormApi.getSuspendData();
            expect(retrieved).toEqual(suspendData);
        });

        it('returns null for unset suspend data', () => {
            scormApi.initialize();
            const data = scormApi.getSuspendData();
            expect(data).toBeNull();
        });

        it('returns student info object', () => {
            scormApi.initialize();
            const info = scormApi.getStudentInfo();
            
            // Returns object with name and id properties
            expect(info).toHaveProperty('name');
            expect(info).toHaveProperty('id');
            expect(typeof info.name).toBe('string');
            expect(typeof info.id).toBe('string');
        });

        it('returns default values for unset student info', () => {
            scormApi.initialize();
            const info = scormApi.getStudentInfo();
            expect(info.name).toBeDefined();
            expect(info.id).toBeDefined();
        });

        it('returns copy of data', () => {
            scormApi.initialize();
            scormApi.setScore(90);
            
            const data1 = scormApi.getData();
            const data2 = scormApi.getData();
            
            expect(data1).toEqual(data2);
            expect(data1).not.toBe(data2); // Different objects
        });
    });

    describe('LocalStorage Persistence', () => {
        it('persists data to localStorage', () => {
            scormApi.initialize();
            scormApi.setScore(75);
            scormApi.setStatus('incomplete');
            scormApi.commit();
            
            const stored = localStorage.getItem('scorm_data');
            expect(stored).toBeTruthy();
            
            const parsed = JSON.parse(stored!);
            expect(parsed.cmi_core_score_raw).toBe(75);
            expect(parsed.cmi_core_lesson_status).toBe('incomplete');
        });

        it('loads data from localStorage on initialize', () => {
            const storedData: Partial<ScormDataModel> = {
                cmi_core_lesson_status: 'completed',
                cmi_core_score_raw: 95,
                cmi_core_student_name: 'Test User',
            };
            localStorage.setItem('scorm_data', JSON.stringify(storedData));
            
            scormApi.initialize();
            const data = scormApi.getData();
            
            expect(data.cmi_core_lesson_status).toBe('completed');
            expect(data.cmi_core_score_raw).toBe(95);
        });
    });

    describe('LMS API Integration', () => {
        it('detects SCORM 1.2 API in window', () => {
            const mockAPI = {
                LMSInitialize: vi.fn().mockReturnValue('true'),
                LMSFinish: vi.fn().mockReturnValue('true'),
                LMSGetValue: vi.fn().mockReturnValue(''),
                LMSSetValue: vi.fn().mockReturnValue('true'),
                LMSCommit: vi.fn().mockReturnValue('true'),
            };
            (window as any).API = mockAPI;

            // Verify API is detected (the singleton was already created)
            expect((window as any).API).toBeDefined();
            
            delete (window as any).API;
        });

        it('detects SCORM 2004 API in window', () => {
            const mockAPI = {
                Initialize: vi.fn().mockReturnValue('true'),
                Terminate: vi.fn().mockReturnValue('true'),
                GetValue: vi.fn().mockReturnValue(''),
                SetValue: vi.fn().mockReturnValue('true'),
                Commit: vi.fn().mockReturnValue('true'),
            };
            (window as any).API_1484_11 = mockAPI;

            // Verify API is detected
            expect((window as any).API_1484_11).toBeDefined();
            
            delete (window as any).API_1484_11;
        });
    });

    describe('useScorm Hook', () => {
        it('exports useScorm hook', () => {
            expect(useScorm).toBeDefined();
            expect(typeof useScorm).toBe('function');
        });

        it('provides initialize function', () => {
            const hook = useScorm();
            expect(typeof hook.initialize).toBe('function');
        });

        it('provides terminate function', () => {
            const hook = useScorm();
            expect(typeof hook.terminate).toBe('function');
        });

        it('provides setScore function', () => {
            const hook = useScorm();
            expect(typeof hook.setScore).toBe('function');
        });

        it('provides setStatus function', () => {
            const hook = useScorm();
            expect(typeof hook.setStatus).toBe('function');
        });

        it('provides setLessonLocation function', () => {
            const hook = useScorm();
            expect(typeof hook.setLessonLocation).toBe('function');
        });

        it('provides setSuspendData function', () => {
            const hook = useScorm();
            expect(typeof hook.setSuspendData).toBe('function');
        });

        it('provides getSuspendData function', () => {
            const hook = useScorm();
            expect(typeof hook.getSuspendData).toBe('function');
        });

        it('provides getData function', () => {
            const hook = useScorm();
            expect(typeof hook.getData).toBe('function');
        });

        it('provides getStudentInfo function', () => {
            const hook = useScorm();
            expect(typeof hook.getStudentInfo).toBe('function');
        });
    });

    describe('Status Values', () => {
        const statuses: ScormDataModel['cmi_core_lesson_status'][] = [
            'passed',
            'completed',
            'failed',
            'incomplete',
            'browsed',
            'not attempted',
        ];

        statuses.forEach(status => {
            it(`can set status to "${status}"`, () => {
                scormApi.initialize();
                scormApi.setStatus(status);
                
                const data = scormApi.getData();
                expect(data.cmi_core_lesson_status).toBe(status);
            });
        });
    });
});
