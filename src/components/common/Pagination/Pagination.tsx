/**
 * Reusable Pagination Component
 * 
 * Provides page navigation for lists with many items.
 */

import { useMemo, useState } from 'react';
import './Pagination.css';

export interface PaginationProps {
    /** Current page number (1-indexed) */
    currentPage: number;
    /** Total number of items */
    totalItems: number;
    /** Items per page */
    itemsPerPage: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
    /** Maximum number of page buttons to show */
    maxVisiblePages?: number;
    /** Whether pagination is disabled */
    disabled?: boolean;
    /** Show item count info */
    showItemCount?: boolean;
    /** Label for accessibility */
    label?: string;
}

export function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    maxVisiblePages = 5,
    disabled = false,
    showItemCount = true,
    label = 'items',
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pageNumbers = useMemo(() => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | 'ellipsis')[] = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        if (currentPage <= halfVisible + 1) {
            // Near the start
            for (let i = 1; i <= maxVisiblePages; i++) {
                pages.push(i);
            }
            if (totalPages > maxVisiblePages) {
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        } else if (currentPage >= totalPages - halfVisible) {
            // Near the end
            pages.push(1);
            pages.push('ellipsis');
            for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // In the middle
            pages.push(1);
            pages.push('ellipsis');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push('ellipsis');
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages, maxVisiblePages]);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) {
        return null;
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
            onPageChange(page);
        }
    };

    return (
        <nav
            className={`pagination ${disabled ? 'pagination--disabled' : ''}`}
            aria-label={`${label} pagination`}
        >
            {showItemCount && (
                <div className="pagination__count" aria-live="polite">
                    {startItem}–{endItem} of {totalItems} {label}
                </div>
            )}

            <div className="pagination__controls">
                <button
                    className="pagination__button pagination__button--nav"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || disabled}
                    aria-label="Go to previous page"
                >
                    ‹
                </button>

                {pageNumbers.map((page, index) =>
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            className={`pagination__button ${page === currentPage ? 'pagination__button--active' : ''
                                }`}
                            onClick={() => handlePageChange(page)}
                            disabled={disabled}
                            aria-label={`Go to page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    className="pagination__button pagination__button--nav"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || disabled}
                    aria-label="Go to next page"
                >
                    ›
                </button>
            </div>
        </nav>
    );
}

/**
 * Hook to manage pagination state
 */
export function usePagination(
    totalItems: number,
    itemsPerPage: number = 10,
    initialPage: number = 1
) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return { start, end };
    }, [currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);
    const firstPage = () => goToPage(1);
    const lastPage = () => goToPage(totalPages);

    return {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        setCurrentPage,
    };
}
