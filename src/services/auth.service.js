// src/services/auth.service.js
import api from './api'

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
}