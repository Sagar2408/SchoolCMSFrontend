// src/components/students/StudentList.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentService } from '../../services/student.service'
import { classService } from '../../services/class.service'
import DataTable from '../common/DataTable'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import { Eye, Edit, Trash2, Plus, Filter } from 'lucide-react'

export default function StudentList() {
  const navigate = useNavigate()
  // state
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)

  const [filters, setFilters] = useState({
    class_id: '',
    section_id: '',
    status: 'active',
    page: 1,
    limit: 10
  })

  /* ================================
     EFFECTS
  ================================ */

  // Load classes ONLY ONCE
  useEffect(() => {
    loadClasses()
  }, [])

  // Load students WHEN filters change
  useEffect(() => {
    loadStudents()
  }, [filters])

  /* ================================
     API CALLS
  ================================ */

  const loadClasses = async () => {
    try {
      const response = await classService.getAll()
      // response = { success, data }
      setClasses(response.data || [])
    } catch (error) {
      console.error('Failed to load classes', error)
    }
  }

  const loadStudents = async () => {
    try {
      setLoading(true)
      const response = await studentService.getAll(filters)
      // response = { success, data, pagination }

      setStudents(response.data || [])
      setPagination(response.pagination || null)
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return

    try {
      await studentService.delete(id)
      toast.success('Student deleted successfully')
      loadStudents()
    } catch (error) {
      toast.error('Failed to delete student')
    }
  }

  const columns = [
    { key: 'admission_number', label: 'Admission No' },
    { key: 'first_name', label: 'Name', render: (_, row) => `${row.first_name} ${row.last_name}` },
    { key: 'Class', label: 'Class', render: (val) => val?.name || '-' },
    { key: 'Section', label: 'Section', render: (val) => val?.name || '-' },
    { key: 'parent_name', label: 'Parent Name' },
    { key: 'parent_phone', label: 'Parent Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs ${val === 'active' ? 'bg-green-100 text-green-800' :
          val === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
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
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <button onClick={() => navigate('/students/new')} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
        <select
          className="input-field w-48"
          value={filters.class_id}
          onChange={(e) => setFilters({ ...filters, class_id: e.target.value, section_id: '' })}
        >
          <option value="">All Classes</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="input-field w-48"
          value={filters.section_id}
          onChange={(e) => setFilters({ ...filters, section_id: e.target.value })}
          disabled={!filters.class_id}
        >
          <option value="">All Sections</option>
          {classes.find(c => c.id == filters.class_id)?.sections?.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          className="input-field w-48"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="transferred">Transferred</option>
          <option value="graduated">Graduated</option>
          <option value="">All</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={students}
        pagination={pagination}
        onPageChange={(page) => setFilters({ ...filters, page })}
        actions={(row) => (
          <>
            <button onClick={() => navigate(`/students/${row.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
              <Eye size={18} />
            </button>
            <button onClick={() => navigate(`/students/${row.id}/edit`)} className="p-2 text-green-600 hover:bg-green-50 rounded">
              <Edit size={18} />
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