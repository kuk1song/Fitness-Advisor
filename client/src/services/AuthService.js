const BASE_URL = 'http://localhost:5000/auth'; // Define the base URL for the API

export const AuthService = {
  register: async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
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
      const response = await fetch(`${BASE_URL}/login`, {
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
      localStorage.setItem('token', data.token); // Store token
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;

    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  getUser: async () => {
    const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Token expired or invalid. Logging out...');
      } else {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
      return false;
    }

    const data = await response.json();
    console.log('User data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error.message);
  }
  },
  
};