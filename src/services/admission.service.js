// src/services/admission.service.js
import api from './api'

export const admissionService = {
  getAll: (params) => api.get('/admissions', { params }),
  getById: (id) => api.get(`/admissions/${id}`),
  create: (data) => api.post('/admissions', data),
  update: (id, data) => api.put(`/admissions/${id}`, data),
  delete: (id) => api.delete(`/admissions/${id}`),
  updateStatus: (id, data) => api.put(`/admissions/${id}/status`, data),
  process: (id, data) => api.put(`/admissions/${id}/process`, data),
  getStats: (params) => api.get('/admissions/stats/overview', { params }),
}