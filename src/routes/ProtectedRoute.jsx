import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { showToast } from '../redux/toastSlice'
import { userService } from '../services/userService'

/**
 * Wraps protected routes.
 * - Redirects to /login if not authenticated.
 * - Periodically re-checks if the logged-in user has been blocked by admin.
 *   If blocked, logs them out immediately and redirects to /login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    async function checkBlocked() {
      try {
        const res = await userService.getById(user.id)
        if (res.data?.isBlocked) {
          dispatch(logout())
          dispatch(showToast(
            'Your account has been suspended by the administrator.',
            'error'
          ))
        }
      } catch { /* ignore network errors */ }
    }

    checkBlocked()
  }, [isAuthenticated, user, dispatch, location.pathname])

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
