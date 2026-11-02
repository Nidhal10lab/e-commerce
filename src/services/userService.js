import api from './api'

export const userService = {
  // Get all users (for login check)
  getByEmail: (email) =>
    api.get('/users', { params: { email: email.trim().toLowerCase() } }),

  // Register a new user
  register: (userData) => api.post('/users', userData),

  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),
}
