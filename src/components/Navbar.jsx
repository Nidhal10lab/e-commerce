
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {

  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const navigate = useNavigate()

  // Check login status
  useEffect(() => {

    function checkUser() {
      const loggedUser = localStorage.getItem('fyniUser')

      setUser(loggedUser ? JSON.parse(loggedUser) : null)
    }

    checkUser()

    // Listen for login/logout changes
    window.addEventListener('authChanged', checkUser)

    return () => {
      window.removeEventListener('authChanged', checkUser)
    }

  }, [])

  // Logout function
  function handleLogout() {

    localStorage.removeItem('fyniUser')

    window.dispatchEvent(new Event('authChanged'))

    setShowDropdown(false)

    navigate('/')

  }

  return (

    <nav className="flex justify-between items-center px-8 py-5 bg-[#F7F5F0]">

      {/* Logo */}
      <Link to="/" className="text-3xl font-serif font-bold tracking-widest text-[#263D70]">
        FYNI
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 text-[#263D70] font-medium">

        <Link to="/">Home</Link>
        <Link to="/products">Shop</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* Account */}
        <div className="relative">

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-[#263D70] hover:opacity-70"
          >

            {/* User Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>

            <span className="hidden sm:block text-sm">
              {user ? user.name : "Login"}
            </span>

          </button>

          {/* Dropdown */}
          {showDropdown && (

            <div className="absolute right-0 top-12 w-52 bg-white shadow-xl rounded-xl border border-gray-100 z-50 p-3">

              {user ? (

                <>

                  <div className="px-3 py-2 border-b border-gray-100">

                    <p className="text-sm font-semibold text-[#263D70]">
                      {user.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 break-all">
                      {user.email}
                    </p>

                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    My Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>

                </>

              ) : (

                <>

                  <Link
                    to="/login"
                    onClick={() => setShowDropdown(false)}
                    className="block px-3 py-3 text-sm text-[#263D70] hover:bg-gray-100 rounded-lg"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setShowDropdown(false)}
                    className="block px-3 py-3 text-sm text-[#263D70] hover:bg-gray-100 rounded-lg"
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
