import { Link } from "react-router-dom";
import './Header.css';
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

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




const Header = () => {

  const handleTitleClick = () => {
    navigate('/', { replace: true });
  };

  const authData = JSON.parse(localStorage.getItem('authData'));
  const isLoggedIn = !!authData?.token;
  const navigate = useNavigate();


  return (
    <header>
      <h1 onClick={handleTitleClick} >SAOTIR</h1>
      {isLoggedIn ? (
        <>
          <Link onClick={handleLogout} to="/logout" className="home-button"> Log Out</Link>
          <Link to="/profile" className="home-button">Profile</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="home-button">Log In</Link>
          <Link to="/register" className="home-button">Register</Link>
        </>
      )}
    </header>
  );
};

export default Header;