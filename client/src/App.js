// import logo from './logo.svg';
import './App.css';
import React from 'react';
import UserInfoForm from './components/UserInfoForm';
import CalendarComponent from './components/CalendarComponent';
import { useEffect, useState } from 'react';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import AuthGuard from './components/AuthGuard'; 
import { AuthService } from './services/AuthService';
// import './styles/ReactCalendar.css';

const App = () => {
  const [user, setUser] = useState(null);
  
  const isAuthenticated = AuthService.isAuthenticated();

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
          <Route path="/user" element={<UserInfoForm />} />
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

    // <Router>
    //   <Routes>
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route
    //       path="/dashboard"
    //       element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
    //     />
    //   </Routes>
    // </Router>
   );
}

// function Homepage() {
//   return (
//     <div>
//       <h1>Welcome to the Fitness Advisor !</h1>
//       <nav>
//           <ul>
//             <li>
//                 <Link to="/user">My data</Link>
//             </li>
//             <li>
//                 <Link to="/calendar">My Calendar</Link>
//             </li>
//             {/* <li>
//                 <Link to="/">Homepage</Link>
//             </li> */}
//           </ul>
//         </nav>
//     </div>
//   );
// }

export default App;
