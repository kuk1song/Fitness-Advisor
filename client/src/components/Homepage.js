import { Link, useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import '../styles/Title.css';
import '../styles/ButtonStyles.css';
import '../styles/LinkStyles.css';
import '../styles/GridStyle.css';
import '../styles/Background.css';
import '../styles/Homepage.css';

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
      <div className="bg bg-homepage"></div>
      <Suspense fallback={<Loading />}>
        <h1 className='title'>Welcome to the Fitness Advisor !</h1>
        <GridButtons />
        <Link to="/logout" className="logout-button">
          Logout
        </Link>
      </Suspense>
    </div>
  );
}

function GridButtons() {
  return <>
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
  </>
}

function Loading() {
  return <img class='loading' src='../../public/loading.gif' alt='loading'></img>
}

export default Homepage;