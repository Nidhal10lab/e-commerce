import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react'
import { adminLogout } from '../../redux/adminAuthSlice'
import { showToast } from '../../redux/toastSlice'
import logo from '../../assets/logo.png'

export function AdminSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { admin } = useSelector((state) => state.adminAuth)

  function handleLogout() {
    dispatch(adminLogout())
    dispatch(showToast('Logged out of Admin Portal successfully', 'info'))
    navigate('/login')
  }

  const navItems = [
    {
      to: '/admin',
      end: true,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/products',
      label: 'Products',
      icon: Package,
    },
    {
      to: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      to: '/admin/orders',
      label: 'Orders',
      icon: ShoppingBag,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1E2E54] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Nav */}
        <div>
          {/* Header & Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3">
              <img src={logo} alt="FYNI Logo" className="h-8 object-contain" />
              <div>
                <span className="block text-xs uppercase tracking-[2px] font-semibold text-amber-300">
                  Admin Portal
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-6">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-3">
              Main Menu
            </p>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose()
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition duration-150 ${
                        isActive
                          ? 'bg-amber-400 text-[#1E2E54] font-bold shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* View Storefront Link */}
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">
              Live
            </span>
          </Link>

          {/* Admin Profile Box */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#1E2E54] font-bold flex items-center justify-center shrink-0 text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-white/50 truncate">
                  {admin?.email || 'admin@gmail.com'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 rounded-lg transition cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

