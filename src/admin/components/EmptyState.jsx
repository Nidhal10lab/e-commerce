import { PackageOpen } from 'lucide-react'

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records to display right now.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#263D70]/5 flex items-center justify-center text-[#263D70]/40 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#263D70] text-white text-xs font-medium rounded-xl hover:bg-[#1d305a] transition duration-200 shadow-sm cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

