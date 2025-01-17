const BASE_URL = 'http://localhost:5000'; 

export const HealthService = {
  healthInfo: async (healthData) => {
    try {
      // +-------------------------+
      // | Get the User ID Data    |
      // +-------------------------+
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Please log in again.');
      }

      // +-------------------------+
      // | Send the Health Data    |
      // +-------------------------+
      const response = await fetch(`${BASE_URL}/api/health`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(healthData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit health data');
      }

      return data;
    } catch (error) {
      console.error('(Frontend) Error:', error);
      throw new Error('(Frontend) Failed to submit health data');
    }
  },

  getUserHealth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch health data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching health data:', error);
      throw error;
    }
  },

  getHealthHistory: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${BASE_URL}/api/health/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch health history');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching health history:', error);
      throw error;
    }
  }
};