import { Link } from "react-router-dom"
import './LinkPage.css'
import axios from 'axios';


const handleLogout = async (e) => {
    const id = parseInt(localStorage.getItem('id'));
    const token = localStorage.getItem('token')
    e.preventDefault();
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
}

const LinkPage = () => {
    return (
        <section className="linkPage_main">
            <h1>You are logged in!</h1>
            <br />
            <p>
                <button onClick={handleLogout} href="/register">Fazer Logout</button>
            </p>
        </section>
    )
}

export default LinkPage