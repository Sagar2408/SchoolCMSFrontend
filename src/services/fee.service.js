// src/services/fee.service.js
import api from './api'

export const feeService = {
  createStructure: (data) => api.post('/fees/structure', data),
  recordPayment: (data) => api.post('/fees/payment', data),
  getStudentFees: (studentId) => api.get(`/fees/student/${studentId}`),
  getPendingFees: (params) => api.get('/fees/pending', { params }),
  getPaymentHistory: (studentId) => api.get(`/fees/payments/${studentId}`),
  getSummary: (params) => api.get('/fees/summary', { params }),
}