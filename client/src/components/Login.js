import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (AuthService.login(formData.email, formData.password)) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ marginBottom: '10px', padding: '8px', width: '250px' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={{ marginBottom: '10px', padding: '8px', width: '250px' }}

        />
        <button type="submit"  style={{ padding: '10px 20px', width: '150px' }}>Sign In</button>
      </form>
      <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
    </div>
  );
}

export default Login;