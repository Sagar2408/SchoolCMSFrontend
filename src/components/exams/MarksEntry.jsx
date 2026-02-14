// src/components/exams/MarksEntry.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { examService } from '../../services/exam.service'
import { classService } from '../../services/class.service'
import { studentService } from '../../services/student.service'
import toast from 'react-hot-toast'
import Loader from '../common/Loader'
import { Check, FileText } from 'lucide-react'

export default function MarksEntry() {
  const [searchParams] = useSearchParams()
  const preselectedExam = searchParams.get('examId')

  const [exams, setExams] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [selectedExam, setSelectedExam] = useState(preselectedExam || '')
  const [selectedSchedule, setSelectedSchedule] = useState('')
  const [marks, setMarks] = useState({})
  const [loading, setLoading] = useState(false)
  const [scheduleDetails, setScheduleDetails] = useState(null)

  useEffect(() => {
    loadExams()
    loadClasses()
  }, [])

  useEffect(() => {
    if (selectedExam) {
      loadExamSchedule()
    }
  }, [selectedExam])

  useEffect(() => {
    if (selectedSchedule) {
      const schedule = subjects.find(s => s.id == selectedSchedule)
      setScheduleDetails(schedule)
      loadStudents(schedule?.class_id)
    }
  }, [selectedSchedule])

  const loadExams = async () => {
    try {
      const response = await examService.getAll({ is_active: true })
      setExams(response.data || [])
    } catch (error) {
      toast.error('Failed to load exams')
    }
  }

  const loadClasses = async () => {
    try {
      const response = await classService.getAll()
      setClasses(response.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const loadExamSchedule = async () => {
    try {
      const response = await examService.getSchedule(selectedExam)
      setSubjects(response.data || [])
    } catch (error) {
      toast.error('Failed to load exam schedule')
    }
  }

  const loadStudents = async (classId) => {
    if (!classId) return
    try {
      setLoading(true)
      const response = await studentService.getByClass(classId)
      setStudents(response.data || [])
      
      // Initialize marks
      const initialMarks = {}
      response.data?.forEach(student => {
        initialMarks[student.id] = { marks_obtained: '', is_present: true, remarks: '' }
      })
      setMarks(initialMarks)
      
      // Load existing marks
      loadExistingMarks()
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const loadExistingMarks = async () => {
    try {
      const response = await examService.getMarksForVerification({ exam_schedule_id: selectedSchedule })
      if (response.data?.length > 0) {
        const existingMarks = {}
        response.data.forEach(mark => {
          existingMarks[mark.student_id] = {
            marks_obtained: mark.marks_obtained,
            is_present: mark.is_present,
            remarks: mark.remarks || ''
          }
        })
        setMarks(prev => ({ ...prev, ...existingMarks }))
      }
    } catch (error) {
      console.log('No existing marks')
    }
  }

  const handleMarkChange = (studentId, field, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }))
  }

  const handleSubmit = async () => {
    const marksData = Object.entries(marks).map(([student_id, data]) => ({
      student_id: parseInt(student_id),
      marks_obtained: parseFloat(data.marks_obtained) || 0,
      is_present: data.is_present,
      remarks: data.remarks
    }))

    setLoading(true)
    try {
      await examService.enterMarks({
        exam_schedule_id: parseInt(selectedSchedule),
        marks_data: marksData
      })
      toast.success('Marks saved successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to save marks')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Enter Marks</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => {
                setSelectedExam(e.target.value)
                setSelectedSchedule('')
                setStudents([])
              }}
              className="input-field"
            >
              <option value="">Select Exam</option>
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject/Class</label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="input-field"
              disabled={!selectedExam}
            >
              <option value="">Select Schedule</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.Subject?.name} - {s.Class?.name} ({new Date(s.exam_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {scheduleDetails && (
            <div className="flex items-center">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-800">Max Marks: <span className="font-bold">{scheduleDetails.max_marks}</span></p>
                <p className="text-sm text-blue-800">Pass Marks: <span className="font-bold">{scheduleDetails.pass_marks}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : students.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Roll No</th>
                <th className="table-header">Student Name</th>
                <th className="table-header text-center">Present</th>
                <th className="table-header text-center">Marks Obtained</th>
                <th className="table-header">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className={!marks[student.id]?.is_present ? 'bg-red-50' : ''}>
                  <td className="table-cell">{student.roll_number || '-'}</td>
                  <td className="table-cell font-medium">{student.first_name} {student.last_name}</td>
                  <td className="table-cell text-center">
                    <input
                      type="checkbox"
                      checked={marks[student.id]?.is_present}
                      onChange={(e) => handleMarkChange(student.id, 'is_present', e.target.checked)}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="table-cell text-center">
                    <input
                      type="number"
                      min="0"
                      max={scheduleDetails?.max_marks || 100}
                      value={marks[student.id]?.marks_obtained || ''}
                      onChange={(e) => handleMarkChange(student.id, 'marks_obtained', e.target.value)}
                      className="input-field w-24 text-center"
                      disabled={!marks[student.id]?.is_present}
                    />
                    <span className="text-gray-500 ml-2">/ {scheduleDetails?.max_marks || 100}</span>
                  </td>
                  <td className="table-cell">
                    <input
                      type="text"
                      value={marks[student.id]?.remarks || ''}
                      onChange={(e) => handleMarkChange(student.id, 'remarks', e.target.value)}
                      className="input-field w-48"
                      placeholder="Remarks..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <Check size={20} className="mr-2" />
                  Save Marks
                </>
              )}
            </button>
          </div>
        </div>
      ) : selectedSchedule ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No students found for this class</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Select exam and subject to enter marks</p>
        </div>
      )}
    </div>
  )
}