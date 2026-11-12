import { Menu, ShieldCheck, Calendar } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export function AdminHeader({ onToggleSidebar }) {
  const location = useLocation()
  const { admin } = useSelector((state) => state.adminAuth)

  const titles = {
    '/admin': 'Dashboard Overview',
    '/admin/products': 'Product Management',
    '/admin/users': 'User Management',
    '/admin/orders': 'Order Management',
  }

  const currentTitle = titles[location.pathname] || 'Admin Portal'

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#263D70]">
              {currentTitle}
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              FYNI Mattress E-Commerce Control Center
            </p>
          </div>
        </div>

        {/* Right: Date & Status */}
        <div className="flex items-center gap-3">
          {/* Date Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{today}</span>
          </div>

          {/* Admin Role Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">{admin?.name || 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
