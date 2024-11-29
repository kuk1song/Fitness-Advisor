import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService'; // import the AuthService which is used to make backend API calls
import InputWithDynamicColor from '../components/InputWithDynamicColor';

function Register() {
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [alertVisible, setAlertVisible] = useState(false)
  const navigate = useNavigate();
  
  // Update the form data when the user types in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // submit the form data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email;
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Checks all fields have content
    if(formData.email.length > 0 && formData.name.length > 0) {
      // If email fails validation then return alert
      if (!emailRegex.test(email)) {
        if(!alertVisible) {
          alert('Please enter a valid email address.');
          setAlertVisible(true)
        }
      }
    } else {
      alert('Please fill out all fields.');
      setAlertVisible(true)
      return
    }
    localStorage.setItem("userInfo", formData)
    navigate("/user-info-form")
    setAlertVisible(false)
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register</h2>
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          type="text" 
          name="name" 
          placeholder="Username" 
          value={formData.name} 
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
        <button type="submit" onClick={handleSubmit} style={{ padding: '10px 20px', width: '150px' }}>Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign In</Link></p>
    </div>
  );
}

export default Register;