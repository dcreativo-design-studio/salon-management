import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

// Route protection for staff users only
const StaffRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // Show loading state or spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to home if authenticated but not staff
  if (user.role !== 'staff' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Render children if authenticated and staff/admin
  return children;
};

export default StaffRoute;
