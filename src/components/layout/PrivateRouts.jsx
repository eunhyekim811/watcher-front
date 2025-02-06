import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
import { useAuth } from '../../App';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // 또는 로딩 스피너
  }

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  console.log('Current user:', user);

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute; 