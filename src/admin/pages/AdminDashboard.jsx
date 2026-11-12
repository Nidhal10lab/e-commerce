import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
} from 'lucide-react'
import { fetchProducts } from '../../redux/productsSlice'
import { fetchAllOrders } from '../../redux/ordersSlice'
import { fetchUsers } from '../../redux/usersSlice'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { DashboardGraph } from '../components/DashboardGraph'

export default function AdminDashboard() {
  const dispatch = useDispatch()

  const { items: products = [] } = useSelector(
    (state) => state.products
  )
  const { items: orders = [] } = useSelector(
    (state) => state.orders
  )
  const { items: users = [] } = useSelector(
    (state) => state.users
  )

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchAllOrders())
    dispatch(fetchUsers())
  }, [dispatch])

  // Calculated Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      // Don't count cancelled orders
      if (String(order.status).toLowerCase() === 'cancelled') return sum
      return sum + (Number(order.total) || 0)
    }, 0)
  }, [orders])

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => Number(p.stock) < 15)
  }, [products])

  const orderStats = useMemo(() => {
    const stats = {
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
    orders.forEach((o) => {
      const s = String(o.status || 'Confirmed').toLowerCase()
      if (stats[s] !== undefined) stats[s]++
      else stats.confirmed++
    })
    return stats
  }, [orders])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.placedAt || 0) - new Date(a.placedAt || 0))
      .slice(0, 5)
  }, [orders])

  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E2E54] to-[#263D70] rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-300">
              Control Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
              Welcome to FYNI Admin
            </h2>
            <p className="text-white/80 text-sm mt-1 max-w-xl">
              Monitor store sales, manage mattress collections, review customer orders, and maintain user access in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-[#1E2E54] hover:bg-amber-300 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Products</span>
            </Link>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur-sm transition"
            >
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          change="12%"
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingBag}
          change="8%"
          color="navy"
        />
        <StatCard
          title="Products Catalog"
          value={products.length}
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Registered Users"
          value={users.length}
          icon={Users}
          change="5%"
          color="indigo"
        />
      </div>

      {/* Analytics Graph */}
      <DashboardGraph orders={orders} />

      {/* Order Status Breakdown Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
          Order Status Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">Confirmed</span>
            </div>
            <span className="text-base font-bold text-blue-700">{orderStats.confirmed}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-900">Processing</span>
            </div>
            <span className="text-base font-bold text-purple-700">{orderStats.processing}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-900">Shipped</span>
            </div>
            <span className="text-base font-bold text-amber-700">{orderStats.shipped}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-900">Delivered</span>
            </div>
            <span className="text-base font-bold text-emerald-700">{orderStats.delivered}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold text-rose-900">Cancelled</span>
            </div>
            <span className="text-base font-bold text-rose-700">{orderStats.cancelled}</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Inventory Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#263D70]">
                  Recent Orders
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest customer purchases requiring fulfillment
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-semibold text-[#263D70] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No orders recorded yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F5F0]/60 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Order ID</th>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Total</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition">
                        <td className="px-6 py-4 font-mono font-medium text-gray-900">
                          #{String(order.id).slice(0, 8)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {order.shippingAddress?.fullName || 'Customer'}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {order.userEmail}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts (1 col) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Inventory Alerts
                  </h3>
                  <p className="text-xs text-gray-500">
                    Items with low or zero stock
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {lowStockProducts.length}
              </span>
            </div>

            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500">
                  All inventory levels are healthy!
                </div>
              ) : (
                lowStockProducts.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/60 transition"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={item.image || '/images/mattress.jpg'}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-gray-200"
                        onError={(e) => {
                          e.target.src = '/images/mattress.jpg'
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={item.stock} type="stock" />
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/admin/products"
            className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 text-center block transition"
          >
            Update Inventory Levels
          </Link>
        </div>
      </div>
    </div>
  )
}
