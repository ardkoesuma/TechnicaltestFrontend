 import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import isAuthenticated from './auth'; // Import your authentication function

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/Dashboard" replace />;
};

export default PrivateRoute;