import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, UserRound, Package } from 'lucide-react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { clearWishlist } from '../redux/wishlistSlice'
import { clearCart } from '../redux/cartSlice'

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)

  const { user, isAuthenticated } = useSelector(state => state.auth)
  const wishlistItems = useSelector(state => state.wishlist.items)
  const cartItems = useSelector(state => state.cart.items)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  function handleLogout() {
    dispatch(logout())
    dispatch(clearWishlist())
    dispatch(clearCart())
    setShowDropdown(false)
    navigate('/')
  }

  return (
    <nav className="relative border-2 rounded-xl flex justify-between items-center px-4 bg-[#2C4179] m-3 py-3">

      {/* Logo */}
      <Link to="/">
        <img
          src={logo}
          alt="FYNI Logo"
          className="w-30"
        />
      </Link>

      {/* Center Links */}
      <div className="flex gap-6 text-white">
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
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4 text-white">

        {/* Wishlist */}
        <Link to="/wishlist" className="relative">
          <Heart size={25} className="text-white" />

          {wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-[#263D70] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <ShoppingCart size={25} className="cursor-pointer hover:text-gray-300" />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-[#263D70] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Account */}
        <div className="relative">

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="cursor-pointer"
          >
            <UserRound
              size={25}
              className="hover:text-gray-300"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-10 w-56 bg-white text-[#263D70] rounded-xl shadow-lg border border-gray-200 z-50 p-4">

              {isAuthenticated ? (
                <>
                  <p className="font-semibold text-sm">
                    Welcome, {user?.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1 break-all">
                    {user.email}
                  </p>

                  <hr className="my-3" />

                  <Link
                    to="/orders"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 text-sm hover:text-[#A47B3C] mb-3"
                  >
                    <Package size={15} />
                    My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setShowDropdown(false)}
                    className="block text-sm hover:text-gray-500"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setShowDropdown(false)}
                    className="block text-sm mt-3 hover:text-gray-500"
                  >
                    Create Account
                  </Link>
                </>
              )}

            </div>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar
