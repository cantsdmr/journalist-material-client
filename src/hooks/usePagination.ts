import { useCallback } from "react";

interface UsePaginationProps{
    pageSize: number;
    currentPage: number;
    hasMore: boolean;
    onPageChange: (page: number) => void;
}

export const usePagination = ({
    pageSize,
    currentPage,
    hasMore,
    onPageChange,
}: UsePaginationProps) => {
    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }, [currentPage, onPageChange]);

    const handleNextPage = useCallback(() => {
        if (hasMore) {
            onPageChange(currentPage + 1);
        }
    }, [hasMore, onPageChange, currentPage]);

    if ((!hasMore && currentPage === 1)) {
        return null;
    }

    return {
        currentPage,
        pageSize,
        hasMore,
        handleNextPage,
        handlePreviousPage,
    };
}