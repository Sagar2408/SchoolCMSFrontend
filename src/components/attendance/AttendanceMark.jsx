// src/components/attendance/AttendanceMark.jsx
import { useState, useEffect } from 'react'
import { classService } from '../../services/class.service'
import { studentService } from '../../services/student.service'
import { attendanceService } from '../../services/attendance.service'
import { teacherService } from '../../services/teacher.service'
import { useAuthStore } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import Loader from '../common/Loader'
import { Calendar, Check, X, Clock, AlertCircle, UserCheck, UserX, UserMinus } from 'lucide-react'

export default function AttendanceMark() {
  const { user } = useAuthStore()
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [myClasses, setMyClasses] = useState([])

  useEffect(() => {
    if (user?.role === 'teacher') {
      loadMyClasses()
    } else {
      loadAllClasses()
    }
  }, [])

  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find(c => c.id == selectedClass)
      setSections(cls?.sections || [])
      setSelectedSection('')
      setStudents([])
    }
  }, [selectedClass])

  useEffect(() => {
    if (selectedSection) {
      loadStudents()
    }
  }, [selectedSection])

  useEffect(() => {
    if (selectedSection && date) {
      loadExistingAttendance()
    }
  }, [selectedSection, date])

  const loadMyClasses = async () => {
    try {
      const response = await teacherService.getMyClasses()
      // response = { success, data }

      const classList = response.data || []

      const uniqueClasses = [
        ...new Map(
          classList
            .filter(item => item.Class)
            .map(item => [item.Class.id, item.Class])
        ).values()
      ]

      setClasses(uniqueClasses)
    } catch (error) {
      toast.error('Failed to load your classes')
    }
  }

  const loadAllClasses = async () => {
    try {
      const response = await classService.getAll()
      // response = { success, data }
      setClasses(response.data || [])
    } catch (error) {
      toast.error('Failed to load classes')
    }
  }

  const loadStudents = async () => {
    try {
      setLoading(true)
      const response = await studentService.getByClass(selectedClass, selectedSection)
      // response = { success, data }

      setStudents(response.data || [])

      const initialAttendance = {}
      response.data?.forEach(student => {
        initialAttendance[student.id] = { status: 'present', remarks: '' }
      })
      setAttendance(initialAttendance)
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const loadExistingAttendance = async () => {
    try {
      const response = await attendanceService.getByDate({
        class_id: selectedClass,
        section_id: selectedSection,
        date
      })

      if (response.data?.length > 0) {
        const existingAttendance = {}
        response.data.forEach(record => {
          existingAttendance[record.student_id] = {
            status: record.status,
            remarks: record.remarks || ''
          }
        })
        setAttendance(prev => ({ ...prev, ...existingAttendance }))
        toast.success('Loaded existing attendance for this date')
      }
    } catch (error) {
      console.log('No existing attendance found')
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }))
  }

  const handleRemarksChange = (studentId, remarks) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }))
  }

  const handleMarkAll = (status) => {
    const newAttendance = {}
    students.forEach(student => {
      newAttendance[student.id] = { ...attendance[student.id], status }
    })
    setAttendance(newAttendance)
    toast.success(`Marked all as ${status}`)
  }

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSection) {
      toast.error('Please select class and section')
      return
    }

    const attendanceList = Object.entries(attendance).map(([student_id, data]) => ({
      student_id: parseInt(student_id),
      status: data.status,
      remarks: data.remarks
    }))

    setSubmitting(true)
    try {
      await attendanceService.markAttendance({
        class_id: parseInt(selectedClass),
        section_id: parseInt(selectedSection),
        date,
        attendance_list: attendanceList
      })
      toast.success('Attendance saved successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to save attendance')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300'
      case 'absent': return 'bg-red-100 text-red-800 border-red-300'
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'half_day': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'leave': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <UserCheck size={16} />
      case 'absent': return <UserX size={16} />
      case 'late': return <Clock size={16} />
      case 'half_day': return <UserMinus size={16} />
      case 'leave': return <AlertCircle size={16} />
      default: return null
    }
  }

  const stats = {
    present: Object.values(attendance).filter(a => a.status === 'present').length,
    absent: Object.values(attendance).filter(a => a.status === 'absent').length,
    late: Object.values(attendance).filter(a => a.status === 'late').length,
    half_day: Object.values(attendance).filter(a => a.status === 'half_day').length,
    leave: Object.values(attendance).filter(a => a.status === 'leave').length,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field"
              disabled={!selectedClass}
            >
              <option value="">Select Section</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex items-end">
            <div className="flex space-x-2">
              <button onClick={() => handleMarkAll('present')} className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm">
                All Present
              </button>
              <button onClick={() => handleMarkAll('absent')} className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">
                All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {students.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Present: {stats.present}
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              Absent: {stats.absent}
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Late: {stats.late}
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              Half Day: {stats.half_day}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Leave: {stats.leave}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              Total: {students.length}
            </span>
          </div>
        )}
      </div>

      {/* Students List */}
      {loading ? (
        <Loader />
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Select class and section to view students</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Roll No</th>
                <th className="table-header">Student Name</th>
                <th className="table-header">Status</th>
                <th className="table-header">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="table-cell">{student.roll_number || '-'}</td>
                  <td className="table-cell font-medium">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      {['present', 'absent', 'late', 'half_day', 'leave'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student.id, status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${attendance[student.id]?.status === status
                            ? getStatusColor(status)
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(status)}
                            <span className="capitalize">{status.replace('_', ' ')}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    <input
                      type="text"
                      value={attendance[student.id]?.remarks || ''}
                      onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                      className="input-field w-48 text-sm"
                      placeholder="Add remarks..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={20} className="mr-2" />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}