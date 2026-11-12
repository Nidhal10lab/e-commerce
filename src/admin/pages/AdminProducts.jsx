import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Package,
  Star,
  Check,
  Layers,
  Archive,
  RotateCcw,
  PackageX,
} from 'lucide-react'
import {
  fetchProducts,
  addProduct,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
  deleteProduct,
} from '../../redux/productsSlice'
import { showToast } from '../../redux/toastSlice'
import { Modal } from '../components/Modal'
import { ConfirmModal } from '../components/ConfirmModal'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'

const AVAILABLE_IMAGE_PRESETS = [
  { label: 'Mattress Standard', path: '/images/mattress.jpg' },
  { label: 'Orthopedic Mattress', path: '/images/ortho.png' },
  { label: 'Foldable Mattress', path: '/images/foldable.png' },
  { label: 'Pillow Standard', path: '/images/pillow.jpg' },
  { label: 'Multicolored Pillow', path: '/images/multicolored.png' },
  { label: 'Spine Alignment Pillow', path: '/images/spine.png' },
  { label: 'Orthopedic Pillow', path: '/images/orthopillow.png' },
  { label: 'Comforter', path: '/images/comforter.jpg' },
  { label: 'Cushion', path: '/images/cushion.jpg' },
  { label: 'Protector', path: '/images/protector.png' },
]

const ALL_SIZES = ['Single', 'Double', 'Queen', 'King', 'Standard']

const CATEGORIES = [
  'All',
  'Memory Foam',
  'Latex',
  'Foam',
  'Orthopedic',
  'Pillow',
]

const initialFormState = {
  name: '',
  category: 'Memory Foam',
  description: '',
  price: '',
  originalPrice: '',
  image: '/images/mattress.jpg',
  sizes: ['Single', 'Queen', 'King'],
  stock: 20,
  rating: 4.5,
  featured: false,
  features: 'Premium Comfort, Superior Support, Breathable Material',
}

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { items: products = [], loading } = useSelector(
    (state) => state.products
  )

  // Tabs: 'active' | 'soft_deleted'
  const [activeTab, setActiveTab] = useState('active')

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Form Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Action Modals state
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: 'hard_delete', // 'soft_delete' | 'hard_delete' | 'restore'
    product: null,
    loading: false,
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Split products between active and soft-deleted/out-of-stock
  const activeProducts = useMemo(() => {
    return products.filter((p) => !p.isSoftDeleted)
  }, [products])

  const softDeletedProducts = useMemo(() => {
    return products.filter((p) => Boolean(p.isSoftDeleted))
  }, [products])

  // Current list based on active tab
  const currentList = activeTab === 'active' ? activeProducts : softDeletedProducts

  // Filtered products within the active tab
  const filteredProducts = useMemo(() => {
    return currentList.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        categoryFilter === 'All' || p.category === categoryFilter

      const matchesStock =
        stockFilter === 'All'
          ? true
          : stockFilter === 'in_stock'
          ? Number(p.stock) >= 15
          : stockFilter === 'low_stock'
          ? Number(p.stock) > 0 && Number(p.stock) < 15
          : Number(p.stock) <= 0

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [currentList, searchTerm, categoryFilter, stockFilter])

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  function handleOpenAdd() {
    setEditingProduct(null)
    setFormData(initialFormState)
    setIsFormModalOpen(true)
  }

  function handleOpenEdit(product) {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      category: product.category || 'Memory Foam',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      image: product.image || '/images/mattress.jpg',
      sizes: Array.isArray(product.sizes) ? product.sizes : ['Queen', 'King'],
      stock: product.stock ?? 10,
      rating: product.rating ?? 4.5,
      featured: !!product.featured,
      features: Array.isArray(product.features)
        ? product.features.join(', ')
        : product.features || '',
    })
    setIsFormModalOpen(true)
  }

  function handleSizeToggle(size) {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size)
      const newSizes = exists
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size]
      return { ...prev, sizes: newSizes.length ? newSizes : [size] }
    })
  }

  async function handleFormSubmit(e) {
    e.preventDefault()

    if (!formData.name.trim()) {
      dispatch(showToast('Product name is required', 'error'))
      return
    }

    if (!formData.price || Number(formData.price) <= 0) {
      dispatch(showToast('Please enter a valid price', 'error'))
      return
    }

    setFormSubmitting(true)

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice
        ? Number(formData.originalPrice)
        : Math.round(Number(formData.price) * 1.2),
      image: formData.image || '/images/mattress.jpg',
      sizes: formData.sizes,
      stock: Number(formData.stock) || 0,
      rating: Number(formData.rating) || 4.5,
      featured: Boolean(formData.featured),
      isSoftDeleted: editingProduct?.isSoftDeleted || false,
      features: formData.features
        ? formData.features
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : ['Premium Comfort', 'Long Lasting'],
    }

    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({ id: editingProduct.id, data: payload })
        ).unwrap()
        dispatch(
          showToast(`"${payload.name}" updated in database successfully!`, 'success')
        )
      } else {
        await dispatch(addProduct(payload)).unwrap()
        dispatch(
          showToast(`"${payload.name}" added to catalog successfully!`, 'success')
        )
      }
      setIsFormModalOpen(false)
    } catch (err) {
      dispatch(
        showToast(err || 'Failed to save product in JSON Server.', 'error')
      )
    } finally {
      setFormSubmitting(false)
    }
  }

  // Trigger modal for soft delete / hard delete / restore
  function triggerActionModal(type, product) {
    setActionModal({
      isOpen: true,
      type,
      product,
      loading: false,
    })
  }

  async function handleExecuteAction() {
    const { type, product } = actionModal
    if (!product) return

    setActionModal((prev) => ({ ...prev, loading: true }))

    try {
      if (type === 'soft_delete') {
        // Soft delete: sets isSoftDeleted: true, stock: 0 in json-server
        await dispatch(softDeleteProduct(product.id)).unwrap()
        dispatch(
          showToast(
            `"${product.name}" soft-deleted and moved to Out of Stock section.`,
            'warning'
          )
        )
      } else if (type === 'restore') {
        // Restore: sets isSoftDeleted: false, stock: 15 in json-server
        await dispatch(restoreProduct({ id: product.id, stock: 15 })).unwrap()
        dispatch(
          showToast(
            `"${product.name}" restored to Active Catalog with stock: 15!`,
            'success'
          )
        )
      } else if (type === 'hard_delete') {
        // Hard delete: permanently deletes from json-server
        await dispatch(deleteProduct(product.id)).unwrap()
        dispatch(
          showToast(
            `"${product.name}" permanently deleted from JSON Server database.`,
            'success'
          )
        )
      }
      setActionModal({ isOpen: false, type: 'hard_delete', product: null, loading: false })
    } catch (err) {
      dispatch(showToast(err || 'Action failed on JSON Server.', 'error'))
      setActionModal((prev) => ({ ...prev, loading: false }))
    }
  }

  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#263D70]">
            Product Catalog
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your store's mattresses, inventory, soft deletes, and catalog data
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#263D70] hover:bg-[#1E2E54] text-white text-xs font-semibold rounded-xl shadow-md transition duration-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Sections / Tabs Toggle: Active vs Out of Stock / Soft Deleted */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('active')
            setCurrentPage(1)
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'active'
              ? 'bg-[#263D70] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Products</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'active'
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {activeProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('soft_deleted')
            setCurrentPage(1)
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'soft_deleted'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <PackageX className="w-4 h-4" />
          <span>Out of Stock / Soft Deleted</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'soft_deleted'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {softDeletedProducts.length}
          </span>
        </button>
      </div>

      {/* Section Notice Banner for Soft Deleted tab */}
      {activeTab === 'soft_deleted' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <Archive className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">
              Out of Stock / Soft-Deleted Section
            </p>
            <p className="text-amber-800 mt-0.5">
              These products are marked out of stock or soft-deleted. They are saved in your JSON Server but excluded from active sales. You can restore them to active catalog or hard-delete them permanently.
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, category, or features..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition cursor-pointer appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Stock Status Filter */}
        <div className="relative">
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition cursor-pointer appearance-none"
          >
            <option value="All">All Stock Levels</option>
            <option value="in_stock">In Stock (15+)</option>
            <option value="low_stock">Low Stock (&lt;15)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
          <Layers className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading && products.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#263D70]/20 border-t-[#263D70] rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-400 font-medium">
              Loading catalog from JSON Server...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={activeTab === 'active' ? Package : PackageX}
            title={
              activeTab === 'active'
                ? 'No Active Products Found'
                : 'No Out of Stock / Soft-Deleted Products'
            }
            description={
              searchTerm || categoryFilter !== 'All' || stockFilter !== 'All'
                ? 'No products match your current search/filter criteria.'
                : activeTab === 'active'
                ? 'Your active store catalog is empty. Click below to add a product.'
                : 'There are currently no soft-deleted or out of stock items.'
            }
            actionLabel={
              searchTerm || categoryFilter !== 'All' || stockFilter !== 'All'
                ? 'Clear Filters'
                : activeTab === 'active'
                ? 'Add New Product'
                : undefined
            }
            onAction={
              searchTerm || categoryFilter !== 'All' || stockFilter !== 'All'
                ? () => {
                    setSearchTerm('')
                    setCategoryFilter('All')
                    setStockFilter('All')
                  }
                : handleOpenAdd
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5F0]/70 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock Status</th>
                    <th className="px-6 py-4">Sizes</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/70 transition"
                    >
                      {/* Product Image & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                            <img
                              src={product.image || '/images/mattress.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/images/mattress.jpg'
                              }}
                            />
                            {product.featured && (
                              <span className="absolute top-0 left-0 bg-amber-400 text-[#1E2E54] text-[9px] font-bold px-1 rounded-br">
                                ★
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-gray-400 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </p>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <p className="text-[10px] text-gray-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </p>
                          )}
                      </td>

                      {/* Stock Badge */}
                      <td className="px-6 py-4">
                        {product.isSoftDeleted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500" />
                            Out of Stock (Soft Deleted)
                          </span>
                        ) : (
                          <StatusBadge status={product.stock} type="stock" />
                        )}
                      </td>

                      {/* Sizes */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {Array.isArray(product.sizes) &&
                            product.sizes.map((sz) => (
                              <span
                                key={sz}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 font-medium"
                              >
                                {sz}
                              </span>
                            ))}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating || '4.5'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* If in Active tab: Show Soft Delete button */}
                          {activeTab === 'active' && (
                            <button
                              onClick={() => triggerActionModal('soft_delete', product)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition cursor-pointer"
                              title="Soft Delete (Mark Out of Stock)"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">Soft Delete</span>
                            </button>
                          )}

                          {/* If in Soft Deleted tab: Show Restore button */}
                          {activeTab === 'soft_deleted' && (
                            <button
                              onClick={() => triggerActionModal('restore', product)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition cursor-pointer"
                              title="Restore to Active Catalog"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                          )}

                          {/* Hard Delete button (always available to permanently purge) */}
                          <button
                            onClick={() => triggerActionModal('hard_delete', product)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition cursor-pointer"
                            title="Hard Delete from JSON Server"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Hard Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        subtitle={
          editingProduct
            ? `Update details for ID: ${editingProduct.id}`
            : 'Fill in the details to publish a new mattress or bedding item to JSON Server'
        }
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fyni Royal Orthopedic Mattress"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
            />
          </div>

          {/* Category & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition cursor-pointer"
              >
                <option value="Memory Foam">Memory Foam</option>
                <option value="Latex">Latex</option>
                <option value="Foam">Foam</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Pillow">Pillow</option>
                <option value="Bedding">Bedding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Initial Rating (1 - 5)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
              />
            </div>
          </div>

          {/* Price & Original Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="12999"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                min="1"
                placeholder="15999"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Inventory Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="20"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
              />
            </div>
          </div>

          {/* Image Selection & Preview */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Image
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                <img
                  src={formData.image || '/images/mattress.jpg'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/mattress.jpg'
                  }}
                />
              </div>

              <div className="flex-1 space-y-2">
                <select
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition cursor-pointer"
                >
                  <option value="">Custom URL (enter below)</option>
                  {AVAILABLE_IMAGE_PRESETS.map((preset) => (
                    <option key={preset.path} value={preset.path}>
                      Preset: {preset.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Or enter image URL path (/images/... or https://...)"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const isSelected = formData.sizes.includes(size)
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#263D70] text-white border-[#263D70]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{size}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detailed description of materials, comfort level, and ergonomic design..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
            />
          </div>

          {/* Features (comma separated) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Highlights & Features (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Memory Foam, Spinal Alignment, 10-Year Warranty"
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#263D70]/10 focus:border-[#263D70] transition"
            />
          </div>

          {/* Featured Switch */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featuredCheck"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 rounded text-[#263D70] focus:ring-[#263D70] cursor-pointer"
            />
            <label
              htmlFor="featuredCheck"
              className="text-xs font-medium text-gray-700 cursor-pointer"
            >
              Promote on Home Page (Featured Collection)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2 bg-[#263D70] hover:bg-[#1E2E54] text-white text-xs font-semibold rounded-xl shadow-md transition disabled:opacity-60 cursor-pointer"
            >
              {formSubmitting
                ? 'Saving...'
                : editingProduct
                ? 'Update Product'
                : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for Soft Delete / Hard Delete / Restore */}
      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() =>
          setActionModal({ isOpen: false, type: 'hard_delete', product: null, loading: false })
        }
        onConfirm={handleExecuteAction}
        title={
          actionModal.type === 'soft_delete'
            ? 'Soft Delete Product?'
            : actionModal.type === 'restore'
            ? 'Restore Product?'
            : 'Hard Delete Product (Permanent)?'
        }
        message={
          actionModal.type === 'soft_delete'
            ? `Soft-deleting "${actionModal.product?.name}" will mark it as Out of Stock (stock: 0) and move it to the "Out of Stock / Soft Deleted" section in your admin panel. It will not be removed from JSON Server.`
            : actionModal.type === 'restore'
            ? `Restoring "${actionModal.product?.name}" will restore it back into your Active Catalog with 15 units of stock.`
            : `Are you sure you want to permanently HARD DELETE "${actionModal.product?.name}"? It will be permanently removed from JSON Server (db.json) and cannot be recovered.`
        }
        confirmText={
          actionModal.type === 'soft_delete'
            ? 'Yes, Soft Delete'
            : actionModal.type === 'restore'
            ? 'Yes, Restore Product'
            : 'Yes, Permanently Hard Delete'
        }
        type={
          actionModal.type === 'restore'
            ? 'primary'
            : actionModal.type === 'soft_delete'
            ? 'warning'
            : 'danger'
        }
        loading={actionModal.loading}
      />
    </div>
  )
}
