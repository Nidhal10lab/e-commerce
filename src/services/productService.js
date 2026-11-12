import api from './api'

export const productService = {
  // Fetch all products
  getAll: () => api.get('/products'),
  // Fetch a single product by ID
  getById: (id) => api.get(`/products/${id}`),

  // Fetch featured products
  getFeatured: () => api.get('/products', { params: { featured: true } }),

  // Fetch products by category
  getByCategory: (category) => api.get('/products', { params: { category } }),

  // Search products by name (json-server supports name_like for partial match)
  search: (query) => api.get('/products', { params: { name_like: query } }),

  // Paginated products
  getPaginated: (page = 1, limit = 8) =>
    api.get('/products', { params: { _page: page, _per_page: limit } }),

  // Create a new product
  create: (productData) => api.post('/products', productData),

  // Update existing product
  update: (id, productData) => api.put(`/products/${id}`, productData),

  // Partially update existing product
  patch: (id, productData) => api.patch(`/products/${id}`, productData),

  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
}
