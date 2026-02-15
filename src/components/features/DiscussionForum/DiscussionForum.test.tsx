/**
 * Tests for DiscussionForum Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiscussionForum } from './DiscussionForum';

describe('DiscussionForum', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders forum header', () => {
        render(<DiscussionForum />);
        expect(screen.getByText(/discussion forum/i)).toBeInTheDocument();
    });

    it('shows thread list with demo posts', () => {
        render(<DiscussionForum />);
        // Use getAllByText since there might be multiple matches
        const rSquared = screen.getAllByText(/r-squared/i);
        expect(rSquared.length).toBeGreaterThan(0);
    });

    it('displays search input', () => {
        render(<DiscussionForum />);
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('allows searching threads', () => {
        render(<DiscussionForum />);

        const searchInput = screen.getByPlaceholderText(/search/i);
        fireEvent.change(searchInput, { target: { value: 'test search' } });

        expect(searchInput).toHaveValue('test search');
    });

    it('shows category tabs', () => {
        render(<DiscussionForum />);
        expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument();
    });

    it('allows filtering by category', () => {
        render(<DiscussionForum />);

        const statsTab = screen.getByRole('button', { name: /statistics/i });
        fireEvent.click(statsTab);

        expect(statsTab).toHaveClass('active');
    });

    it('displays post stats', () => {
        render(<DiscussionForum />);
        // Posts show reply count, views
        const viewIcons = screen.getAllByText(/👁/);
        expect(viewIcons.length).toBeGreaterThan(0);
    });

    it('shows post author info', () => {
        render(<DiscussionForum />);
        expect(screen.getByText(/mike johnson/i) || screen.getByText(/emma davis/i)).toBeInTheDocument();
    });

    it('shows pinned badge on pinned posts', () => {
        render(<DiscussionForum />);
        expect(screen.getByText(/pinned/i)).toBeInTheDocument();
    });

    it('shows resolved badge on resolved posts', () => {
        render(<DiscussionForum />);
        // Resolved badge appears on resolved posts
        const resolvedElements = screen.getAllByText(/resolved|✓/i);
        expect(resolvedElements.length).toBeGreaterThan(0);
    });

    it('opens post detail when clicked', () => {
        render(<DiscussionForum />);

        // Get the first post card using a more specific selector
        const postCards = document.querySelectorAll('.post-card');
        expect(postCards.length).toBeGreaterThan(0);
        fireEvent.click(postCards[0]!);

        expect(screen.getByText(/back to discussions/i)).toBeInTheDocument();
    });

    it('shows new post button when user is logged in', () => {
        const currentUser = { id: '1', name: 'Test User' };
        render(<DiscussionForum currentUser={currentUser} />);
        expect(screen.getByRole('button', { name: /new post/i })).toBeInTheDocument();
    });

    it('hides new post button when no user', () => {
        render(<DiscussionForum />);
        expect(screen.queryByRole('button', { name: /new post/i })).not.toBeInTheDocument();
    });

    it('opens new post form when button clicked', () => {
        const currentUser = { id: '1', name: 'Test User' };
        render(<DiscussionForum currentUser={currentUser} />);

        const newPostBtn = screen.getByRole('button', { name: /new post/i });
        fireEvent.click(newPostBtn);

        expect(screen.getByText(/create new post/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    });

    it('calls onNewPost when creating a post', () => {
        const currentUser = { id: '1', name: 'Test User' };
        const onNewPost = vi.fn();
        render(<DiscussionForum currentUser={currentUser} onNewPost={onNewPost} />);

        // Open form
        fireEvent.click(screen.getByRole('button', { name: /new post/i }));

        // Fill form
        const titleInput = screen.getByPlaceholderText(/title/i);
        const contentTextarea = screen.getByPlaceholderText(/question or discussion/i);

        fireEvent.change(titleInput, { target: { value: 'Test Title' } });
        fireEvent.change(contentTextarea, { target: { value: 'Test content for the post' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /^post$/i }));

        expect(onNewPost).toHaveBeenCalled();
    });
});