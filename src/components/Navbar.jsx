
import { ShoppingCart, Heart, UserRound } from 'lucide-react'
import image from '../assets/logo.png'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="relative flex justify-between items-center px-4 bg-[#2C4179] m-3 rounded-xl">

      {/* Left side - Logo */}
      <div>
        <Link to="/">
          <img src={image} alt="Fyni Mattress" className="w-30" />
        </Link>
      </div>

      {/* Center - Navigation */}
      <div className="flex gap-6 text-white">
        <Link to="/">Home</Link>
        <Link to="/products">Shop</Link>
        <Link to="/#about">About Us</Link>
        <Link to="/#contact">Contact Us</Link>
      </div>

      {/* Right side - Icons */}
    
     <div className="flex gap-4">
          <Link to="/" aria-label="Heart">
          <Heart size={25} className="text-white" />
        </Link>
        <Link to="/cart" aria-label="Shopping cart">
          <ShoppingCart size={25} className="text-white" />
        </Link>

        <Link to="/login" aria-label="Login">
          <UserRound size={25} className="text-white" />
        </Link>
      </div>

    </nav>
  )
}

export default Navbar
