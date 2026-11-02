import api from './api'
export const orderService = {
  // Place a new order
  create: (orderData) => api.post('/orders', orderData),

  // Get orders by user ID
  getByUserId: (userId) => api.get('/orders', { params: { userId } }),

  // Get single order
  getById: (id) => api.get(`/orders/${id}`),
}
