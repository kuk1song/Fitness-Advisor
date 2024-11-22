import React from 'react';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to Fitness Advisor</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;