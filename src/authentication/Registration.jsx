
import bed from '../assets/bedimg.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api'

function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cpassword, setCpassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()

    setError("")

    // 1. Check password length
    if (password.length < 6) {
      setError("Password must contain at least 6 characters")
      return
    }

    // 2. Check whether passwords match
    if (password !== cpassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      // 3. Check whether email already exists
      const response = await api.get('/users', {
        params: {
          email: email.trim().toLowerCase()
        }
      })

      if (response.data.length > 0) {
        setError("Email already registered. Please login.")
        return
      }

      // 4. Save new user in db.json
      await api.post('/users', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      })

      // 5. Navigate to login
      navigate('/login')

    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-5 md:p-10">

      <div className="w-full max-w-6xl min-h-[650px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">

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
              Begin Your <br />
              Comfort Journey.
            </h1>

            <p className="mt-4 text-sm text-white/90 max-w-sm leading-6">
              Join FYNI and discover the perfect balance of comfort,
              quality and affordability.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center px-7 py-12 sm:px-14 lg:px-20 bg-[#F7F5F0]">

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
            <h2 className="text-3xl font-serif text-[#263D70]">
              Create Account
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Join us and experience better sleep.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="w-full max-w-sm space-y-4"
          >

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#263D70] mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
              />
            </div>

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
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#263D70] mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#263D70] mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
                required
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#263D70] text-white py-3 rounded-xl text-sm font-medium tracking-wide hover:bg-[#1d305a] transition duration-300 shadow-md disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login Link */}
          <div className="mt-7 text-sm text-gray-500">
            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-[#263D70] font-semibold hover:underline"
            >
              Login
            </Link>
          </div>

          <p className="mt-10 text-xs text-gray-400">
            © 2026 FYNI Mattress. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register
