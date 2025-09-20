import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthed } = useAuth();
  if (isAuthed) return <Navigate to="/" replace />;
  return children;
};

export default PublicOnlyRoute;
