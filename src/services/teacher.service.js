// src/services/teacher.service.js
import api from './api'

export const teacherService = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
  assignClass: (data) => api.post('/teachers/assign-class', data),
  getMyClasses: () => api.get('/teachers/my-classes'),
  getMySubjects: () => api.get('/teachers/my-subjects'),
}