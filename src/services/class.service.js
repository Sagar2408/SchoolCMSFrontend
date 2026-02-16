// src/services/class.service.js
import api from './api'

export const classService = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  
  // Sections
  getSections: (classId) => api.get(`/classes/${classId}/sections`),
  createSection: (classId, data) => api.post(`/classes/${classId}/sections`, data),
  updateSection: (id, data) => api.put(`/classes/sections/${id}`, data),
  deleteSection: (id) => api.delete(`/classes/sections/${id}`),
}