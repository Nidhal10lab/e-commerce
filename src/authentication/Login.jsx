import bed from '../assets/bedimg.jpg'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../redux/authSlice'
import { adminLoginSuccess } from '../redux/adminAuthSlice'
import { showToast } from '../redux/toastSlice'
import { userService } from '../services/userService'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { isAdminAuthenticated } = useSelector((state) => state.adminAuth)

  // Return to original page after login
  const from = location.state?.from
    ? location.state.from.pathname + (location.state.from.search || '')
    : '/'

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true })
    } else if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, isAdminAuthenticated, navigate, from])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // 1. ADMIN AUTHENTICATION CHECK
    // When user types admin@gmail.com and admin123, redirect to admin dashboard
    if (cleanEmail === 'admin@gmail.com' && cleanPassword === 'admin123') {
      const adminData = {
        name: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin',
        loggedInAt: new Date().toISOString(),
      }

      dispatch(adminLoginSuccess(adminData))
      dispatch(
        showToast('Welcome Admin! Redirecting to Admin Dashboard...', 'success')
      )
      navigate('/admin', { replace: true })
      return
    }

    // 2. REGULAR USER AUTHENTICATION
    try {
      setLoading(true)

      const response = await userService.getByEmail(cleanEmail)

      if (response.data.length === 0) {
        const msg = 'Account does not exist. Please register.'
        setError(msg)
        dispatch(showToast(msg, 'error'))
        return
      }

      const user = response.data[0]

      if (user.password !== cleanPassword) {
        const msg = 'Incorrect password. Please try again.'
        setError(msg)
        dispatch(showToast(msg, 'error'))
        return
      }

      // Check if user is blocked by Admin
      if (user.isBlocked) {
        const msg =
          'Your account has been suspended by the administrator. Please contact support.'
        setError(msg)
        dispatch(showToast(msg, 'error'))
        return
      }

      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      }

      dispatch(loginSuccess(loggedInUser))
      dispatch(showToast(`Welcome back, ${user.name}!`, 'success'))
      navigate(from, { replace: true })
    } catch (err) {
      const msg = 'Something went wrong. Please try again.'
      setError(msg)
      dispatch(showToast(msg, 'error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-5 md:p-10 font-sans">
      <div className="w-full max-w-6xl min-h-[600px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Left Side */}
        <div
          className="hidden md:flex relative bg-cover bg-center"
          style={{ backgroundImage: `url(${bed})` }}
        >
          <div className="absolute inset-0 bg-[#263D70]/40"></div>

          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
            <p className="text-sm uppercase tracking-[4px] mb-4 text-amber-300 font-semibold">
              Experience Better Sleep
            </p>

            <h1 className="text-4xl lg:text-5xl font-serif leading-tight">
              Your Comfort, <br />
              Our Priority.
            </h1>

            <p className="mt-4 text-sm text-white/90 max-w-sm leading-6">
              Discover the perfect balance of comfort and support. Because
              better days begin with better nights.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center px-7 py-14 sm:px-14 lg:px-20 bg-[#F7F5F0]">
          {/* Brand */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-serif font-bold tracking-widest text-[#263D70]">
              FYNI
            </h1>

            <p className="text-xs tracking-[4px] text-gray-500 mt-2">
              SLEEP BETTER. LIVE BETTER.
            </p>
          </div>

          {/* Heading */}
          <div className="w-full max-w-sm mb-6">
            <h2 className="text-3xl font-serif text-[#263D70]">Welcome Back</h2>

            <p className="text-gray-500 text-sm mt-2">
              Login to your account to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#263D70] mb-1.5">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm outline-none transition focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#263D70] mb-1.5">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm outline-none transition focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
              />
            </div>

            {/* Error */}
            {error && <p className="text-rose-500 text-xs">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#263D70] text-white py-3 rounded-xl text-sm font-medium tracking-wide hover:bg-[#1d305a] transition duration-300 shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register */}
          <div className="mt-8 text-sm text-gray-500 text-center">
            Don't have an account?
            <Link
              to="/register"
              className="ml-2 text-[#263D70] font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-8 text-xs text-gray-400">
            © 2026 FYNI Mattress. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
