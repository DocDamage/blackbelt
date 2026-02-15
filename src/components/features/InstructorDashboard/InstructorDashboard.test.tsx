/**
 * Tests for InstructorDashboard Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstructorDashboard } from './InstructorDashboard';

describe('InstructorDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders dashboard header', () => {
        render(<InstructorDashboard />);
        expect(screen.getByText(/instructor dashboard/i)).toBeInTheDocument();
    });

    it('displays all navigation tabs', () => {
        render(<InstructorDashboard />);
        expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /students/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /assignments/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /analytics/i })).toBeInTheDocument();
    });

    it('shows overview tab by default', () => {
        render(<InstructorDashboard />);
        expect(screen.getByText(/total students/i)).toBeInTheDocument();
        expect(screen.getByText(/active today/i)).toBeInTheDocument();
    });

    it('displays stats cards in overview', () => {
        render(<InstructorDashboard />);
        expect(screen.getByText(/avg progress/i)).toBeInTheDocument();
        expect(screen.getByText(/avg quiz score/i)).toBeInTheDocument();
    });

    it('shows recent assignments in overview', () => {
        render(<InstructorDashboard />);
        expect(screen.getByText(/recent assignments/i)).toBeInTheDocument();
    });

    it('shows top performers section', () => {
        render(<InstructorDashboard />);
        expect(screen.getByText(/top performers/i)).toBeInTheDocument();
    });

    it('switches to students tab when clicked', () => {
        render(<InstructorDashboard />);

        const studentsTab = screen.getByRole('button', { name: /students/i });
        fireEvent.click(studentsTab);

        expect(screen.getByPlaceholderText(/search students/i)).toBeInTheDocument();
    });

    it('displays student search input in students tab', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /students/i }));
        const searchInput = screen.getByPlaceholderText(/search students/i);

        fireEvent.change(searchInput, { target: { value: 'alice' } });
        expect(searchInput).toHaveValue('alice');
    });

    it('shows belt filter dropdown in students tab', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /students/i }));
        const beltFilter = screen.getByRole('combobox');
        expect(beltFilter).toBeInTheDocument();
    });

    it('displays students table in students tab', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /students/i }));

        // Table headers - use getAllByText since there might be multiple matches
        const studentHeaders = screen.getAllByText(/student/i);
        expect(studentHeaders.length).toBeGreaterThan(0);
    });

    it('shows demo students in table', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /students/i }));

        expect(screen.getByText(/alice johnson/i)).toBeInTheDocument();
        expect(screen.getByText(/bob smith/i)).toBeInTheDocument();
    });

    it('switches to assignments tab when clicked', () => {
        render(<InstructorDashboard />);

        const assignmentsTab = screen.getByRole('button', { name: /assignments/i });
        fireEvent.click(assignmentsTab);

        expect(screen.getByText(/all assignments/i)).toBeInTheDocument();
    });

    it('shows create assignment button in assignments tab', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /assignments/i }));
        expect(screen.getByRole('button', { name: /create assignment/i })).toBeInTheDocument();
    });

    it('displays assignment cards', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /assignments/i }));

        expect(screen.getByText(/dmaic project report/i)).toBeInTheDocument();
        expect(screen.getByText(/statistical analysis quiz/i)).toBeInTheDocument();
    });

    it('shows submission counts on assignments', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /assignments/i }));

        // Use getAllByText since 'submitted' appears multiple times
        const submittedElements = screen.getAllByText(/submitted/i);
        expect(submittedElements.length).toBeGreaterThan(0);
    });

    it('switches to analytics tab when clicked', () => {
        render(<InstructorDashboard />);

        const analyticsTab = screen.getByRole('button', { name: /analytics/i });
        fireEvent.click(analyticsTab);

        expect(screen.getByText(/class analytics/i)).toBeInTheDocument();
    });

    it('shows progress distribution in analytics', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /analytics/i }));
        expect(screen.getByText(/progress distribution/i)).toBeInTheDocument();
    });

    it('shows belt distribution in analytics', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /analytics/i }));
        expect(screen.getByText(/belt distribution/i)).toBeInTheDocument();
    });

    it('filters students by search query', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /students/i }));

        const searchInput = screen.getByPlaceholderText(/search students/i);
        fireEvent.change(searchInput, { target: { value: 'alice' } });

        // Alice should be visible, Bob should not
        expect(screen.getByText(/alice johnson/i)).toBeInTheDocument();
        expect(screen.queryByText(/bob smith/i)).not.toBeInTheDocument();
    });

    it('filters students by belt', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /students/i }));

        const beltFilter = screen.getByRole('combobox');
        fireEvent.change(beltFilter, { target: { value: 'green' } });

        // Green belt students should be visible
        expect(screen.getByText(/alice johnson/i)).toBeInTheDocument();
    });

    it('displays grade submissions button on assignments', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /assignments/i }));

        const gradeButtons = screen.getAllByRole('button', { name: /grade/i });
        expect(gradeButtons.length).toBeGreaterThan(0);
    });

    it('displays action buttons in student table', () => {
        render(<InstructorDashboard />);

        fireEvent.click(screen.getByRole('button', { name: /students/i }));

        const viewButtons = screen.getAllByRole('button', { name: /view/i });
        expect(viewButtons.length).toBeGreaterThan(0);
    });
});