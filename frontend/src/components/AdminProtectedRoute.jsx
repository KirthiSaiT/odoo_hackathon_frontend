import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';

/**
 * AdminProtectedRoute - Only allows Admin or Employee roles
 * Redirects regular users to /home (user dashboard)
 */
const AdminProtectedRoute = () => {
  const user = useSelector(selectCurrentUser);
  
  // Check if user is Admin or Employee
  const isAdminOrEmployee = 
    user?.role === 'ADMIN' || 
    user?.role === 'EMPLOYEE' ||
    user?.role_id === 1 || 
    user?.role_id === 2;

  if (!isAdminOrEmployee) {
    // Regular users are redirected to user home
    return <Navigate to="/user/home" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
