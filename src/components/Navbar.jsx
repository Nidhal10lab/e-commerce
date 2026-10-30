import { ShoppingCart, Heart,UserRound } from 'lucide-react'
import image from '../assets/logo.png'
import { Link } from 'react-router-dom'
function Navbar(){
    return (
        <nav className="relative border -2 rounded-xl flex justify-between items-center px-4 bg-[#2C4179] m-3">
            {/* left side */}
            <div>
                <img src={image} className='w-30'/>
            </div>
            {/* center */}
            <div className='flex gap-6 text-white'>
                <Link to='/'>Home</Link>
                <Link to='/'>Shop</Link>
                <Link to='/'>About Us</Link>
                <Link to='/'>Contact Us</Link>
            </div>
            {/* right side */}
            <div className='flex gap-4'>
                <Link to="" aria-label='Wishlist'><Heart size={25} className='text-white'></Heart></Link>
                  <Link to="/cart" aria-label="Shopping cart"><ShoppingCart size={25} className="text-white" /></Link>
                <Link to="" aria-label='UserRound'><UserRound size={25} className='text-white'></UserRound></Link>

            </div> 
        </nav>
    )
}
export default Navbar