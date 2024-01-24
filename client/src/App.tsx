import React from 'react';
import theme from "./flowbite-theme";

import { Flowbite } from 'flowbite-react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from './pages';
import SignInPage from './pages/authentication/sign-in';
import SignUpPage from './pages/authentication/sign-up';
import UserListPage from './pages/users/UserListPage';
import {api_url} from './config'
import axios from 'axios';

// Create an authentication function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  React.useEffect(()=>{
    let config = {
      method: 'get',
      url: `${api_url}` +'/api/users/current',
      headers: {
        'Authorization': 'Bearer ' +  token
      }
    };
    
    axios.request(config)
    .then((response) => {
      if (response.status === 200) {
        const data = JSON.stringify(response.data);
        localStorage.setItem('active_user', data);
      }
    })
    .catch((error) => {
      if(error.response.status === 401){
        localStorage.clear();
      }
    });
  },[token])
  return token !== null; 
};

// PrivateRoute component to handle authentication checks for protected routes
interface PrivateRouteProps {
  element: React.ComponentType; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element, ...rest }) => {
  const userDataString = localStorage.getItem('active_user');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  const isAdmin = userData?.role === 'admin';

  return isAuthenticated() ? (
    isAdmin ? <Element {...rest} /> : <Element {...rest} />
  ) : (
    <Navigate to="/authentication/sign-in" replace />
  );
};

// PublicRoute component to handle routes accessible to unauthenticated users
interface PublicRouteProps {
  element: React.ComponentType; // Change to React.ComponentType
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element: Element, ...rest }) => {
  const isLoggedIn = isAuthenticated();

  return isLoggedIn ? <Navigate to="/" replace /> : <Element {...rest} />;
};

function App() {
  return (
    <Flowbite theme={{ theme }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute element={DashboardPage} />} index />
        <Route path="/authentication/sign-in" element={<PublicRoute element={SignInPage} />} />
        <Route path="/authentication/sign-up" element={<PublicRoute element={SignUpPage} />} />
        <Route path="/users/list" element={<PrivateRoute element={UserListPage} />} />
        <Route path="*" element={<div>Page not found!</div>} />
      </Routes>
    </BrowserRouter>
  </Flowbite>
  )
}

export default App;
