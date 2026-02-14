// src/components/common/PrivateRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../context/AuthContext'

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}