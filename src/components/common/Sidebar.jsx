// src/components/common/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  GraduationCap, 
  CalendarCheck, 
  DollarSign, 
  FileText, 
  Clock, 
  ClipboardList,
  BarChart3,
  Settings
} from 'lucide-react'

export default function Sidebar() {
  const { isAdmin, isTeacher } = useAuthStore()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher'] },
    { path: '/students', label: 'Students', icon: Users, roles: ['admin'] },
    { path: '/teachers', label: 'Teachers', icon: UserCircle, roles: ['admin'] },
    { path: '/classes', label: 'Classes', icon: GraduationCap, roles: ['admin'] },
    { path: '/attendance/mark', label: 'Mark Attendance', icon: CalendarCheck, roles: ['admin', 'teacher'] },
    { path: '/attendance/report', label: 'Attendance Report', icon: BarChart3, roles: ['admin'] },
    { path: '/fees/structure', label: 'Fee Structure', icon: DollarSign, roles: ['admin'] },
    { path: '/fees/pending', label: 'Pending Fees', icon: DollarSign, roles: ['admin'] },
    { path: '/exams', label: 'Exams', icon: FileText, roles: ['admin', 'teacher'] },
    { path: '/exams/marks', label: 'Enter Marks', icon: FileText, roles: ['admin', 'teacher'] },
    { path: '/timetable', label: 'Timetable', icon: Clock, roles: ['admin', 'teacher'] },
    { path: '/admissions', label: 'Admissions', icon: ClipboardList, roles: ['admin'] },
    { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin'] },
  ]

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(isAdmin() ? 'admin' : 'teacher')
  )

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="mt-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
              }`
            }
          >
            <item.icon size={20} className="mr-3" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}