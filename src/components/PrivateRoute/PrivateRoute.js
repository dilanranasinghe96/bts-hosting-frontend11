import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// A PrivateRoute to protect access to the home and admin pages
const PrivateRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If there's no user or the role doesn't match, redirect to login page
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
