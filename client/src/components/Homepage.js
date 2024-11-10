import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div>
        <h1>Welcome to the Fitness Advisor !</h1>
        <li>
            <Link to="/user">My data</Link>
        </li>
        <li>
            <Link to="/calendar">My Calendar</Link>
        </li>
    </div>
  );
}

export default Homepage;