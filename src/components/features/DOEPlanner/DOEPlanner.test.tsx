/**
 * Tests for DOEPlanner Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DOEPlanner } from './DOEPlanner';

describe('DOEPlanner', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders DOE planner header', () => {
        render(<DOEPlanner />);
        expect(screen.getByText(/doe planner/i)).toBeInTheDocument();
    });

    it('displays design configuration section', () => {
        render(<DOEPlanner />);
        expect(screen.getByText(/design configuration/i)).toBeInTheDocument();
    });

    it('shows select dropdowns for configuration', () => {
        render(<DOEPlanner />);
        // Check select elements exist
        const selects = document.querySelectorAll('select');
        expect(selects.length).toBeGreaterThan(0);
    });

    it('displays factor levels section', () => {
        render(<DOEPlanner />);
        expect(screen.getByText(/factor levels/i)).toBeInTheDocument();
    });

    it('displays design statistics', () => {
        render(<DOEPlanner />);
        expect(screen.getByText(/design statistics/i)).toBeInTheDocument();
    });

    it('shows experimental runs section', () => {
        render(<DOEPlanner />);
        expect(screen.getByText(/experimental runs/i)).toBeInTheDocument();
    });

    it('displays export CSV button', () => {
        render(<DOEPlanner />);
        expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
    });

    it('shows center points checkbox checked by default', () => {
        render(<DOEPlanner />);
        const checkbox = screen.getByLabelText(/include center points/i);
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
    });

    it('shows randomize checkbox checked by default', () => {
        render(<DOEPlanner />);
        const checkbox = screen.getByLabelText(/randomize run order/i);
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();
    });

    it('allows toggling center points', () => {
        render(<DOEPlanner />);

        const checkbox = screen.getByLabelText(/include center points/i);
        fireEvent.click(checkbox);

        expect(checkbox).not.toBeChecked();
    });

    it('displays run table', () => {
        render(<DOEPlanner />);

        // Check table exists
        const table = document.querySelector('.runs-table');
        expect(table).toBeInTheDocument();
    });

    it('shows stats grid with stat labels', () => {
        render(<DOEPlanner />);

        // Check stat labels exist
        expect(screen.getByText(/total runs/i)).toBeInTheDocument();
    });

    it('displays factor inputs in table', () => {
        render(<DOEPlanner />);

        // Factor configuration should have text inputs
        const textInputs = document.querySelectorAll('.factors-table input[type="text"]');
        expect(textInputs.length).toBeGreaterThan(0);
    });

    it('shows checkboxes for options', () => {
        render(<DOEPlanner />);

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toBeGreaterThanOrEqual(2);
    });

    it('displays factor letters in table', () => {
        render(<DOEPlanner />);

        // Should show factor letters A, B, C for default 3 factors
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('has main content sections', () => {
        render(<DOEPlanner />);

        // Check main sections exist
        expect(document.querySelector('.config-section')).toBeInTheDocument();
        expect(document.querySelector('.factors-section')).toBeInTheDocument();
        expect(document.querySelector('.stats-section')).toBeInTheDocument();
        expect(document.querySelector('.runs-section')).toBeInTheDocument();
    });

    it('renders without errors', () => {
        const { container } = render(<DOEPlanner />);
        expect(container.firstChild).toBeInTheDocument();
    });
});