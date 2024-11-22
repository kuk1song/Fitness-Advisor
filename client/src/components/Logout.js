import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    
    localStorage.removeItem('userToken'); // clear the token

    navigate('/login');
  }, [navigate]);

  return null; // don't render anything
}

export default Logout;