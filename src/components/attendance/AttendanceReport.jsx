// src/components/attendance/AttendanceReport.jsx
import { useState, useEffect } from 'react'
import { attendanceService } from '../../services/attendance.service'
import { classService } from '../../services/class.service'
import { reportService } from '../../services/report.service'
import toast from 'react-hot-toast'
import Loader from '../common/Loader'
import { Download, FileText, Calendar } from 'lucide-react'

export default function AttendanceReport() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await classService.getAll()
      setClasses(response.data || [])
    } catch (error) {
      toast.error('Failed to load classes')
    }
  }

  const generateReport = async () => {
    if (!selectedClass || !selectedSection) {
      toast.error('Please select class and section')
      return
    }

    setLoading(true)
    try {
      const response = await reportService.getMonthlyAttendance({
        class_id: selectedClass,
        section_id: selectedSection,
        month,
        year
      })

      setReport(response.data || null)
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = async () => {
    try {
      const blob = await reportService.exportAttendance({
        class_id: selectedClass,
        section_id: selectedSection,
        month,
        year
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance_report_${month}_${year}.xlsx`
      a.click()
    } catch (error) {
      toast.error('Export failed')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance Report</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input-field"
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="input-field"
            disabled={!selectedClass}
          >
            <option value="">Select Section</option>
            {classes.find(c => c.id == selectedClass)?.sections?.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select value={month} onChange={(e) => setMonth(e.target.value)} className="input-field">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field">
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button onClick={generateReport} className="btn-primary flex items-center justify-center">
            <FileText size={18} className="mr-2" />
            Generate
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : report ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">
                {report.month}/{report.year} - Working Days: {report.working_days}
              </h3>
              <p className="text-sm text-gray-600">
                Class: {classes.find(c => c.id == selectedClass)?.name} -
                Section: {classes.find(c => c.id == selectedClass)?.sections?.find(s => s.id == selectedSection)?.name}
              </p>
            </div>
            <button onClick={exportToExcel} className="btn-secondary flex items-center">
              <Download size={18} className="mr-2" />
              Export Excel
            </button>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Roll No</th>
                <th className="table-header">Student Name</th>
                <th className="table-header text-center">Present</th>
                <th className="table-header text-center">Absent</th>
                <th className="table-header text-center">Late</th>
                <th className="table-header text-center">Half Day</th>
                <th className="table-header text-center">Leave</th>
                <th className="table-header text-center">%</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.students?.map((student, idx) => (
                <tr key={idx} className={student.attendance_percentage < 75 ? 'bg-red-50' : ''}>
                  <td className="table-cell">{student.roll_number}</td>
                  <td className="table-cell font-medium">{student.name}</td>
                  <td className="table-cell text-center text-green-600">{student.present_days}</td>
                  <td className="table-cell text-center text-red-600">{student.absent_days}</td>
                  <td className="table-cell text-center text-yellow-600">{student.late_days}</td>
                  <td className="table-cell text-center text-orange-600">{student.half_days}</td>
                  <td className="table-cell text-center text-blue-600">{student.leave_days}</td>
                  <td className={`table-cell text-center font-bold ${student.attendance_percentage < 75 ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {student.attendance_percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Select filters and generate report</p>
        </div>
      )}
    </div>
  )
}