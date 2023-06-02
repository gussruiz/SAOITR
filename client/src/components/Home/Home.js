import { Link } from "react-router-dom"
import './LinkPage.css'
import axios from 'axios';

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
    const response = await axios.post('/logout',
    { id: id},
    {
        headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}`},
    }
    );
    console.log(id)
} catch (err){
    console.log('erro', err);
}
};

const Home = () => {
    return (
        <section className="linkPage_main">
          <h1>You are logged in!</h1>
          <br />
          <p>
            <button onClick={handleLogout} href="/register">Fazer Logout</button>
          </p>
        </section>
      );
    };


export default Home