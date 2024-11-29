// import logo from './logo.svg';
import './App.css';
import React from 'react';
import UserInfoForm from './components/UserInfoForm';
import CalendarComponent from './components/CalendarComponent';
import { useEffect, useState } from 'react';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import AuthGuard from './components/AuthGuard'; 
// import { AuthService } from './services/AuthService';
import { AuthService } from './services/AuthService';
import './styles/Global.css';
// import './styles/ReactCalendar.css';

const App = () => {
  const [user, setUser] = useState('');
  
  // const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // decode JWT to get user information
      const userInfo = JSON.parse(localStorage.getItem('user'));
      setUser(userInfo);
    } 
  }, []);

  return (
    /* router setup */
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/user-info-form" element={<UserInfoForm />} />
          <Route path="/calendar" element={<CalendarComponent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          
          <Route
              path="/dashboard"
              element={
                <AuthGuard>
                    <Dashboard />
                </AuthGuard>
            }
          />
          
        </Routes>
      </div>
    </Router>
   );
}

export default App;
