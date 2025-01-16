const BASE_URL = 'http://localhost:5000/api'; 

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
      const response = await fetch(`${BASE_URL}/health`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(healthData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(e => ({ message: 'No JSON response' }));
        console.log('Error data:', errorData);
        throw new Error('(Frontend) Failed to submit health data');
      }

      return await response.json();
    } catch (error) {
      console.error('(Frontend) Error:', error);
      throw error;
    }
  }
};