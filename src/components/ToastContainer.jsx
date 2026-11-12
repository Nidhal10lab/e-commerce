import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeToast } from '../redux/toastSlice'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

function ToastItem({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!toast.duration) return
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id))
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast, dispatch])

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  }

  const borderColors = {
    success: 'border-l-4 border-l-emerald-500',
    error: 'border-l-4 border-l-rose-500',
    warning: 'border-l-4 border-l-amber-500',
    info: 'border-l-4 border-l-blue-500',
  }

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 w-80 md:w-96 p-4 bg-white/95 backdrop-blur-md text-gray-800 rounded-xl shadow-xl border border-gray-100 ${
        borderColors[toast.type] || borderColors.info
      } transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 text-sm font-medium leading-snug">
        {toast.message}
      </div>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-gray-400 hover:text-gray-600 transition p-0.5 rounded cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function ToastContainer() {
  const toasts = useSelector((state) => state.toast.toasts)
  
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer

