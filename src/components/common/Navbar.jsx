// src/components/common/Navbar.jsx
import { useAuthStore } from '../../context/AuthContext'
import { Bell, User, LogOut, Menu } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">School CMS</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm capitalize">
              {user?.role} | {user?.email}
            </span>
            <button 
              onClick={logout}
              className="p-2 hover:bg-primary-700 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}