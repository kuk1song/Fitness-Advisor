import { Link } from 'react-router-dom';
import '../styles/ButtonStyles.css';
import '../styles/LinkStyles.css';

function Homepage() {
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