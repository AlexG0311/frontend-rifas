import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContextAuth } from '../hooks/useContextAuth';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useContextAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};