import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
/**
 * Wraps protected routes. Redirects to /login if not authenticated.
 * After login, returns user to the original attempted route.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
