import api from './api'

export const userService = {
  // Get all users
  getAll: () => api.get('/users'),
  // Get users by email (for login check)
  getByEmail: (email) =>
    api.get('/users', { params: { email: email.trim().toLowerCase() } }),
  // Register a new user
  register: (userData) => api.post('/users', userData),
  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),
  // Update user (e.g. block/unblock)
  update: (id, userData) => api.patch(`/users/${id}`, userData),
  // Delete user
  delete: (id) => api.delete(`/users/${id}`),
}
