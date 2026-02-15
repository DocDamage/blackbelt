/**
 * Tests for ModuleStats Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ModuleStats } from './ModuleStats';
import { getModuleProgress } from '../../../utils/db';

// Mock the database utility
vi.mock('../../../utils/db', () => ({
    getModuleProgress: vi.fn(),
}));

describe('ModuleStats', () => {
    const mockProps = {
        moduleId: 'module-1',
        totalLessons: 10,
        estimatedMinutes: 120,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders nothing while loading', () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([]);
            const { container } = render(<ModuleStats {...mockProps} />);
            expect(container.firstChild).toBeNull();
        });

        it('renders stats bar after loading', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(document.querySelector('.module-stats-bar')).toBeInTheDocument();
            });
        });

        it('displays progress stat', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: true, timeSpent: 300, completedAt: new Date().toISOString() },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('Progress')).toBeInTheDocument();
            });
        });

        it('displays correct progress count', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: true, timeSpent: 300, completedAt: new Date().toISOString() },
                { completed: true, timeSpent: 400, completedAt: new Date().toISOString() },
                { completed: false, timeSpent: 100 },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('2/10 (20%)')).toBeInTheDocument();
            });
        });

        it('displays time spent stat', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: true, timeSpent: 600, completedAt: new Date().toISOString() },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('Time Spent')).toBeInTheDocument();
                expect(screen.getByText('10 min')).toBeInTheDocument();
            });
        });

        it('displays estimated time', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('(Est: 120 min)')).toBeInTheDocument();
            });
        });

        it('displays last active date when available', async () => {
            const lastDate = new Date('2024-01-15');
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: true, timeSpent: 300, completedAt: lastDate.toISOString() },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('Last Active')).toBeInTheDocument();
            });
        });
    });

    describe('Progress Calculations', () => {
        it('calculates 0% progress when no completions', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: false, timeSpent: 100 },
                { completed: false, timeSpent: 200 },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('0/10 (0%)')).toBeInTheDocument();
            });
        });

        it('calculates 100% progress when all completed', async () => {
            const completions = Array(10).fill(null).map((_, i) => ({
                completed: true,
                timeSpent: 300,
                completedAt: new Date(Date.now() - i * 1000).toISOString(),
            }));
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue(completions);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('10/10 (100%)')).toBeInTheDocument();
            });
        });

        it('calculates total time spent correctly', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: true, timeSpent: 300, completedAt: new Date().toISOString() },
                { completed: true, timeSpent: 450, completedAt: new Date().toISOString() },
                { completed: false, timeSpent: 150 },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                // (300 + 450 + 150) / 60 = 15 min
                expect(screen.getByText('15 min')).toBeInTheDocument();
            });
        });

        it('handles missing timeSpent gracefully', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: true, completedAt: new Date().toISOString() },
                { completed: false },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.getByText('0 min')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('handles database error gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            (getModuleProgress as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));
            
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Failed to load module stats', expect.any(Error));
            });

            // Should still render after error
            await waitFor(() => {
                expect(document.querySelector('.module-stats-bar')).toBeInTheDocument();
            });

            consoleSpy.mockRestore();
        });
    });

    describe('Date Formatting', () => {
        it('shows most recent completed date as last active', async () => {
            const olderDate = new Date('2024-01-10');
            const newerDate = new Date('2024-01-15');
            
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: true, timeSpent: 300, completedAt: olderDate.toISOString() },
                { completed: true, timeSpent: 400, completedAt: newerDate.toISOString() },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                // The newer date should be displayed
                expect(screen.getByText(newerDate.toLocaleDateString())).toBeInTheDocument();
            });
        });

        it('does not show last active when no completed items', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([
                { completed: false, timeSpent: 100 },
                { completed: false, timeSpent: 200 },
            ]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(screen.queryByText('Last Active')).not.toBeInTheDocument();
            });
        });
    });

    describe('Component Structure', () => {
        it('renders correct number of stat items', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                const statItems = document.querySelectorAll('.stat-item');
                expect(statItems.length).toBe(2); // Progress and Time Spent
            });
        });

        it('applies correct CSS classes', async () => {
            (getModuleProgress as ReturnType<typeof vi.fn>).mockResolvedValue([]);
            render(<ModuleStats {...mockProps} />);

            await waitFor(() => {
                expect(document.querySelector('.module-stats-bar')).toBeInTheDocument();
                expect(document.querySelector('.stat-label')).toBeInTheDocument();
                expect(document.querySelector('.stat-value')).toBeInTheDocument();
                expect(document.querySelector('.stat-sub')).toBeInTheDocument();
            });
        });
    });
});
