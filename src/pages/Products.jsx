import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, ShoppingCart, X, Star, Search, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowLeft, Package } from 'lucide-react'
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice'
import { addToCart } from '../redux/cartSlice'
import { fetchProducts } from '../redux/productsSlice'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const ITEMS_PER_PAGE = 6

const CATEGORIES = ['All', 'Memory Foam', 'Latex', 'Foam', 'Orthopedic', 'Pillow']

const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
]

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={13}
          fill={star <= Math.round(rating) ? '#A47B3C' : 'none'}
          color="#A47B3C"
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  )
}

function Products() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { items: allProducts, loading, error } = useSelector(state => state.products)
  const wishlistItems = useSelector(state => state.wishlist.items)
  const cartItems = useSelector(state => state.cart.items)
  const { isAuthenticated } = useSelector(state => state.auth)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)

  // Fetch products from JSON Server on mount
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  function handleOpenProduct(product) {
    setSelectedProduct(product)
    setSelectedSize(product.sizes?.[0] || '')
    setQuantity(1)
    setAddedToCart(false)
  }

  function handleSearchChange(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleClearSearch() {
    setSearch('')
    setPage(1)
  }

  function handleCategoryChange(cat) {
    setCategory(cat)
    setPage(1)
  }

  function handleSortChange(e) {
    setSort(e.target.value)
    setPage(1)
  }

  function handleClearAllFilters() {
    setSearch('')
    setCategory('All')
    setSort('default')
    setPage(1)
  }

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let result = [...allProducts]

    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'All') {
      result = result.filter(p => p.category === category)
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [allProducts, search, category, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleWishlist(product) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    const isLiked = wishlistItems.some(item => item.id === product.id)
    if (isLiked) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist(product))
    }
  }

  function handleAddToCart() {
    if (!selectedSize) return

    dispatch(addToCart({
      product: selectedProduct,
      selectedSize,
      quantity,
    }))
    setAddedToCart(true)
  }

  return (
    <div className="min-h-screen bg-[#263D70] font-['Poppins']">

      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between px-6 md:px-10 pt-6 gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition text-sm font-medium"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full transition text-sm font-medium"
          >
            <Package size={17} />
            My Orders
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 bg-[#F7F5F0] text-[#263D70] px-5 py-2.5 rounded-full hover:bg-white transition text-sm font-medium shadow"
          >
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span className="bg-[#263D70] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/wishlist"
            className="flex items-center gap-2 bg-[#F7F5F0] text-[#263D70] px-5 py-2.5 rounded-full hover:bg-white transition text-sm font-medium shadow"
          >
            <Heart size={18} />
            Wishlist
            {wishlistItems.length > 0 && (
              <span className="bg-[#263D70] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {wishlistItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Page Heading */}
      <div className="px-6 md:px-10 py-8">
        <p className="text-[#D8B77D] uppercase tracking-[0.25em] text-sm">
          Discover Your Comfort
        </p>

        <h1 className="text-white text-4xl md:text-5xl font-semibold mt-3">
          Our Products
        </h1>

        <p className="text-white/70 mt-3">
          Find the perfect comfort for your everyday sleep.
        </p>
      </div>

      {/* Search + Filter + Sort Bar */}
      <div className="px-6 md:px-10 pb-6 flex flex-col md:flex-row gap-4 items-center">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full pl-11 pr-5 py-3 text-sm outline-none focus:border-[#D8B77D] transition"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={17} className="text-white/60" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                category === cat
                  ? 'bg-[#D8B77D] text-[#263D70]'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={handleSortChange}
          className="bg-white/10 border border-white/20 text-white rounded-full px-5 py-3 text-sm outline-none focus:border-[#D8B77D] cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="text-[#263D70]">
              {o.label}
            </option>
          ))}
        </select>

      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#D8B77D] rounded-full animate-spin mb-4" />
          <p className="text-white/70 text-sm">Loading products...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center py-24">
          <p className="text-red-400 text-sm">Failed to load products. Is JSON Server running?</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && paginated.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <Search size={48} className="text-white/20 mb-4" />
          <p className="text-white text-lg font-semibold">No products found</p>
          <p className="text-white/50 text-sm mt-2">Try adjusting your search or filters</p>
          <button
            onClick={handleClearAllFilters}
            className="mt-5 px-6 py-2 bg-[#D8B77D] text-[#263D70] rounded-full text-sm font-medium hover:bg-white transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && paginated.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 px-6 md:px-10 pb-10">

            {paginated.map(product => {
              const isLiked = wishlistItems.some(item => item.id === product.id)
              const isOutOfStock = product.stock === 0

              return (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="relative bg-[#F7F5F0] rounded-2xl p-5 cursor-pointer hover:-translate-y-2 transition duration-300 shadow-lg"
                >

                  {/* Out of stock badge */}
                  {isOutOfStock && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                      Out of Stock
                    </span>
                  )}

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleWishlist(product)
                    }}
                    className="absolute top-8 right-8 z-10 bg-white rounded-full p-3 shadow-md hover:scale-110 transition"
                    aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      size={22}
                      fill={isLiked ? '#DC2626' : 'none'}
                      color={isLiked ? '#DC2626' : '#263D70'}
                    />
                  </button>

                  {/* Product Image */}
                  <div className="h-56 bg-white rounded-xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain hover:scale-105 transition duration-500"
                      onError={e => { e.target.src = 'https://placehold.co/400x300?text=Product' }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="mt-5">

                    <p className="text-xs uppercase tracking-widest text-[#A47B3C]">
                      {product.category}
                    </p>

                    <h2 className="text-base font-semibold text-[#263D70] mt-1">
                      {product.name}
                    </h2>

                    <StarRating rating={product.rating} />

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-[#263D70] font-bold">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>

                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-3">
                      Click to view details →
                    </p>

                  </div>

                </div>
              )
            })}

          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pb-16">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 disabled:opacity-40 transition"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition ${
                    page === n
                      ? 'bg-[#D8B77D] text-[#263D70]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 disabled:opacity-40 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#F7F5F0] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10"
          >

            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow z-10"
              aria-label="Close product details"
            >
              <X size={23} />
            </button>

            {/* Large Product Image */}
            <div className="flex items-center justify-center bg-white rounded-2xl min-h-72">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-80 object-contain rounded-2xl"
                onError={e => { e.target.src = 'https://placehold.co/400x300?text=Product' }}
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-start py-4">

              <p className="text-[#A47B3C] uppercase tracking-widest text-sm">
                {selectedProduct.category}
              </p>

              <h2 className="text-3xl font-semibold text-[#263D70] mt-3">
                {selectedProduct.name}
              </h2>

              <StarRating rating={selectedProduct.rating} />

              <div className="flex items-center gap-4 mt-4">
                <p className="text-2xl font-bold text-[#263D70]">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </p>
                {selectedProduct.originalPrice && (
                  <>
                    <p className="text-gray-400 line-through text-sm">
                      ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                    </p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              {/* Out of Stock */}
              {selectedProduct.stock === 0 ? (
                <span className="mt-3 inline-block text-sm text-red-600 font-semibold">
                  ❌ Out of Stock
                </span>
              ) : (
                <span className="mt-3 inline-block text-sm text-green-600 font-semibold">
                  ✓ In Stock ({selectedProduct.stock} available)
                </span>
              )}

              <p className="text-gray-600 leading-7 mt-4 text-sm">
                {selectedProduct.description}
              </p>

              {/* Features */}
              {selectedProduct.features && (
                <>
                  <h3 className="font-semibold text-[#263D70] mt-5">
                    Product Features
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {selectedProduct.features.map(feature => (
                      <li key={feature} className="flex gap-2 text-gray-600 text-sm">
                        <span className="text-[#A47B3C]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Size Selection */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-[#263D70] mb-2">Select Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                          selectedSize === size
                            ? 'bg-[#263D70] text-white border-[#263D70]'
                            : 'bg-white text-[#263D70] border-gray-300 hover:border-[#263D70]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5">
                <p className="text-sm font-semibold text-[#263D70] mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 font-bold"
                  >
                    −
                  </button>
                  <span className="font-semibold text-[#263D70] w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                    className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">

                {/* Add to Cart */}
                {isAuthenticated ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={selectedProduct.stock === 0 || !selectedSize}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : 'bg-[#263D70] text-white hover:bg-[#1D2F57]'
                    } disabled:opacity-50`}
                  >
                    <ShoppingCart size={18} />
                    {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#263D70] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#1D2F57] transition"
                  >
                    Login to Add to Cart
                  </Link>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => handleWishlist(selectedProduct)}
                  className={`p-3 rounded-xl border-2 transition ${
                    wishlistItems.some(item => item.id === selectedProduct.id)
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-[#263D70]'
                  }`}
                >
                  <Heart
                    size={20}
                    fill={wishlistItems.some(item => item.id === selectedProduct.id) ? '#DC2626' : 'none'}
                    color={wishlistItems.some(item => item.id === selectedProduct.id) ? '#DC2626' : '#263D70'}
                  />
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default Products
