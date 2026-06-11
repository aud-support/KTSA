import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
