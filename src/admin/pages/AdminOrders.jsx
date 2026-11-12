import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CreditCard,
  MapPin,
  Phone,
  Printer,
} from 'lucide-react'
import { fetchAllOrders, updateOrderStatus } from '../../redux/ordersSlice'
import { showToast } from '../../redux/toastSlice'
import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'

const ORDER_STATUSES = [
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { items: orders = [], loading } = useSelector((state) => state.orders)

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return [...orders]
      .filter((order) => {
        const idMatch = String(order.id)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const emailMatch = order.userEmail
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
        const nameMatch = order.shippingAddress?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())

        const matchesSearch = idMatch || emailMatch || nameMatch

        const matchesStatus =
          statusFilter === 'All'
            ? true
            : String(order.status).toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => new Date(b.placedAt || 0) - new Date(a.placedAt || 0))
  }, [orders, searchTerm, statusFilter])

  // Paginated slice
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, currentPage, pageSize])

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId)
    try {
      await dispatch(
        updateOrderStatus({ id: orderId, status: newStatus })
      ).unwrap()

      dispatch(
        showToast(
          `Order #${String(orderId).slice(0, 8)} updated to ${newStatus}`,
          'success'
        )
      )

      if (selectedOrder && String(selectedOrder.id) === String(orderId)) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      dispatch(showToast(err || 'Failed to update order status', 'error'))
    } finally {
      setUpdatingId(null)
    }
  }

  function handleOpenDetails(order) {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#263D70]">
            Orders Management ({filteredOrders.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Review incoming orders, process shipments, and track fulfillment status
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition cursor-pointer appearance-none"
          >
            <option value="All">All Order Statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                Status: {status}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#263D70]/20 border-t-[#263D70] rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-400 font-medium">
              Loading orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders Found"
            description={
              searchTerm || statusFilter !== 'All'
                ? 'No orders match your filter criteria.'
                : 'No orders have been placed in the store yet.'
            }
            actionLabel={
              searchTerm || statusFilter !== 'All' ? 'Reset Filters' : undefined
            }
            onAction={() => {
              setSearchTerm('')
              setStatusFilter('All')
            }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5F0]/70 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/70 transition"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        #{String(order.id).slice(0, 8)}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                          {order.shippingAddress?.fullName || 'Customer'}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {order.userEmail}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(order.placedAt)}
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          {order.items?.length || 0} items
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-700 font-medium">
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status || 'Confirmed'}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#263D70] cursor-pointer"
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* View Details Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#263D70] bg-[#263D70]/10 hover:bg-[#263D70]/20 rounded-xl transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredOrders.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Order Details #${String(selectedOrder?.id).slice(0, 8)}`}
        subtitle={`Placed on ${formatDate(selectedOrder?.placedAt)}`}
        maxWidth="max-w-3xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* Quick Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  Current Status:
                </span>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded-lg px-3 py-1 font-semibold text-xs text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#263D70]/20"
                >
                  {ORDER_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipping Address */}
              <div className="p-4 rounded-xl border border-gray-100 bg-[#F7F5F0]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#263D70] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </div>
                <div className="text-gray-700 leading-relaxed pt-1">
                  <p className="font-bold text-gray-900">
                    {selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city},{' '}
                    {selectedOrder.shippingAddress?.state} -{' '}
                    {selectedOrder.shippingAddress?.pincode}
                  </p>
                  <p className="flex items-center gap-1.5 pt-1 text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.shippingAddress?.phone}</span>
                  </p>
                </div>
              </div>

              {/* Payment & Contact */}
              <div className="p-4 rounded-xl border border-gray-100 bg-[#F7F5F0]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#263D70] font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment & User</span>
                </div>
                <div className="text-gray-700 space-y-1 pt-1">
                  <p>
                    <span className="text-gray-400">Payment Method:</span>{' '}
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.paymentMethod || 'Cash on Delivery (COD)'}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">Customer Email:</span>{' '}
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.userEmail}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">User ID:</span>{' '}
                    <span className="font-mono text-gray-600">
                      {selectedOrder.userId}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Order Items</h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F5F0]/80 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5">Item</th>
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5">Unit Price</th>
                      <th className="px-4 py-2.5">Qty</th>
                      <th className="px-4 py-2.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {item.productName || `Product #${item.productId}`}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.selectedSize || 'Standard'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          × {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="text-emerald-600 font-semibold">
                    {selectedOrder.shipping === 0 ? 'FREE' : formatCurrency(selectedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#263D70] pt-2 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#263D70] hover:bg-[#1E2E54] rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
