import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Auth layout for login/signup pages
 * Clean minimal layout without navbar
 */
const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-savora-cream">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-savora-cream bg-grid flex items-center justify-center px-4 py-12">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
