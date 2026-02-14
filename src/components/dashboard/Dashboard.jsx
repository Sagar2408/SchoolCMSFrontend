// src/components/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react'
import { reportService } from '../../services/report.service'
import { useAuthStore } from '../../context/AuthContext'
import { 
  Users, 
  UserCircle, 
  GraduationCap, 
  DollarSign, 
  CalendarCheck,
  TrendingUp
} from 'lucide-react'
import Loader from '../common/Loader'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await reportService.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  const statCards = [
    { title: 'Total Students', value: stats?.total_students || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Teachers', value: stats?.total_teachers || 0, icon: UserCircle, color: 'bg-green-500' },
    { title: 'Total Classes', value: stats?.total_classes || 0, icon: GraduationCap, color: 'bg-purple-500' },
    { title: 'Today Attendance', value: stats?.today_attendance || 0, icon: CalendarCheck, color: 'bg-yellow-500' },
    { title: 'Pending Fees', value: `₹${stats?.total_pending_fees || 0}`, icon: DollarSign, color: 'bg-red-500' },
    { title: 'Monthly Collection', value: `₹${stats?.monthly_collection || 0}`, icon: TrendingUp, color: 'bg-indigo-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {user?.role === 'admin' ? 'Administrator' : 'Teacher'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="card flex items-center">
            <div className={`${card.color} p-4 rounded-lg text-white mr-4`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/students/new" className="block p-3 bg-gray-50 rounded hover:bg-gray-100">
              + Add New Student
            </a>
            <a href="/attendance/mark" className="block p-3 bg-gray-50 rounded hover:bg-gray-100">
              + Mark Attendance
            </a>
            <a href="/fees/payment" className="block p-3 bg-gray-50 rounded hover:bg-gray-100">
              + Record Payment
            </a>
            <a href="/exams/marks" className="block p-3 bg-gray-50 rounded hover:bg-gray-100">
              + Enter Marks
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Academic Year</h3>
          <p className="text-3xl font-bold text-primary-600">{stats?.academic_year}</p>
          <p className="text-gray-600 mt-2">Current Academic Session</p>
        </div>
      </div>
    </div>
  )
}