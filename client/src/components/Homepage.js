import { Link, useNavigate } from 'react-router-dom';
import '../styles/ButtonStyles.css';
import '../styles/LinkStyles.css';

function Homepage() {
  const navigate = useNavigate();
  
  // let is_login = localStorage.getItem('userToken');
  let is_login = true;
  if(!is_login) {
    navigate("/login");
    return;
  }

  return (
    <div style={{ textAlign: 'center' }}>
        <h1>Welcome to the Fitness Advisor !</h1>
        <div className="nav-container">
            <Link to="/user" className="link-button data-button">
              My Data
            </Link>
            <Link to="/calendar" className="link-button calendar-button">
              My Calendar
            </Link>
        </div>
      
      <Link to="/logout" className="logout-button">
        Logout
      </Link>
    </div>
  );
}

export default Homepage;