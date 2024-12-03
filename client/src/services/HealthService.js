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
      const response = await fetch(`${BASE_URL}/health`, { // POST /health
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(healthData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit health data.');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to submit health data.');
        }
      }

      const data = await response.json();
      console.log('Health data submitted successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting health data:', error.message);
      return { success: false, message: error.message };
    }
  },
};