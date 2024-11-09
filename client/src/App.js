// import logo from './logo.svg';
import './App.css';
import React from 'react';
import UserInfoForm from './components/UserInfoForm';
import CalendarComponent from './components/CalendarComponent';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import './styles/ReactCalendar.css';

function App() {
  return (

    // <Router>
    //   <div>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/">Fitness Advisor</Link>
    //         </li>
    //         <li>
    //           <Link to="/calendar">My Calendar</Link>
    //         </li>
    //       </ul>
    //     </nav>

    //     <Routes>
    //       <Route path="/" element={ <UserInfoForm />} />
    //       <Route path="/calendar" element={<CalendarComponent />} />
    //     </Routes>
    //   </div>
    // </Router>

    <div className="App">
      
      <h1>Fitness Advisor</h1>
      <UserInfoForm />

      <CalendarComponent />
    </div>
  
  )
}

export default App;
