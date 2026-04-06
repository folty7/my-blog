import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// We wrap any protected routes with this component. 
// If the user isn't logged in, they're automatically kicked out!
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Prevent infinite loop if already at login (e.g. during Framer Motion exit animation)
    if (window.location.pathname === '/login') {
      return null; // Or render the old children to keep the exit animation smooth
    }
    // Redirect them to the login page
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // The 'Outlet' renders the child component of this route!
  return <Outlet />;
}
