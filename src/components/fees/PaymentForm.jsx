// src/components/fees/PaymentForm.jsx
import { useState, useEffect } from 'react'
import { feeService } from '../../services/fee.service'
import { studentService } from '../../services/student.service'
import toast from 'react-hot-toast'
import Loader from '../common/Loader'

export default function PaymentForm() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [fees, setFees] = useState([])
  const [selectedFee, setSelectedFee] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    amount: '',
    payment_mode: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    transaction_id: '',
    cheque_number: '',
    bank_name: '',
    remarks: ''
  })

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentFees()
    }
  }, [selectedStudent])

  const loadStudents = async () => {
    try {
      const response = await studentService.getAll({ status: 'active', limit: 1000 })
      setStudents(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load students')
    }
  }

  const loadStudentFees = async () => {
    try {
      const response = await feeService.getStudentFees(selectedStudent)
      const pendingFees = response.data?.filter(f => f.status !== 'paid') || []
      setFees(pendingFees)
      setSelectedFee('')
    } catch (error) {
      toast.error('Failed to load fee details')
    }
  }

  const selectedFeeDetails = fees.find(f => f.id == selectedFee)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFee) {
      toast.error('Please select a fee record')
      return
    }

    setLoading(true)
    try {
      await feeService.recordPayment({
        student_id: parseInt(selectedStudent),
        fee_id: parseInt(selectedFee),
        amount: parseFloat(formData.amount),
        payment_mode: formData.payment_mode,
        payment_date: formData.payment_date,
        transaction_id: formData.transaction_id,
        cheque_number: formData.cheque_number,
        bank_name: formData.bank_name,
        remarks: formData.remarks
      })
      toast.success('Payment recorded successfully')
      // Reset form
      setSelectedStudent('')
      setSelectedFee('')
      setFormData({
        amount: '',
        payment_mode: 'cash',
        payment_date: new Date().toISOString().split('T')[0],
        transaction_id: '',
        cheque_number: '',
        bank_name: '',
        remarks: ''
      })
    } catch (error) {
      toast.error(error.message || 'Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Record Payment</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name} ({s.admission_number})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Fee Record *</label>
            <select
              value={selectedFee}
              onChange={(e) => setSelectedFee(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Fee</option>
              {fees.map(f => (
                <option key={f.id} value={f.id}>
                  {f.academic_year} - Pending: ₹{f.pending_amount} (Total: ₹{f.total_amount})
                </option>
              ))}
            </select>
            {fees.length === 0 && <p className="text-sm text-red-500 mt-1">No pending fees for this student</p>}
          </div>
        )}

        {selectedFeeDetails && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Fee Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Amount: <span className="font-medium">₹{selectedFeeDetails.total_amount}</span></div>
              <div>Paid Amount: <span className="font-medium">₹{selectedFeeDetails.paid_amount}</span></div>
              <div>Pending Amount: <span className="font-medium text-red-600">₹{selectedFeeDetails.pending_amount}</span></div>
              <div>Due Date: <span className="font-medium">{selectedFeeDetails.due_date || 'N/A'}</span></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              max={selectedFeeDetails?.pending_amount}
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode *</label>
            <select
              value={formData.payment_mode}
              onChange={(e) => setFormData({...formData, payment_mode: e.target.value})}
              className="input-field"
              required
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
              <option value="dd">Demand Draft</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
              className="input-field"
              required
            />
          </div>

          {formData.payment_mode === 'online' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
              <input
                value={formData.transaction_id}
                onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                className="input-field"
              />
            </div>
          )}

          {formData.payment_mode === 'cheque' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Number</label>
                <input
                  value={formData.cheque_number}
                  onChange={(e) => setFormData({...formData, cheque_number: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  value={formData.bank_name}
                  onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                  className="input-field"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            className="input-field"
            rows="2"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading || !selectedFee} className="btn-primary">
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </form>
    </div>
  )
}