const BASE_URL = 'http://localhost:5000'; // Define the base URL for the API

export const AuthService = {
  register: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('User registered successfully:', data);
      return data; // Return success message or user data
    } catch (error) {
      console.error('Registration error:', error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token in loacal
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;

    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  getUser: async () => {
    try {
      const token = localStorage.getItem('token');
      // console.log('Using token:', token); 

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const data = await response.json();
      console.log('User data received(AuthService):', data); 
      return data;
    } catch (error) {
      console.error('Detailed error:', error);
      throw error;
    }
  },
  
};