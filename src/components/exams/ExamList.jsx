// src/components/exams/ExamList.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { examService } from '../../services/exam.service'
import DataTable from '../common/DataTable'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import { Plus, Calendar, FileText, Trash2, Edit } from 'lucide-react'

export default function ExamList() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    type: ''
  })

  useEffect(() => {
    loadExams()
  }, [filters])

  const loadExams = async () => {
    try {
      const response = await examService.getAll(filters)
      setExams(response.data || [])
    } catch (error) {
      toast.error('Failed to load exams')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await examService.delete(id)
      toast.success('Exam deleted')
      loadExams()
    } catch (error) {
      toast.error('Failed to delete exam')
    }
  }

  const columns = [
    { key: 'name', label: 'Exam Name' },
    { 
      key: 'type', 
      label: 'Type',
      render: (val) => (
        <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs">
          {val.replace('_', ' ')}
        </span>
      )
    },
    { key: 'academic_year', label: 'Academic Year' },
    { 
      key: 'start_date', 
      label: 'Start Date',
      render: (val) => val ? new Date(val).toLocaleDateString() : '-'
    },
    { 
      key: 'end_date', 
      label: 'End Date',
      render: (val) => val ? new Date(val).toLocaleDateString() : '-'
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs ${val ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exams</h1>
        <button onClick={() => navigate('/exams/new')} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Create Exam
        </button>
      </div>

      <DataTable
        columns={columns}
        data={exams}
        actions={(row) => (
          <>
            <button onClick={() => navigate(`/exams/schedule/${row.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Schedule">
              <Calendar size={18} />
            </button>
            <button onClick={() => navigate(`/exams/marks?examId=${row.id}`)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Enter Marks">
              <FileText size={18} />
            </button>
            <button onClick={() => handleDelete(row.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
              <Trash2 size={18} />
            </button>
          </>
        )}
      />
    </div>
  )
}