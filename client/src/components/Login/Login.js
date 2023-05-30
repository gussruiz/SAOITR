import { useState, useRef, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import './Login.css'


const LOGIN_URL = '/login'

const Login = () => {

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password }), 
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log(JSON.stringify(response?.data));
            const token = response?.data?.tToken;
            setAuth({ email, password, token });
            setEmail('');
            setPassword('');
            navigate('/', { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (!err?.response?.status === 400) {
                setErrMsg('Missing email or password');
            } else if (!err?.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('LogIn failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <div className="backgroundLogin">
                <div className="shapeLogin"></div>
                <div className="shapeLogin"></div>
            </div>
            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live='assertive'>
                {errMsg}
            </p>

            <form onSubmit={handleSubmit} className='formLogin'>
            <h3>Sing In</h3>
                <label htmlFor='email' className='labelLogin'>E-mail:</label>
                <input
                    type='text'
                    id='email'
                    ref={emailRef}
                    autoComplete='off'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    placeholder='E-mail'
                    className='inputLogin'
                />

                <label htmlFor='password' className='labelLogin'>Password:</label>
                <input
                    type='password'
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    placeholder='Password'
                    className='inputLogin'
                />

                <button className='buttonLogin'>Sing In</button>

                <p>
                    Need an Account? <br />
                    <span className='line'>
                        <Link to="/register">Sing Up</Link>
                    </span>
                </p>
            </form>


        </section>
    )
}

export default Login;