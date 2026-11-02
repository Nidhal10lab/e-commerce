import { useSelector, useDispatch } from 'react-redux'
import { removeFromWishlist, clearWishlist } from '../redux/wishlistSlice'
import { addToCart } from '../redux/cartSlice'
import { Heart, ShoppingCart, Trash2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
function Wishlist() {
  const dispatch = useDispatch()
  const { items } = useSelector(state => state.wishlist)
  const { isAuthenticated } = useSelector(state => state.auth)

  function handleMoveToCart(product) {
    const defaultSize = product.sizes?.[0] || 'Standard'
    dispatch(addToCart({ product, selectedSize: defaultSize, quantity: 1 }))
    dispatch(removeFromWishlist(product.id))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <Heart size={72} className="text-[#263D70]/20 mb-6" />
          <h2 className="text-3xl font-semibold text-[#263D70]">Your wishlist is empty</h2>
          <p className="text-gray-500 mt-3 max-w-sm">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link
            to="/products"
            className="mt-8 bg-[#263D70] text-white px-8 py-4 rounded-full font-medium hover:bg-[#1D2F57] transition flex items-center gap-2"
          >
            Browse Products <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#263D70] flex items-center gap-3">
            <Heart size={32} fill="#DC2626" color="#DC2626" />
            My Wishlist
            <span className="text-lg text-gray-500 font-normal">({items.length})</span>
          </h1>

          <button
            onClick={() => dispatch(clearWishlist())}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition"
          >
            <Trash2 size={15} /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-1 transition duration-300"
            >
              {/* Image */}
              <div className="h-48 bg-[#F7F5F0] rounded-xl overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={e => { e.target.src = 'https://placehold.co/300x200?text=Product' }}
                />

                {/* Remove */}
                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                >
                  <Heart size={18} fill="#DC2626" color="#DC2626" />
                </button>
              </div>

              {/* Info */}
              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest text-[#A47B3C]">
                  {product.category}
                </p>
                <h3 className="text-sm font-semibold text-[#263D70] mt-1">
                  {product.name}
                </h3>
                <p className="text-[#263D70] font-bold mt-2">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-col gap-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full flex items-center justify-center gap-2 bg-[#263D70] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D2F57] transition"
                  >
                    <ShoppingCart size={16} />
                    Move to Cart
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 bg-[#263D70] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D2F57] transition"
                  >
                    Login to Add to Cart
                  </Link>
                )}

                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 py-2.5 rounded-xl text-sm hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Wishlist
