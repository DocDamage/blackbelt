/**
 * Pagination Component Accessibility Tests
 * 
 * Validates WCAG compliance for the Pagination component
 * @technical_debt Issue 53: Automated Accessibility Testing
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Pagination } from './Pagination';

expect.extend(toHaveNoViolations);

describe('Pagination Accessibility', () => {
    const defaultProps = {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 10,
        onPageChange: vi.fn(),
    };

    it('should have no accessibility violations on first page', async () => {
        const { container } = render(<Pagination {...defaultProps} currentPage={1} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations on middle page', async () => {
        const { container } = render(<Pagination {...defaultProps} currentPage={5} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations on last page', async () => {
        const { container } = render(<Pagination {...defaultProps} currentPage={10} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when disabled', async () => {
        const { container } = render(<Pagination {...defaultProps} disabled />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations without item count', async () => {
        const { container } = render(<Pagination {...defaultProps} showItemCount={false} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with custom label', async () => {
        const { container } = render(<Pagination {...defaultProps} label="products" />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with many pages', async () => {
        const { container } = render(
            <Pagination 
                {...defaultProps} 
                totalItems={1000} 
                itemsPerPage={10}
                currentPage={50}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have appropriate navigation landmarks', async () => {
        const { container } = render(<Pagination {...defaultProps} label="products" />);
        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
        expect(nav).toHaveAttribute('aria-label', 'products pagination');
    });

    it('should have accessible page buttons with proper labels', async () => {
        const { container } = render(<Pagination {...defaultProps} currentPage={3} />);
        
        // Previous button
        const prevButton = container.querySelector('[aria-label="Go to previous page"]');
        expect(prevButton).toBeInTheDocument();
        
        // Next button
        const nextButton = container.querySelector('[aria-label="Go to next page"]');
        expect(nextButton).toBeInTheDocument();
        
        // Page number buttons
        const page3Button = container.querySelector('[aria-label="Go to page 3"]');
        expect(page3Button).toBeInTheDocument();
        expect(page3Button).toHaveAttribute('aria-current', 'page');
    });

    it('should have disabled state for navigation buttons at boundaries', async () => {
        const { container } = render(<Pagination {...defaultProps} currentPage={1} />);
        
        const prevButton = container.querySelector('[aria-label="Go to previous page"]');
        expect(prevButton).toBeDisabled();
        
        const nextButton = container.querySelector('[aria-label="Go to next page"]');
        expect(nextButton).not.toBeDisabled();
    });

    it('should announce item count changes', async () => {
        const { container } = render(<Pagination {...defaultProps} />);
        const countElement = container.querySelector('[aria-live="polite"]');
        expect(countElement).toBeInTheDocument();
        expect(countElement).toHaveTextContent('1–10 of 100 items');
    });
});
