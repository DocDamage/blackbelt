/**
 * Tests for StatCalculators Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatCalculators } from './StatCalculators';

describe('StatCalculators', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders calculators header', () => {
        render(<StatCalculators />);
        expect(screen.getByText(/statistical calculators/i)).toBeInTheDocument();
    });

    it('displays all calculator tabs', () => {
        render(<StatCalculators />);
        expect(screen.getByRole('button', { name: /cpk calculator/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /dpmo/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sample size/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /control chart/i })).toBeInTheDocument();
    });

    it('shows Cpk calculator by default', () => {
        render(<StatCalculators />);
        // Process capability appears in multiple places (description and title)
        const capabilityElements = screen.getAllByText(/process capability/i);
        expect(capabilityElements.length).toBeGreaterThan(0);
    });

    it('calculates and displays Cpk results', () => {
        render(<StatCalculators />);
        // Results section should be visible
        expect(screen.getByText(/results/i)).toBeInTheDocument();
    });

    it('switches to DPMO calculator when tab clicked', () => {
        render(<StatCalculators />);

        const dpmoTab = screen.getByRole('button', { name: /dpmo/i });
        fireEvent.click(dpmoTab);

        expect(screen.getByText(/dpmo & sigma level/i)).toBeInTheDocument();
    });

    it('calculates and displays DPMO results', () => {
        render(<StatCalculators />);

        fireEvent.click(screen.getByRole('button', { name: /dpmo/i }));

        expect(screen.getByText(/results/i)).toBeInTheDocument();
    });

    it('switches to Sample Size calculator when tab clicked', () => {
        render(<StatCalculators />);

        const sampleTab = screen.getByRole('button', { name: /sample size/i });
        fireEvent.click(sampleTab);

        expect(screen.getByText(/sample size calculator/i)).toBeInTheDocument();
    });

    it('calculates and displays sample size results', () => {
        render(<StatCalculators />);

        fireEvent.click(screen.getByRole('button', { name: /sample size/i }));

        expect(screen.getByText(/required sample size/i)).toBeInTheDocument();
    });

    it('switches to Control Chart calculator when tab clicked', () => {
        render(<StatCalculators />);

        const controlTab = screen.getByRole('button', { name: /control chart/i });
        fireEvent.click(controlTab);

        expect(screen.getByText(/control chart analyzer/i)).toBeInTheDocument();
    });

    it('calculates control chart statistics', () => {
        render(<StatCalculators />);

        fireEvent.click(screen.getByRole('button', { name: /control chart/i }));

        // Should show control chart stats
        expect(screen.getByText(/control chart statistics/i)).toBeInTheDocument();
    });

    it('shows capability rating for Cpk results', () => {
        render(<StatCalculators />);

        // Default values should produce a capability rating
        const ratingElements = screen.getAllByText(/capable|not capable|marginally/i);
        expect(ratingElements.length).toBeGreaterThan(0);
    });

    it('shows input fields in Cpk calculator', () => {
        render(<StatCalculators />);

        // Cpk calculator should have number inputs
        const numberInputs = document.querySelectorAll('input[type="number"]');
        expect(numberInputs.length).toBeGreaterThan(0);
    });

    it('shows textarea in Control Chart calculator', () => {
        render(<StatCalculators />);

        fireEvent.click(screen.getByRole('button', { name: /control chart/i }));

        const textarea = document.querySelector('textarea');
        expect(textarea).toBeInTheDocument();
    });

    it('shows select dropdown in Sample Size calculator', () => {
        render(<StatCalculators />);

        fireEvent.click(screen.getByRole('button', { name: /sample size/i }));

        const select = document.querySelector('select');
        expect(select).toBeInTheDocument();
    });

    it('has active tab styling on selected calculator', () => {
        render(<StatCalculators />);

        const cpkTab = screen.getByRole('button', { name: /cpk calculator/i });
        expect(cpkTab).toHaveClass('active');
    });

    it('changes active tab when different calculator selected', () => {
        render(<StatCalculators />);

        const dpmoTab = screen.getByRole('button', { name: /dpmo/i });
        fireEvent.click(dpmoTab);

        expect(dpmoTab).toHaveClass('active');
    });
});