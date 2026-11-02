import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrdersByUser } from '../redux/ordersSlice'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const STATUS_COLORS = {
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-yellow-100 text-yellow-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}
function Orders() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items: orders, loading, error } = useSelector(state => state.orders)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrdersByUser(user.id))
    }
  }, [dispatch, user])

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-['Poppins']">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        <h1 className="text-3xl md:text-4xl font-semibold text-[#263D70] mb-8 flex items-center gap-3">
          <Package size={32} />
          My Orders
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-[#263D70]/20 border-t-[#263D70] rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading orders...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="py-20 text-center">
            <p className="text-red-500">Failed to load orders. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={72} className="text-[#263D70]/20 mb-6" />
            <h2 className="text-2xl font-semibold text-[#263D70]">No orders yet</h2>
            <p className="text-gray-500 mt-3 max-w-sm">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/products"
              className="mt-8 bg-[#263D70] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#1D2F57] transition flex items-center gap-2"
            >
              Shop Now <ChevronRight size={18} />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">

                {/* Order Header */}
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Order #{order.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.placedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#263D70]/30 flex-shrink-0" />
                      <p className="text-[#263D70] font-medium">{item.productName}</p>
                      <p className="text-gray-500 text-xs">
                        {item.selectedSize} × {item.quantity}
                      </p>
                      <p className="ml-auto text-[#263D70] font-semibold text-xs">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  <p className="font-medium text-gray-700">Delivered to:</p>
                  <p className="mt-1">
                    {order.shippingAddress?.fullName}, {order.shippingAddress?.address},&nbsp;
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
                  </p>
                </div>

                {/* Total */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Payment: </span>
                    <span className="font-medium text-[#263D70]">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Total: </span>
                    <span className="font-bold text-[#263D70] text-base">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Orders
