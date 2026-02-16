// src/services/timetable.service.js
import api from './api'

export const timetableService = {
  getAll: (params) => api.get('/timetable/all', { params }),
  getByClass: (classId, params) => api.get(`/timetable/class/${classId}`, { params }),
  getBySection: (sectionId, params) => api.get(`/timetable/section/${sectionId}`, { params }),
  getMyTimetable: (params) => api.get('/timetable/my-timetable', { params }),
  create: (data) => api.post('/timetable', data),
  createBulk: (data) => api.post('/timetable/bulk', data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  delete: (id) => api.delete(`/timetable/${id}`),
}