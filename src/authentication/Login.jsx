import bed from '../assets/bedimg.jpg'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-5 md:p-10">
      <div className="w-full max-w-6xl min-h-[600px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">
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
        <div className="flex flex-col justify-center items-center px-7 py-14 sm:px-14 lg:px-20 bg-[#F7F5F0]">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-serif font-bold tracking-widest text-[#263D70]">
              FYNI
            </h1>
            <p className="text-xs tracking-[4px] text-gray-500 mt-2">
              SLEEP BETTER. LIVE BETTER.
            </p>
          </div>
          <div className="w-full max-w-sm mb-8">
            <h2 className="text-3xl font-serif text-[#263D70]">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Login to your account to continue.
            </p>
          </div>
          <form
            className="w-full max-w-sm space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div>
              <label className="block text-sm font-medium text-[#263D70] mb-2">
                Email Address
              </label>              
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}required className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm outline-none transition focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"/>
            </div>
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#263D70] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#263D70] text-white py-3 rounded-xl text-sm font-medium tracking-wide hover:bg-[#1d305a] transition duration-300 shadow-md"
            >
              Login
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
