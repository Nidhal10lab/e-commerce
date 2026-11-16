import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/cartSlice'
import { placeOrder } from '../redux/ordersSlice'
import { showToast } from '../redux/toastSlice'
import { logout } from '../redux/authSlice'
import { userService } from '../services/userService'
import {
  CheckCircle, CheckCircle2, ChevronRight, MapPin,
  Clock, Truck, PackageCheck, ShieldAlert
} from 'lucide-react'
import Navbar from '../components/Navbar'

// ---- Field validators ----
function validate(form) {
  const e = {}
  if (!form.fullName.trim() || form.fullName.trim().length < 3)
    e.fullName = 'Full name must be at least 3 characters.'
  else if (!/^[a-zA-Z\s.'-]+$/.test(form.fullName.trim()))
    e.fullName = 'Full name should only contain letters.'

  if (!form.phone.trim())
    e.phone = 'Phone number is required.'
  else if (!/^\d+$/.test(form.phone.trim()))
    e.phone = 'Phone number must contain only digits.'
  else if (form.phone.trim().length !== 10)
    e.phone = 'Phone number must be exactly 10 digits.'

  if (!form.address.trim() || form.address.trim().length < 10)
    e.address = 'Address must be at least 10 characters.'

  if (!form.city.trim() || form.city.trim().length < 2)
    e.city = 'City is required (at least 2 characters).'
  else if (!/^[a-zA-Z\s]+$/.test(form.city.trim()))
    e.city = 'City should only contain letters.'

  if (!form.state.trim() || form.state.trim().length < 2)
    e.state = 'State is required (at least 2 characters).'
  else if (!/^[a-zA-Z\s]+$/.test(form.state.trim()))
    e.state = 'State should only contain letters.'

  if (!form.pincode.trim())
    e.pincode = 'PIN code is required.'
  else if (!/^\d+$/.test(form.pincode.trim()))
    e.pincode = 'PIN code must contain only digits.'
  else if (form.pincode.trim().length !== 6)
    e.pincode = 'PIN code must be exactly 6 digits.'

  return e
}

const TRACK_STEPS = [
  { key: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2, eta: 'Today' },
  { key: 'Processing', label: 'Processing',      icon: Clock,         eta: 'Day 1–2' },
  { key: 'Shipped',   label: 'Shipped',          icon: Truck,         eta: 'Day 2–5' },
  { key: 'Delivered', label: 'Delivered',        icon: PackageCheck,  eta: 'Day 5–7' },
]

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-rose-500 text-xs mt-1">{msg}</p>
}

function Checkout() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const { items }        = useSelector(state => state.cart)
  const { user }         = useSelector(state => state.auth)
  const { placingOrder } = useSelector(state => state.orders)

  const [form, setForm] = useState({
    fullName:      user?.name || '',
    phone:         '',
    address:       '',
    city:          '',
    state:         '',
    pincode:       '',
    paymentMethod: 'COD',
  })

  const [orderPlaced, setOrderPlaced] = useState(false)
  const [countdown,   setCountdown]   = useState(3)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  // --- Block check: re-fetch user on mount to verify not blocked mid-session ---
  useEffect(() => {
    async function checkBlocked() {
      if (!user?.id) return
      try {
        const res = await userService.getById(user.id)
        if (res.data?.isBlocked) {
          dispatch(logout())
          dispatch(showToast('Your account has been suspended. Please contact support.', 'error'))
          navigate('/login', { replace: true })
        }
      } catch { /* ignore network errors silently */ }
    }
    checkBlocked()
  }, [user, dispatch, navigate])

  // --- Auto-redirect countdown after order placed ---
  useEffect(() => {
    if (!orderPlaced) return
    if (countdown <= 0) {
      navigate('/orders', { replace: true })
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [orderPlaced, countdown, navigate])

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = subtotal >= 10000 ? 0 : 299
  const total    = subtotal + shipping

  function handleChange(e) {
    const { name, value } = e.target
    // For phone and pincode, strip non-digits as the user types
    if (name === 'phone' || name === 'pincode') {
      setForm(f => ({ ...f, [name]: value.replace(/\D/g, '') }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    setSubmitError('')

    if (items.length === 0) {
      setSubmitError('Your cart is empty.')
      return
    }

    // Client-side validation
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      dispatch(showToast('Please fix the errors in the form.', 'error'))
      return
    }

    // Re-check blocked status before placing order
    try {
      if (user?.id) {
        const res = await userService.getById(user.id)
        if (res.data?.isBlocked) {
          dispatch(logout())
          dispatch(showToast('Your account has been suspended. You cannot place orders.', 'error'))
          navigate('/login', { replace: true })
          return
        }
      }
    } catch { /* proceed */ }

    const orderData = {
      userId:          user?.id,
      userEmail:       user?.email || '',
      items: items.map(item => ({
        productId:    item.product.id,
        productName:  item.product.name,
        selectedSize: item.selectedSize,
        quantity:     item.quantity,
        price:        item.product.price,
      })),
      shippingAddress: {
        fullName: form.fullName,
        phone:    form.phone,
        address:  form.address,
        city:     form.city,
        state:    form.state,
        pincode:  form.pincode,
      },
      paymentMethod: form.paymentMethod,
      subtotal,
      shipping,
      total,
      status:    'Confirmed',
      placedAt:  new Date().toISOString(),
    }

    try {
      await dispatch(placeOrder(orderData)).unwrap()
      dispatch(clearCart())
      dispatch(showToast('Order placed successfully! Redirecting to tracking…', 'success'))
      setOrderPlaced(true)
    } catch {
      setSubmitError('Failed to place order. Please try again.')
      dispatch(showToast('Failed to place order. Please try again.', 'error'))
    }
  }

  // ---- Order Success Screen ----
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 max-w-lg w-full p-8 text-center">

            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#263D70]">Order Placed! 🎉</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Thank you for your purchase. Your order is confirmed and we're getting it ready.
            </p>

            {/* Mini tracker */}
            <div className="mt-7 p-5 bg-[#F7F5F0] rounded-2xl">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 text-center">
                Your Order Status
              </p>
              <div className="relative flex items-start justify-between">
                <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200" />
                {TRACK_STEPS.map((step, idx) => {
                  const Icon = step.icon
                  const active = idx === 0
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center text-center w-1/4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                        active ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                               : 'bg-white text-gray-300 border-2 border-gray-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`mt-2 text-[10px] font-semibold leading-tight ${
                        active ? 'text-emerald-700' : 'text-gray-400'
                      }`}>{step.label}</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">{step.eta}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 flex justify-center">
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Order Confirmed ✓
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-5">
              Redirecting to order tracking in{' '}
              <span className="font-bold text-[#263D70]">{countdown}s</span>…
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 bg-[#263D70] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1D2F57] transition flex items-center justify-center gap-2"
              >
                <Truck size={16} /> Track My Order
              </button>
              <button
                onClick={() => navigate('/products')}
                className="flex-1 border border-[#263D70] text-[#263D70] py-3 rounded-xl text-sm font-semibold hover:bg-[#263D70]/5 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---- Checkout Form ----
  const inputCls = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#263D70]/10 ${
      fieldErrors[field]
        ? 'border-rose-400 focus:border-rose-500'
        : 'border-gray-300 focus:border-[#263D70]'
    }`

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#263D70] mb-8">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#263D70] mb-5 flex items-center gap-2">
                  <MapPin size={20} /> Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name (letters only)"
                      className={inputCls('fullName')}
                    />
                    <FieldError msg={fieldErrors.fullName} />
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      inputMode="numeric"
                      className={inputCls('phone')}
                    />
                    <FieldError msg={fieldErrors.phone} />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="House no, Street, Area (min 10 characters)"
                      className={inputCls('address') + ' resize-none'}
                    />
                    <FieldError msg={fieldErrors.address} />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={inputCls('city')}
                    />
                    <FieldError msg={fieldErrors.city} />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className={inputCls('state')}
                    />
                    <FieldError msg={fieldErrors.state} />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-[#263D70] mb-1">
                      PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      inputMode="numeric"
                      className={inputCls('pincode')}
                    />
                    <FieldError msg={fieldErrors.pincode} />
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

                {submitError && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <ShieldAlert size={14} className="text-rose-500 shrink-0" />
                    <p className="text-rose-600 text-xs">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={placingOrder || items.length === 0}
                  className="mt-5 w-full bg-[#263D70] text-white py-4 rounded-xl text-sm font-medium hover:bg-[#1D2F57] transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {placingOrder ? 'Placing Order…' : (
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
