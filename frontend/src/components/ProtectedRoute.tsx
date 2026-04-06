import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// We wrap any protected routes with this component. 
// If the user isn't logged in, they're automatically kicked out!
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location they 
    // were trying to go to. This is a nice UX improvement for after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // The 'Outlet' renders the child component of this route!
  return <Outlet />;
}
