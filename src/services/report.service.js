// src/services/report.service.js
import api from './api'

export const reportService = {
  // Attendance
  getMonthlyAttendance: (params) => api.get('/reports/attendance/monthly', { params }),
  getStudentAttendance: (studentId, params) => api.get(`/reports/attendance/student/${studentId}`, { params }),
  
  // Fees
  getPendingFees: (params) => api.get('/reports/fees/pending', { params }),
  getFeeCollection: (params) => api.get('/reports/fees/collected', { params }),
  
  // Exams
  getExamResults: (params) => api.get('/reports/exams/results', { params }),
  
  // Dashboard
  getDashboardStats: () => api.get('/reports/dashboard/stats'),
  
  // Exports
  exportAttendance: (params) => api.get('/reports/export/attendance', { params, responseType: 'blob' }),
  exportFees: (params) => api.get('/reports/export/fees', { params, responseType: 'blob' }),
}