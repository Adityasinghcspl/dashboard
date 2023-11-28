import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Signup from './component/Signup';
import { useEffect } from 'react';
import AdminDashboard from './component/AdminDashboard';
import Dashboard from './component/Dashboard';

// Create a authentication function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null; // Return true if token exists (user is authenticated)
};

// PrivateRoute component to handle authentication checks for protected routes
const PrivateRoute = ({ element: Element, ...rest }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  return isAuthenticated() ? (
    userData?.role === 'admin' ? (
      <AdminDashboard {...rest} />
    ) : (
      <Dashboard {...rest} />
    )
  ) : (
    <Navigate to="/login" replace />
  );
};

// PublicRoute component to handle routes accessible to unauthenticated users
const PublicRoute = ({ element: Element, ...rest }) => {
  const isLoggedIn = isAuthenticated();

  return isLoggedIn ? <Navigate to="/adminDashboard" replace /> : <Element {...rest} />;
};

function App() {
  useEffect(() => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the login page
      <Navigate to="/login" replace />;
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute element={Login} />} />
        <Route path="/" element={<PublicRoute element={Login} />} />
        <Route path="/signup" element={<PublicRoute element={Signup} />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="/adminDashboard" element={<PrivateRoute element={AdminDashboard} />} />
        <Route path="*" element={<div>Page not found!</div>} />
      </Routes>
    </>
  );
}

export default App;
