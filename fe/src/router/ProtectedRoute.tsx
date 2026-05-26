import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasChangedPassword } from '@/utils/hasChangedPassword';
import NotAllowAccess from '@/components/NotAllowAccess';
import Spinner from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Spinner className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If password not changed and not already on the change-password route
  if (!hasChangedPassword(user) && !location.pathname.startsWith('/change-password')) {
    return <NotAllowAccess />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
