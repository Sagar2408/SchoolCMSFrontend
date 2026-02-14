// src/components/fees/PendingFees.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { feeService } from '../../services/fee.service'
import { classService } from '../../services/class.service'
import DataTable from '../common/DataTable'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'
import { Download, DollarSign, Eye } from 'lucide-react'

export default function PendingFees() {
  const navigate = useNavigate()
  const [fees, setFees] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    class_id: '',
    section_id: '',
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  })

  useEffect(() => {
    loadClasses()
    loadPendingFees()
  }, [])

  useEffect(() => {
    loadPendingFees()
  }, [filters])

  const loadClasses = async () => {
    try {
      const response = await classService.getAll()
      setClasses(response.data || [])
    } catch (error) {
      toast.error('Failed to load classes')
    }
  }

  const loadPendingFees = async () => {
    try {
      setLoading(true)
      const response = await feeService.getPendingFees({
        class_id: filters.class_id || undefined,
        section_id: filters.section_id || undefined,
        academic_year: filters.academic_year
      })
      setFees(response.data?.pending_fees || [])
    } catch (error) {
      toast.error('Failed to load pending fees')
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = async () => {
    try {
      const blob = await feeService.exportPendingFees(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pending_fees_${filters.academic_year}.xlsx`
      a.click()
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const columns = [
    { key: 'Student.admission_number', label: 'Admission No', render: (_, row) => row.Student?.admission_number },
    { key: 'Student.first_name', label: 'Student Name', render: (_, row) => `${row.Student?.first_name} ${row.Student?.last_name}` },
    { key: 'Student.Class.name', label: 'Class', render: (_, row) => row.Student?.Class?.name },
    { key: 'Student.Section.name', label: 'Section', render: (_, row) => row.Student?.Section?.name },
    { key: 'total_amount', label: 'Total (₹)', render: (val) => `₹${val}` },
    { key: 'paid_amount', label: 'Paid (₹)', render: (val) => `₹${val}` },
    { key: 'pending_amount', label: 'Pending (₹)', render: (val) => <span className="text-red-600 font-medium">₹${val}</span> },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          val === 'overdue' ? 'bg-red-100 text-red-800' :
          val === 'partial' ? 'bg-yellow-100 text-yellow-800' :
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
        <h1 className="text-2xl font-bold text-gray-800">Pending Fees</h1>
        <div className="flex space-x-3">
          <button onClick={() => navigate('/fees/payment')} className="btn-primary flex items-center">
            <DollarSign size={18} className="mr-2" />
            Record Payment
          </button>
          <button onClick={exportToExcel} className="btn-secondary flex items-center">
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
        <select
          value={filters.class_id}
          onChange={(e) => setFilters({ ...filters, class_id: e.target.value, section_id: '' })}
          className="input-field w-48"
        >
          <option value="">All Classes</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filters.section_id}
          onChange={(e) => setFilters({ ...filters, section_id: e.target.value })}
          className="input-field w-48"
          disabled={!filters.class_id}
        >
          <option value="">All Sections</option>
          {classes.find(c => c.id == filters.class_id)?.sections?.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={filters.academic_year}
          onChange={(e) => setFilters({ ...filters, academic_year: e.target.value })}
          className="input-field w-48"
          placeholder="Academic Year"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-blue-800">Total Pending Amount</p>
          <p className="text-2xl font-bold text-blue-900">
            ₹{fees.reduce((sum, f) => sum + parseFloat(f.pending_amount), 0).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-blue-800">Total Students</p>
          <p className="text-2xl font-bold text-blue-900">{fees.length}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={fees}
        actions={(row) => (
          <button 
            onClick={() => navigate('/fees/payment', { state: { studentId: row.student_id, feeId: row.id } })}
            className="p-2 text-green-600 hover:bg-green-50 rounded"
            title="Record Payment"
          >
            <DollarSign size={18} />
          </button>
        )}
      />
    </div>
  )
}