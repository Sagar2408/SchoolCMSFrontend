// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './context/AuthContext'
import Login from './components/auth/Login'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import PrivateRoute from './components/common/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'

// Student Module
import StudentList from './components/students/StudentList'
import StudentForm from './components/students/StudentForm'
import StudentDetail from './components/students/StudentDetail'

// Teacher Module
import TeacherList from './components/teachers/TeacherList'
import TeacherForm from './components/teachers/TeacherForm'
import TeacherDetail from './components/teachers/TeacherDetail'

// Class Module
import ClassList from './components/classes/ClassList'
import ClassForm from './components/classes/ClassForm'

// Attendance Module
import AttendanceMark from './components/attendance/AttendanceMark'
import AttendanceReport from './components/attendance/AttendanceReport'

// Fee Module
import FeeStructure from './components/fees/FeeStructure'
import PaymentForm from './components/fees/PaymentForm'
import PendingFees from './components/fees/PendingFees'

// Exam Module
import ExamList from './components/exams/ExamList'
import ExamForm from './components/exams/ExamForm'
import MarksEntry from './components/exams/MarksEntry'
import Results from './components/exams/Results'

// Timetable Module
import TimetableView from './components/timetable/TimetableView'
import TimetableForm from './components/timetable/TimetableForm'

// Admission Module
import AdmissionList from './components/admissions/AdmissionList'
import AdmissionForm from './components/admissions/AdmissionForm'
import NewAdmission from './components/admissions/NewAdmission'

// Reports
import ReportsDashboard from './components/reports/ReportsDashboard'

function App() {
    const { user } = useAuthStore()

    if (!user) {
        return <Login />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />

                        {/* Student Routes */}
                        <Route path="/students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
                        <Route path="/students/new" element={<PrivateRoute><StudentForm /></PrivateRoute>} />
                        <Route path="/students/:id" element={<PrivateRoute><StudentDetail /></PrivateRoute>} />
                        <Route path="/students/:id/edit" element={<PrivateRoute><StudentForm /></PrivateRoute>} />

                        {/* Teacher Routes */}
                        <Route path="/teachers" element={<PrivateRoute><TeacherList /></PrivateRoute>} />
                        <Route path="/teachers/new" element={<PrivateRoute><TeacherForm /></PrivateRoute>} />
                        <Route path="/teachers/:id" element={<PrivateRoute><TeacherDetail /></PrivateRoute>} />

                        {/* Class Routes */}
                        <Route path="/classes" element={<PrivateRoute><ClassList /></PrivateRoute>} />
                        <Route path="/classes/new" element={<PrivateRoute><ClassForm /></PrivateRoute>} />

                        {/* Attendance Routes */}
                        <Route path="/attendance/mark" element={<PrivateRoute><AttendanceMark /></PrivateRoute>} />
                        <Route path="/attendance/report" element={<PrivateRoute><AttendanceReport /></PrivateRoute>} />

                        {/* Fee Routes */}
                        <Route path="/fees/structure" element={<PrivateRoute><FeeStructure /></PrivateRoute>} />
                        <Route path="/fees/payment" element={<PrivateRoute><PaymentForm /></PrivateRoute>} />
                        <Route path="/fees/pending" element={<PrivateRoute><PendingFees /></PrivateRoute>} />

                        {/* Exam Routes */}
                        <Route path="/exams" element={<PrivateRoute><ExamList /></PrivateRoute>} />
                        <Route path="/exams/new" element={<PrivateRoute><ExamForm /></PrivateRoute>} />
                        <Route path="/exams/marks" element={<PrivateRoute><MarksEntry /></PrivateRoute>} />
                        <Route path="/exams/results" element={<PrivateRoute><Results /></PrivateRoute>} />

                        {/* Timetable Routes */}
                        <Route path="/timetable" element={<PrivateRoute><TimetableView /></PrivateRoute>} />
                        <Route path="/timetable/manage" element={<PrivateRoute><TimetableForm /></PrivateRoute>} />

                        {/* Admission Routes */}
                        <Route path="/admissions" element={<PrivateRoute><AdmissionList /></PrivateRoute>} />
                        <Route
                            path="/admissions/new"
                            element={
                                <PrivateRoute>
                                    <NewAdmission />
                                </PrivateRoute>
                            }
                        />

                        {/* Reports */}
                        <Route path="/reports" element={<PrivateRoute><ReportsDashboard /></PrivateRoute>} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default App