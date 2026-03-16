'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PokemonPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function PokemonPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PokemonPaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of middle section
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 3) {
        start = 2
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
        end = totalPages - 1
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...')
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className="flex items-center justify-center gap-1 bg-card/50 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-sm border border-border/50"
      aria-label="Pagination"
    >
      {/* First page */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={!canGoPrevious || isLoading}
        aria-label="Go to first page"
        className="h-8 w-8 rounded-full"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous page */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious || isLoading}
        aria-label="Go to previous page"
        className="h-8 w-8 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-0.5 mx-1">
        {pageNumbers.map((page, index) =>
          typeof page === 'string' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground text-sm"
              aria-hidden="true"
            >
              {page}
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'h-8 w-8 rounded-full text-sm font-medium',
                page === currentPage && 'shadow-md'
              )}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next page */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext || isLoading}
        aria-label="Go to next page"
        className="h-8 w-8 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last page */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={!canGoNext || isLoading}
        aria-label="Go to last page"
        className="h-8 w-8 rounded-full"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
