import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService'; // import the AuthService which is used to make backend API calls
import InputWithDynamicColor from '../components/InputWithDynamicColor';

function Register() {
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [error, setError] = useState('');  // using for error handling
  const navigate = useNavigate();
  
  // Update the form data when the user types in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // submit the form data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // clear any previous errors

    try {
        // call the register method from the AuthService
        const response = await AuthService.register(formData);
        // check if the response is successful
        if (response && response.message === 'User registered successfully') {
            // show a success message and redirect to the login page
            localStorage.setItem('registrationSuccess', 'Registration successful, please log in!');
            navigate('/login');    
        } else {
            console.error('Unexpected response format:', response);
        }
    } catch (error) {
          // handle the error
          console.error('Registration error:', error);
          setError('Registration failed. Please try it again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register</h2>
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
        <button type="submit" style={{ padding: '10px 20px', width: '150px' }}>Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* display error message */}
      </form>
      <p>Already have an account? <Link to="/login">Sign In</Link></p>
    </div>
  );
}

export default Register;