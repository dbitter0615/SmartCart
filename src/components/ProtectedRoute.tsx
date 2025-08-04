import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    // Optionally, render a loading spinner or placeholder here
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;