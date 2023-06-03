import { Link } from "react-router-dom";
import './Home.css';
import axios from '../../api/axios';
import './Home.css';

const LOGOUT_URL = '/logout';

const handleLogout = async (e) => {
  e.preventDefault();

  const authData = JSON.parse(localStorage.getItem('authData'));
  const token = authData?.token;
  const id = authData?.id;

  if (!token || !id) {
    console.log('Missing token or id');
    return;
  }

  try {
    const response = await axios.post(
      LOGOUT_URL,
      JSON.stringify({ id: id }),
      {
        headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` },
      },
      );
      console.log(id);

    // Clear the authData from the local storage
    localStorage.removeItem('authData');
    console.log('Logged out successfully');
    window.location.reload();
  } catch (err) {
    console.log('Error:', err);
  }
};

// const handleLogout = (e) => {
//   e.preventDefault();

//   // Clear the authData from the local storage
//   localStorage.removeItem('authData');

//   console.log('Logged out successfully');

//   window.location.reload();
// };

const Home = () => {
  const authData = JSON.parse(localStorage.getItem('authData'));
  const isLoggedIn = !!authData?.token;

  return (
    <header>
      <h1>Welcome to My Website</h1>
      {isLoggedIn ? (
        <a onClick={handleLogout} href="/register" className="logout-button">Log out</a>
      ) : (
        <Link to="/login" className="logout-button">Log In/Register</Link>
      )}
    </header>
  );
};

export default Home;