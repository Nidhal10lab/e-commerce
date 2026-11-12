import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1

  if (totalPages <= 1 && totalItems <= pageSize) {
    if (totalItems === 0) return null
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-xs text-gray-500">
        <span>Showing all {totalItems} items</span>
      </div>
    )
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const delta = 1 // adjacent pages

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
      <div className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-700">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-700">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span key={`dots-${index}`} className="px-2 text-xs text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] h-8 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#263D70] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

