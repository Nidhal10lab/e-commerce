import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, UserRound, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { adminLogout } from '../redux/adminAuthSlice'
import { clearWishlist } from '../redux/wishlistSlice'
import { clearCart } from '../redux/cartSlice'
import { showToast } from '../redux/toastSlice'

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { admin, isAdminAuthenticated } = useSelector((state) => state.adminAuth)
  const wishlistItems = useSelector((state) => state.wishlist.items)
  const cartItems = useSelector((state) => state.cart.items)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  function handleLogout() {
    dispatch(logout())
    dispatch(clearWishlist())
    dispatch(clearCart())
    dispatch(showToast('Logged out successfully', 'info'))
    setShowDropdown(false)
    navigate('/')
  }

  function handleAdminLogout() {
    dispatch(adminLogout())
    dispatch(showToast('Admin session closed', 'info'))
    setShowDropdown(false)
    navigate('/')
  }

  return (
    <nav className="relative border-2 rounded-xl flex justify-between items-center px-4 bg-[#2C4179] m-3 py-3">
      {/* left side logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="FYNI Logo" className="w-30" />
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex gap-6 text-white text-[15px]">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        <Link to="/products" className="hover:text-gray-300">
          Shop
        </Link>

        <Link to="/#about" className="hover:text-gray-300">
          About Us
        </Link>

        <Link to="/#contact" className="hover:text-gray-300">
          Contact Us
        </Link>

        {isAdminAuthenticated && (
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold"
          >
            <ShieldCheck size={18} />
            <span>Admin Dashboard</span>
          </Link>
        )}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4 text-white">
        {/* Wishlist */}
        <Link to="/wishlist" className="relative">
          <Heart size={25} className="text-white hover:text-gray-300" />

          {wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-[#263D70] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <ShoppingCart
            size={25}
            className="cursor-pointer hover:text-gray-300"
          />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-[#263D70] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="cursor-pointer flex items-center"
          >
            <UserRound size={25} className="hover:text-gray-300" />
            {isAdminAuthenticated && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#2C4179]" />
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-10 w-56 bg-white text-[#263D70] rounded-xl shadow-xl border border-gray-200 z-50 p-4">
              {isAdminAuthenticated && (
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
                    <ShieldCheck size={14} />
                    <span>Administrator</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-800">
                    {admin?.name || 'Admin'}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {admin?.email}
                  </p>
                  <Link
                    to="/admin"
                    onClick={() => setShowDropdown(false)}
                    className="mt-2 block w-full text-center py-1.5 bg-[#263D70] text-white rounded-lg text-xs font-semibold hover:bg-[#1E2E54]"
                  >
                    Open Admin Panel
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    className="w-full text-left text-xs text-rose-600 hover:text-rose-800 mt-2 font-medium cursor-pointer"
                  >
                    Logout Admin
                  </button>
                </div>
              )}

              {isAuthenticated ? (
                <>
                  <p className="font-semibold text-sm">Welcome, {user?.name}</p>

                  <p className="text-xs text-gray-500 mt-1 break-all">
                    {user.email}
                  </p>

                  <hr className="my-3" />

                  <Link
                    to="/orders"
                    onClick={() => setShowDropdown(false)}
                    className="block text-sm text-gray-700 hover:text-[#263D70] mb-2"
                  >
                    My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Logout User
                  </button>
                </>
              ) : !isAdminAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setShowDropdown(false)}
                    className="block text-sm font-semibold hover:text-gray-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setShowDropdown(false)}
                    className="block text-xs text-gray-500 hover:text-gray-800"
                  >
                    Create Account
                  </Link>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
