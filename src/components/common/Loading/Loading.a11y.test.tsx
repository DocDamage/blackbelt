/**
 * Loading Component Accessibility Tests
 * 
 * Validates WCAG compliance for the Loading component
 * @technical_debt Issue 53: Automated Accessibility Testing
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Loading, LoadingOverlay, Skeleton } from './Loading';

expect.extend(toHaveNoViolations);

describe('Loading Accessibility', () => {
    describe('Loading', () => {
        it('should have no accessibility violations with message', async () => {
            const { container } = render(<Loading message="Loading data..." />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations without message', async () => {
            const { container } = render(<Loading />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations with all sizes', async () => {
            const { container: small } = render(<Loading size="small" />);
            const { container: medium } = render(<Loading size="medium" />);
            const { container: large } = render(<Loading size="large" />);
            
            expect(await axe(small)).toHaveNoViolations();
            expect(await axe(medium)).toHaveNoViolations();
            expect(await axe(large)).toHaveNoViolations();
        });

        it('should have no accessibility violations in fullscreen mode', async () => {
            const { container } = render(<Loading fullscreen message="Loading..." />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations in inline mode', async () => {
            const { container } = render(<Loading inline message="Saving..." />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have appropriate aria attributes for status announcement', async () => {
            const { container } = render(<Loading message="Processing" />);
            const statusElement = container.querySelector('[role="status"]');
            expect(statusElement).toBeInTheDocument();
            expect(statusElement).toHaveAttribute('aria-live', 'polite');
        });

        it('should have screen reader text for spinner', async () => {
            const { container } = render(<Loading />);
            const srOnly = container.querySelector('.sr-only');
            expect(srOnly).toBeInTheDocument();
            expect(srOnly).toHaveTextContent('Loading...');
        });
    });

    describe('LoadingOverlay', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(<LoadingOverlay message="Please wait..." />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations with default message', async () => {
            const { container } = render(<LoadingOverlay />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Skeleton', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(<Skeleton />);
            // Skeletons are decorative and have aria-hidden
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations with multiple items', async () => {
            const { container } = render(<Skeleton count={5} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations for all variants', async () => {
            const { container: text } = render(<Skeleton variant="text" />);
            const { container: rect } = render(<Skeleton variant="rectangular" />);
            const { container: circular } = render(<Skeleton variant="circular" />);
            
            expect(await axe(text)).toHaveNoViolations();
            expect(await axe(rect)).toHaveNoViolations();
            expect(await axe(circular)).toHaveNoViolations();
        });

        it('should be hidden from screen readers', async () => {
            const { container } = render(<Skeleton count={3} />);
            const skeletons = container.querySelectorAll('.skeleton');
            skeletons.forEach(skeleton => {
                expect(skeleton).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });
});
