import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import InputWithDynamicColor from '../components/InputWithDynamicColor';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await AuthService.login(formData);
      if (response && response.token) {
        navigate('/');
      } else if (response && response.message) {
        setError(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Password or email is incorrect, please try it again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <InputWithDynamicColor 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ marginBottom: '10px', padding: '8px', width: '250px' }}
        />
        <InputWithDynamicColor
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={{ marginBottom: '10px', padding: '8px', width: '250px' }}

        />
        <button type="submit" style={{ padding: '10px 20px', width: '150px' }}>Sign In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
    </div>
  );
}

export default Login