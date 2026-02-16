// src/services/attendance.service.js
import api from './api'

export const attendanceService = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getByDate: (params) => api.get('/attendance/date', { params }),
  getStudentAttendance: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getMonthlyReport: (params) => api.get('/attendance/monthly-report', { params }),
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
}