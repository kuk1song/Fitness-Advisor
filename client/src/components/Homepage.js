import { Link, useNavigate } from 'react-router-dom';
import '../styles/Global.css';
import '../styles/Title.css';
import '../styles/ButtonStyles.css';
import '../styles/LinkStyles.css';
import '../styles/GridStyle.css';
import '../styles/Background.css';

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
      <div className="bg-homepage"></div>
      <h1 className='title'>Welcome to the Fitness Advisor !</h1>
      <div className='grid-buttons'>
        <Link to="/user" className="link-button data-button" title="Change your data and regenerate result!">
          <h1>
            My Data
          </h1>
          <p>
            Customize your data, and we will figure out what you need!
          </p>
        </Link>
        <Link to="/calendar" className="link-button calendar-button" title="Know what your plan for today!">
          <h1>
            My Calendar
          </h1>
          <p>
            Open Calendar, and see what are activities you can do right now!
          </p>
        </Link>
      </div>
      
      <Link to="/logout" className="logout-button">
        Logout
      </Link>
    </div>
  );
}

export default Homepage;