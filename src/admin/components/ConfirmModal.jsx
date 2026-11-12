import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Modal } from './Modal'

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // danger | warning | primary
  loading = false,
}) {
  const typeConfig = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
      iconBg: 'bg-rose-50',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    primary: {
      icon: <CheckCircle2 className="w-6 h-6 text-[#263D70]" />,
      iconBg: 'bg-[#263D70]/10',
      btn: 'bg-[#263D70] hover:bg-[#1d305a] text-white',
    },
  }

  const current = typeConfig[type] || typeConfig.danger

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 py-2">
        <div className={`p-3 rounded-full shrink-0 ${current.iconBg}`}>
          {current.icon}
        </div>
        <div className="text-sm text-gray-600 leading-relaxed pt-1">
          {message}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-5 py-2 text-sm font-medium rounded-xl transition cursor-pointer shadow-sm disabled:opacity-60 ${current.btn}`}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}
