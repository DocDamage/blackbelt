/**
 * Tests for Loading Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading, LoadingOverlay, Skeleton } from './Loading';

describe('Loading', () => {
    it('renders with default props', () => {
        render(<Loading />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('displays custom message', () => {
        render(<Loading message="Loading data..." />);
        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('applies small size class', () => {
        const { container } = render(<Loading size="small" />);
        expect(container.firstChild).toHaveClass('loading--small');
    });

    it('applies large size class', () => {
        const { container } = render(<Loading size="large" />);
        expect(container.firstChild).toHaveClass('loading--large');
    });

    it('renders as fullscreen when fullscreen prop is true', () => {
        const { container } = render(<Loading fullscreen />);
        expect(container.firstChild).toHaveClass('loading--fullscreen');
    });

    it('has accessible loading text', () => {
        render(<Loading />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders spinner element', () => {
        const { container } = render(<Loading />);
        expect(container.querySelector('.loading__spinner')).toBeInTheDocument();
    });

    it('hides message when not provided', () => {
        const { container } = render(<Loading />);
        expect(container.querySelector('.loading__message')).not.toBeInTheDocument();
    });

    it('applies inline class when inline prop is true', () => {
        const { container } = render(<Loading inline />);
        expect(container.firstChild).toHaveClass('loading--inline');
    });

    it('renders ring element inside spinner', () => {
        const { container } = render(<Loading />);
        expect(container.querySelector('.loading__ring')).toBeInTheDocument();
    });
});

describe('LoadingOverlay', () => {
    it('renders with default message', () => {
        render(<LoadingOverlay />);
        // Multiple elements contain "Loading..." so check for at least one
        const loadingElements = screen.getAllByText('Loading...');
        expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('renders with custom message', () => {
        render(<LoadingOverlay message="Please wait..." />);
        expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('has overlay class', () => {
        const { container } = render(<LoadingOverlay />);
        expect(container.querySelector('.loading-overlay')).toBeInTheDocument();
    });
});

describe('Skeleton', () => {
    it('renders with default props', () => {
        const { container } = render(<Skeleton />);
        expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });

    it('renders multiple skeletons with count', () => {
        const { container } = render(<Skeleton count={3} />);
        expect(container.querySelectorAll('.skeleton').length).toBe(3);
    });

    it('applies variant class', () => {
        const { container } = render(<Skeleton variant="circular" />);
        expect(container.querySelector('.skeleton--circular')).toBeInTheDocument();
    });

    it('applies custom width and height', () => {
        const { container } = render(<Skeleton width="100px" height="50px" />);
        const skeleton = container.querySelector('.skeleton');
        expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
    });
});