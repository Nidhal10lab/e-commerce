import api from './api'
export const orderService = {
  // Place a new order
  create: (orderData) => api.post('/orders', orderData),

  // Get orders by user ID
  getByUserId: (userId) => api.get('/orders', { params: { userId } }),

  // Get single order
  getById: (id) => api.get(`/orders/${id}`),

  // Get all orders (for admin)
  getAll: () => api.get('/orders'),

  // Update order status
  updateStatus: (id, status) => api.patch(`/orders/${id}`, { status }),

  // Delete order
  delete: (id) => api.delete(`/orders/${id}`),
}
