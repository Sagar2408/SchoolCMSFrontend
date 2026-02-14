// src/components/fees/FeeStructure.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentService } from '../../services/student.service'
import { feeService } from '../../services/fee.service'
import toast from 'react-hot-toast'
import Loader from '../common/Loader'

export default function FeeStructure() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    tuition_fee: '',
    admission_fee: '',
    exam_fee: '',
    transport_fee: '',
    other_fee: '',
    discount_amount: '',
    discount_reason: '',
    due_date: ''
  })

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const response = await studentService.getAll({ status: 'active', limit: 1000 })
      setStudents(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load students')
    }
  }

  const calculateTotal = () => {
    const tuition = parseFloat(formData.tuition_fee) || 0
    const admission = parseFloat(formData.admission_fee) || 0
    const exam = parseFloat(formData.exam_fee) || 0
    const transport = parseFloat(formData.transport_fee) || 0
    const other = parseFloat(formData.other_fee) || 0
    const discount = parseFloat(formData.discount_amount) || 0
    return tuition + admission + exam + transport + other - discount
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedStudent) {
      toast.error('Please select a student')
      return
    }

    setLoading(true)
    try {
      await feeService.createStructure({
        student_id: parseInt(selectedStudent),
        academic_year: formData.academic_year,
        total_amount: calculateTotal(),
        breakdown: {
          tuition_fee: parseFloat(formData.tuition_fee) || 0,
          admission_fee: parseFloat(formData.admission_fee) || 0,
          exam_fee: parseFloat(formData.exam_fee) || 0,
          transport_fee: parseFloat(formData.transport_fee) || 0,
          other_fee: parseFloat(formData.other_fee) || 0,
          discount_amount: parseFloat(formData.discount_amount) || 0,
          discount_reason: formData.discount_reason
        },
        due_date: formData.due_date
      })
      toast.success('Fee structure created successfully')
      navigate('/fees/pending')
    } catch (error) {
      toast.error(error.message || 'Failed to create fee structure')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Fee Structure</h1>

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
                {s.first_name} {s.last_name} ({s.admission_number}) - {s.Class?.name} {s.Section?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
            <input
              value={formData.academic_year}
              onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee (₹)</label>
            <input
              type="number"
              value={formData.tuition_fee}
              onChange={(e) => setFormData({...formData, tuition_fee: e.target.value})}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Fee (₹)</label>
            <input
              type="number"
              value={formData.admission_fee}
              onChange={(e) => setFormData({...formData, admission_fee: e.target.value})}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee (₹)</label>
            <input
              type="number"
              value={formData.exam_fee}
              onChange={(e) => setFormData({...formData, exam_fee: e.target.value})}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Fee (₹)</label>
            <input
              type="number"
              value={formData.transport_fee}
              onChange={(e) => setFormData({...formData, transport_fee: e.target.value})}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Fee (₹)</label>
            <input
              type="number"
              value={formData.other_fee}
              onChange={(e) => setFormData({...formData, other_fee: e.target.value})}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (₹)</label>
            <input
              type="number"
              value={formData.discount_amount}
              onChange={(e) => setFormData({...formData, discount_amount: e.target.value})}
              className="input-field"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Reason</label>
          <input
            value={formData.discount_reason}
            onChange={(e) => setFormData({...formData, discount_reason: e.target.value})}
            className="input-field"
            placeholder="Reason for discount (if any)"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Total Fee Amount:</span>
            <span className="text-2xl font-bold text-primary-600">₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/fees/pending')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Fee Structure'}
          </button>
        </div>
      </form>
    </div>
  )
}