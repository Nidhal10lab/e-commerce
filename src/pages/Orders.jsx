import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrdersByUser, updateOrderStatus } from '../redux/ordersSlice'
import { showToast } from '../redux/toastSlice'
import {
  Package,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  AlertTriangle,
  MapPin,
  CreditCard,
  Calendar,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const STATUS_STEPS = [
  { key: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2, eta: 'Today' },
  { key: 'Processing', label: 'Processing', icon: Clock, eta: 'Day 1–2' },
  { key: 'Shipped', label: 'Shipped', icon: Truck, eta: 'Day 2–5' },
  { key: 'Delivered', label: 'Delivered', icon: PackageCheck, eta: 'Day 5–7' },
]

function getStepIndex(status) {
  const s = String(status || '').toLowerCase()
  if (s === 'delivered') return 3
  if (s === 'shipped') return 2
  if (s === 'processing') return 1
  return 0 // Confirmed default
}

function OrderTracker({ status }) {
  const isCancelled = String(status).toLowerCase() === 'cancelled'
  const currentStep = getStepIndex(status)

  if (isCancelled) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">
            Order Status: Cancelled
          </p>
          <p className="text-xs text-rose-600 mt-0.5">
            This order has been cancelled and will not be processed or delivered.
          </p>
        </div>
      </div>
    )
  }
 if (user.isBlocked) {
        const msg =
          'Your account has been suspended by the administrator. Please contact support.'
        setError(msg)
        dispatch(showToast(msg, 'error'))
        return
      }
  const currentStepLabel = STATUS_STEPS[currentStep]?.label || 'Confirmed'

  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Live Order Tracking
        </p>
        {/* Currently Here pill */}
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {currentStepLabel}
        </span>
      </div>

      {/* Progress Steps */}
      <div className="relative flex items-start justify-between">
        {/* Background track line */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -z-0" />
        {/* Active track line */}
        <div
          className="absolute top-4 left-4 h-1 bg-emerald-500 transition-all duration-500 -z-0"
          style={{
            width: `${(currentStep / (STATUS_STEPS.length - 1)) * 92}%`,
          }}
        />

        {STATUS_STEPS.map((step, idx) => {
          const Icon = step.icon
          const isDone = idx <= currentStep
          const isCurrent = idx === currentStep

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center text-center w-1/4"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`mt-2 text-[11px] font-medium leading-tight max-w-[70px] ${
                  isCurrent
                    ? 'text-[#263D70] font-bold'
                    : isDone
                    ? 'text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[9px] text-gray-400 mt-0.5">{step.eta}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Orders() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: orders = [], loading, error } = useSelector(
    (state) => state.orders
  )

  const [orderToCancel, setOrderToCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrdersByUser(user.id))
    }
  }, [dispatch, user])

  async function handleConfirmCancel() {
    if (!orderToCancel) return

    setCancelling(true)
    try {
      await dispatch(
        updateOrderStatus({ id: orderToCancel.id, status: 'Cancelled' })
      ).unwrap()

      dispatch(
        showToast(
          `Order #${String(orderToCancel.id).slice(0, 8)} cancelled successfully.`,
          'info'
        )
      )
      setOrderToCancel(null)
    } catch (err) {
      dispatch(showToast(err || 'Failed to cancel order.', 'error'))
    } finally {
      setCancelling(false)
    }
  }

  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt)

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A'
    try {
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(isoString))
    } catch {
      return isoString
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-sans antialiased text-gray-800 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#263D70] flex items-center gap-3">
              <Package className="w-8 h-8 text-[#263D70]" />
              <span>Order History</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Review your purchase history, track live fulfillment, and manage cancellations
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#263D70] hover:bg-[#1E2E54] text-white rounded-xl text-xs font-semibold transition self-start sm:self-auto shadow-sm"
          >
            <span>Continue Shopping</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-9 h-9 border-3 border-[#263D70]/20 border-t-[#263D70] rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-500 font-medium">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs text-center font-medium">
            Failed to load orders. Please refresh or try again later.
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#263D70]/5 flex items-center justify-center text-[#263D70]/40 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#263D70]">
              No Orders Found
            </h2>
            <p className="text-xs text-gray-500 mt-1.5 max-w-sm leading-relaxed">
              You have not placed any orders yet. Discover our premium mattresses and pillows to get started!
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 bg-[#263D70] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1E2E54] transition shadow-md"
            >
              <span>Explore Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusStr = String(order.status || 'Confirmed').toLowerCase()
              const isDelivered = statusStr === 'delivered'
              const isCancelled = statusStr === 'cancelled'
              // RULE: If delivered or cancelled, DO NOT show cancel button. Otherwise show cancel button.
              const canCancel = !isDelivered && !isCancelled

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-200"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-gray-900">
                          #{String(order.id).slice(0, 10)}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isCancelled
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isDelivered
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {order.status || 'Confirmed'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Placed on {formatDate(order.placedAt)}</span>
                      </p>
                    </div>

                    {/* Cancel Button (ONLY when not delivered and not cancelled) */}
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setOrderToCancel(order)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer self-start sm:self-auto shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>

                  {/* Items in order */}
                  <div className="py-4 space-y-3">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#263D70]/40 shrink-0" />
                          <div>
                            <p className="font-bold text-gray-900">
                              {item.productName || `Product #${item.productId}`}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Size: {item.selectedSize || 'Standard'} &nbsp;•&nbsp; Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-gray-900">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address & Payment Summary */}
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          Shipping Address:
                        </p>
                        <p className="text-gray-500 mt-0.5 leading-relaxed">
                          {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-gray-600 sm:justify-end">
                      <CreditCard className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <div className="sm:text-right">
                        <p className="font-semibold text-gray-800">
                          Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                        </p>
                        <p className="text-sm font-bold text-[#263D70] mt-0.5">
                          Total: {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live Order Tracker */}
                  <OrderTracker status={order.status} />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setOrderToCancel(null)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">
                  Cancel Order?
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Are you sure you want to cancel Order #{String(orderToCancel.id).slice(0, 8)}? This will stop shipment and update the status in our database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-sm disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
