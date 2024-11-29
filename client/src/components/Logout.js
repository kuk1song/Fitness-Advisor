import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    
    localStorage.removeItem('token'); // clear the token

    navigate('/login');
  }, [navigate]);

  return null; // don't render anything
}

export default Logout;