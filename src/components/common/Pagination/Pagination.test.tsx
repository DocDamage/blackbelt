/**
 * Tests for Pagination Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
    // Helper to calculate totalItems from desired totalPages
    const createProps = (currentPage: number, totalPages: number, onPageChange = () => { }) => ({
        currentPage,
        totalItems: totalPages * 10, // 10 items per page
        itemsPerPage: 10,
        onPageChange
    });

    it('renders pagination with correct item count', () => {
        render(<Pagination {...createProps(1, 5)} />);

        expect(screen.getByText('1–10 of 50 items')).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
        render(<Pagination {...createProps(1, 5)} />);

        const prevButton = screen.getByLabelText('Go to previous page');
        expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', () => {
        render(<Pagination {...createProps(5, 5)} />);

        const nextButton = screen.getByLabelText('Go to next page');
        expect(nextButton).toBeDisabled();
    });

    it('enables both buttons on middle page', () => {
        render(<Pagination {...createProps(3, 5)} />);

        const prevButton = screen.getByLabelText('Go to previous page');
        const nextButton = screen.getByLabelText('Go to next page');

        expect(prevButton).not.toBeDisabled();
        expect(nextButton).not.toBeDisabled();
    });

    it('calls onPageChange when next button clicked', () => {
        const handleChange = vi.fn();
        render(<Pagination {...createProps(2, 5, handleChange)} />);

        const nextButton = screen.getByLabelText('Go to next page');
        fireEvent.click(nextButton);

        expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange when previous button clicked', () => {
        const handleChange = vi.fn();
        render(<Pagination {...createProps(3, 5, handleChange)} />);

        const prevButton = screen.getByLabelText('Go to previous page');
        fireEvent.click(prevButton);

        expect(handleChange).toHaveBeenCalledWith(2);
    });

    it('renders page numbers as clickable buttons', () => {
        render(<Pagination {...createProps(2, 5)} />);

        // Check page number buttons exist
        expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go to page 2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
    });

    it('highlights current page button', () => {
        render(<Pagination {...createProps(2, 5)} />);

        const currentPageButton = screen.getByRole('button', { name: 'Go to page 2' });
        expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('calls onPageChange when page number clicked', () => {
        const handleChange = vi.fn();
        render(<Pagination {...createProps(1, 5, handleChange)} />);

        const page3Button = screen.getByRole('button', { name: 'Go to page 3' });
        fireEvent.click(page3Button);

        expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('shows ellipsis for large page counts', () => {
        render(<Pagination {...createProps(1, 20)} />);

        // Should show ellipsis when there are many pages
        const ellipsis = screen.getAllByText('…');
        expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('returns null for single page', () => {
        const { container } = render(<Pagination {...createProps(1, 1)} />);

        expect(container.firstChild).toBeNull();
    });

    it('updates item range display correctly', () => {
        render(<Pagination {...createProps(2, 5)} />);

        // Page 2 should show 11-20 of 50
        expect(screen.getByText('11–20 of 50 items')).toBeInTheDocument();
    });
});