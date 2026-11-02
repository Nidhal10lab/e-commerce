
import bed from '../assets/bedimg.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api'

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    setError("")

    try {
      setLoading(true)

      // 1. Find user using email
      const response = await api.get('/users', {
        params: {
          email: email.trim().toLowerCase()
        }
      })

      // 2. Check whether user exists
      if (response.data.length === 0) {
        setError("Account does not exist. Please register.")
        return
      }

      // 3. Get user details
      const user = response.data[0]

      // 4. Check password
      if (user.password !== password) {
        setError("Incorrect password. Please try again.")
        return
      }

      // 5. Save logged-in user (demo session)
      const loggedInUser = {
        id: user.id,
        name: user.name,
        email: user.email
      }

      localStorage.setItem(
        'fyniUser',
        JSON.stringify(loggedInUser)
      )

      // 6. Navigate to home
      navigate('/home')

    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-5 md:p-10">

      <div className="w-full max-w-6xl min-h-[600px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

        {/* Left Side */}
        <div
          className="hidden md:flex relative bg-cover bg-center"
          style={{ backgroundImage: `url(${bed})` }}
        >

          <div className="absolute inset-0 bg-[#263D70]/30"></div>

          <div className="relative z-10 flex flex-col justify-end p-12 text-white">

            <p className="text-sm uppercase tracking-[4px] mb-4">
              Experience Better Sleep
            </p>

            <h1 className="text-4xl lg:text-5xl font-serif leading-tight">
              Your Comfort, <br />
              Our Priority.
            </h1>

            <p className="mt-4 text-sm text-white/90 max-w-sm leading-6">
              Discover the perfect balance of comfort and support.
              Because better days begin with better nights.
            </p>

          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center px-7 py-14 sm:px-14 lg:px-20 bg-[#F7F5F0]">

          {/* Brand */}
          <div className="mb-10 text-center">

            <h1 className="text-4xl font-serif font-bold tracking-widest text-[#263D70]">
              FYNI
            </h1>

            <p className="text-xs tracking-[4px] text-gray-500 mt-2">
              SLEEP BETTER. LIVE BETTER.
            </p>

          </div>

          {/* Heading */}
          <div className="w-full max-w-sm mb-8">

            <h2 className="text-3xl font-serif text-[#263D70]">
              Welcome Back
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Login to your account to continue.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#263D70] mb-2">
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
              <label className="block text-sm font-medium text-[#263D70] mb-2">
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
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#263D70] text-white py-3 rounded-xl text-sm font-medium tracking-wide hover:bg-[#1d305a] transition duration-300 shadow-md disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}
          <div className="mt-8 text-sm text-gray-500">

            Don't have an account?

            <Link
              to="/register"
              className="ml-2 text-[#263D70] font-semibold hover:underline"
            >
              Create Account
            </Link>

          </div>

          {/* Footer */}
          <p className="mt-12 text-xs text-gray-400">
            © 2026 FYNI Mattress. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
