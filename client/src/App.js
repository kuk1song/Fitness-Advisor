// import logo from './logo.svg';
import './App.css';
import React from 'react';
import UserInfoForm from './components/UserInfoForm';
import CalendarComponent from './components/CalendarComponent';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import './styles/ReactCalendar.css';

function App() {
  return (

    /* router setup */
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/user" element={<UserInfoForm />} />
          <Route path="/calendar" element={<CalendarComponent />} />
        </Routes>
      </div>
    </Router>
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
