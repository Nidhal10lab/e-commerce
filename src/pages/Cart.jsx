import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice'
import { addToWishlist } from '../redux/wishlistSlice'
import { Trash2, Heart, ShoppingBag, ChevronRight, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Cart() {
  const dispatch = useDispatch()
  const { items } = useSelector(state => state.cart)

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  )
  const shipping = subtotal > 0 ? (subtotal >= 10000 ? 0 : 299) :0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <ShoppingBag size={72} className="text-[#263D70]/20 mb-6" />
          <h2 className="text-3xl font-semibold text-[#263D70]">Your cart is empty</h2>
          <p className="text-gray-500 mt-3 max-w-sm">
            Looks like you haven't added anything to your cart yet. Browse our products and find your perfect comfort.
          </p>
          <Link
            to="/products"
            className="mt-8 bg-[#263D70] text-white px-8 py-4 rounded-full font-medium hover:bg-[#1D2F57] transition flex items-center gap-2"
          >
            Shop Now <ChevronRight size={18} />
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
          <h1 className="text-3xl md:text-4xl font-semibold text-[#263D70]">
            Your Cart
          </h1>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition"
          >
            <Trash2 size={15} /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.key}
                className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm"
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-[#F7F5F0] rounded-xl overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    onError={e => { e.target.src = 'https://placehold.co/200x200?text=Product' }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#A47B3C] uppercase tracking-wider">
                        {item.product.category}
                      </p>
                      <h3 className="text-base font-semibold text-[#263D70] mt-0.5">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Size: {item.selectedSize}
                      </p>
                    </div>
                    <p className="text-base font-bold text-[#263D70]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-[#263D70]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          dispatch(addToWishlist(item.product))
                          dispatch(removeFromCart(item.key))
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                        title="Move to Wishlist"
                      >
                        <Heart size={18} />
                      </button>

                      <button
                        onClick={() => dispatch(removeFromCart(item.key))}
                        className="text-gray-400 hover:text-red-500 transition"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold text-[#263D70] mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? <span className="text-green-600 font-medium">Free</span>
                      : `₹${shipping}`
                    }
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Free shipping on orders above ₹10,000
                  </p>
                )}

                <div className="border-t pt-3 flex justify-between font-bold text-[#263D70] text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 w-full bg-[#263D70] text-white py-4 rounded-xl text-sm font-medium hover:bg-[#1D2F57] transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ChevronRight size={18} />
              </Link>

              <Link
                to="/products"
                className="mt-3 w-full border border-[#263D70] text-[#263D70] py-3 rounded-xl text-sm font-medium hover:bg-[#263D70]/5 transition flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
