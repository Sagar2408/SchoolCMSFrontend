// src/components/teachers/TeacherList.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { teacherService } from '../../services/teacher.service'
import DataTable from '../common/DataTable'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import { Eye, Edit, Trash2, Plus } from 'lucide-react'

export default function TeacherList() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ page: 1, limit: 10 })

  useEffect(() => {
    loadTeachers()
  }, [filters])

  const loadTeachers = async () => {
    try {
      const response = await teacherService.getAll(filters)
      // response = { success, data, pagination }

      setTeachers(response.data || [])
    } catch (error) {
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await teacherService.delete(id)
      toast.success('Teacher deleted')
      loadTeachers()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const columns = [
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'first_name', label: 'Name', render: (_, row) => `${row.first_name} ${row.last_name}` },
    { key: 'qualification', label: 'Qualification' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs ${val === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {val}
        </span>
      )
    }
  ]

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
        <button onClick={() => navigate('/teachers/new')} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add Teacher
        </button>
      </div>

      <DataTable
        columns={columns}
        data={teachers}
        actions={(row) => (
          <>
            <button onClick={() => navigate(`/teachers/${row.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
              <Eye size={18} />
            </button>
            <button onClick={() => handleDelete(row.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
              <Trash2 size={18} />
            </button>
          </>
        )}
      />
    </div>
  )
}