import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminRoute({ children }) {
  const { isLoggedIn, isStaff } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (!isStaff) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute