// src/services/exam.service.js
import api from './api'

export const examService = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  
  // Schedule
  createSchedule: (data) => api.post('/exams/schedule', data),
  getSchedule: (examId) => api.get(`/exams/schedule/${examId}`),
  
  // Marks
  enterMarks: (data) => api.post('/exams/marks', data),
  updateMarks: (id, data) => api.put(`/exams/marks/${id}`, data),
  getResults: (params) => api.get('/exams/results/report', { params }),
  getReportCard: (studentId, params) => api.get(`/exams/students/${studentId}/report-card`, { params }),
}