// src/components/students/StudentDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { studentService } from '../../services/student.service'
import { feeService } from '../../services/fee.service'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import { Edit, ArrowLeft, User, Phone, Mail, MapPin, Calendar, GraduationCap } from 'lucide-react'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudent()
  }, [id])

  const loadStudent = async () => {
    try {
      const [studentRes, feesRes] = await Promise.all([
        studentService.getById(id),
        feeService.getStudentFees(id)
      ])
      setStudent(studentRes.data)
      setFees(feesRes.data || [])
    } catch (error) {
      toast.error('Failed to load student details')
      navigate('/students')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />
  if (!student) return null

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/students')} className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} className="mr-2" />
          Back to Students
        </button>
        <button onClick={() => navigate(`/students/${id}/edit`)} className="btn-primary flex items-center">
          <Edit size={18} className="mr-2" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card">
          <div className="text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{student.first_name} {student.last_name}</h2>
            <p className="text-gray-600">{student.admission_number}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
              student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {student.status}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center text-gray-600">
              <GraduationCap size={18} className="mr-3" />
              <span>{student.Class?.name} - Section {student.Section?.name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-3" />
              <span>DOB: {new Date(student.date_of_birth).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone size={18} className="mr-3" />
              <span>{student.parent_phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail size={18} className="mr-3" />
              <span>{student.email || student.parent_email || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={18} className="mr-3" />
              <span>{student.city || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Parent Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Parent Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 text-sm">Parent Name</span>
              <p className="font-medium">{student.parent_name}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Parent Phone</span>
              <p className="font-medium">{student.parent_phone}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Parent Email</span>
              <p className="font-medium">{student.parent_email || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Occupation</span>
              <p className="font-medium">{student.parent_occupation || 'N/A'}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Address</h3>
          <p className="text-gray-700">{student.address || 'N/A'}</p>
          <p className="text-gray-700">{student.city}, {student.state} {student.pincode}</p>
        </div>

        {/* Fee Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Information</h3>
          {fees.length === 0 ? (
            <p className="text-gray-600">No fee records found</p>
          ) : (
            <div className="space-y-4">
              {fees.map(fee => (
                <div key={fee.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{fee.academic_year}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                      fee.status === 'pending' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fee.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Total: ₹{fee.total_amount}</p>
                    <p>Paid: ₹{fee.paid_amount}</p>
                    <p>Pending: ₹{fee.pending_amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}