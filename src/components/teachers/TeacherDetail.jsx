// src/components/teachers/TeacherDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { teacherService } from '../../services/teacher.service'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import { ArrowLeft, Edit } from 'lucide-react'

export default function TeacherDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeacher()
  }, [id])

  const loadTeacher = async () => {
    try {
      const response = await teacherService.getById(id)
      setTeacher(response.data)
    } catch (error) {
      toast.error('Failed to load teacher')
      navigate('/teachers')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />
  if (!teacher) return null

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/teachers')} className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {teacher.first_name} {teacher.last_name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="text-gray-600">Employee ID:</span> <span className="font-medium">{teacher.employee_id}</span></div>
          <div><span className="text-gray-600">Email:</span> <span className="font-medium">{teacher.email}</span></div>
          <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{teacher.phone}</span></div>
          <div><span className="text-gray-600">Qualification:</span> <span className="font-medium">{teacher.qualification || 'N/A'}</span></div>
          <div><span className="text-gray-600">Specialization:</span> <span className="font-medium">{teacher.specialization || 'N/A'}</span></div>
          <div><span className="text-gray-600">Experience:</span> <span className="font-medium">{teacher.experience_years} years</span></div>
          <div><span className="text-gray-600">Joining Date:</span> <span className="font-medium">{new Date(teacher.joining_date).toLocaleDateString()}</span></div>
          <div><span className="text-gray-600">Status:</span> <span className="font-medium">{teacher.status}</span></div>
        </div>

        {teacher.ClassTeachers?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Assigned Classes</h3>
            <div className="space-y-2">
              {teacher.ClassTeachers.map((assignment, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded">
                  {assignment.Class?.name} - Section {assignment.Section?.name} ({assignment.Subject?.name})
                  {assignment.is_class_teacher && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Class Teacher</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}