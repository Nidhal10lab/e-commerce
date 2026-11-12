import { useSelector } from 'react-redux'
import { Navigate, useLocation, Outlet } from 'react-router-dom'

/**
 * Protects admin routes.
 * If admin is not authenticated, redirects to /admin/login (or /login) with current location state.
 */
function AdminRoute({ children }) {
  const { isAdminAuthenticated } = useSelector((state) => state.adminAuth)
  const location = useLocation()

  if (!isAdminAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}

export default AdminRoute

