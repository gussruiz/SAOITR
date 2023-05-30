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

    const [pwd, setPwd] = useState('');
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password: pwd }), 
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ email, pwd, roles, accessToken });
            setEmail('');
            setPwd('');
            navigate(from, { replace: true });
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
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live='assertive'>
                {errMsg}
            </p>

            <form onSubmit={handleSubmit}>
            <h2>Sing In</h2>
                <label htmlFor='email'>E-mail:</label>
                <input
                    type='text'
                    id='email'
                    ref={emailRef}
                    autoComplete='off'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    />

                <button>Sing In</button>

                <p>
                    Need an Account? <br />
                    <span className='line'>
                        <a href='#'>Sing In</a>
                    </span>
                </p>
            </form>


        </section>
    )
}

export default Login;