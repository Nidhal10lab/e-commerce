import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/cartSlice'
import { placeOrder } from '../redux/ordersSlice'
import { CheckCircle, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'

function Checkout() {
  const dispatch = useDispatch()
  const navigate =useNavigate()

  const { items } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const { placingOrder } = useSelector(state => state.orders)

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD',
  })

  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState('')

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  )
  const shipping = subtotal >= 10000 ? 0 : 299
  const total = subtotal + shipping

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    const orderData = {
      userId: user?.id,
      userEmail: user?.email || '',
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      paymentMethod: form.paymentMethod,
      subtotal,
      shipping,
      total,
      status: 'Confirmed',
      placedAt: new Date().toISOString(),
    }

    try {
      await dispatch(placeOrder(orderData)).unwrap()
      dispatch(clearCart())
      setOrderPlaced(true)
    } catch {
      setError('Failed to place order. Please try again.')
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <CheckCircle size={80} className="text-green-500 mb-6" />
          <h2 className="text-3xl font-semibold text-[#263D70]">Order Placed!</h2>
          <p className="text-gray-500 mt-3 max-w-md">
            Thank you for your order! We'll notify you once it's shipped.
          </p>
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate('/orders')}
              className="bg-[#263D70] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#1D2F57] transition"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/products')}
              className="border border-[#263D70] text-[#263D70] px-7 py-3 rounded-full text-sm font-medium hover:bg-[#263D70]/5 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#263D70] mb-8">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-5">

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#263D70] mb-5 flex items-center gap-2">
                  <MapPin size={20} /> Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter full name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="10-digit mobile number"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={2}
                      placeholder="House no, Street, Area"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      placeholder="State"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      placeholder="6-digit PIN"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#263D70] focus:ring-2 focus:ring-[#263D70]/10"
                    />
                  </div>

                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#263D70] mb-5">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {['COD', 'UPI', 'Card'].map(method => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                        form.paymentMethod === method
                          ? 'border-[#263D70] bg-[#263D70]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={handleChange}
                        className="accent-[#263D70]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#263D70]">
                          {method === 'COD' ? 'Cash on Delivery' : method === 'UPI' ? 'UPI Payment' : 'Credit / Debit Card'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {method === 'COD' ? 'Pay when your order arrives' : method === 'UPI' ? 'Pay via UPI apps' : 'Secure card payment'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
                <h2 className="text-lg font-semibold text-[#263D70] mb-5">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.key} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-contain bg-gray-100 rounded-lg flex-shrink-0"
                        onError={e => { e.target.src = 'https://placehold.co/100x100?text=P' }}
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-[#263D70] leading-tight">{item.product.name}</p>
                        <p className="text-gray-500 text-xs">{item.selectedSize} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#263D70]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#263D70] text-base border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs mt-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={placingOrder || items.length === 0}
                  className="mt-5 w-full bg-[#263D70] text-white py-4 rounded-xl text-sm font-medium hover:bg-[#1D2F57] transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {placingOrder ? 'Placing Order...' : (
                    <>Place Order <ChevronRight size={18} /></>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
