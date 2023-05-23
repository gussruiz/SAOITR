import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';

const LOGIN_URL = '/auth'

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
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
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
            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live='assertive'>
                {errMsg}
            </p>

            <h1>Sing In</h1>

            <form onSubmit={handleSubmit}>
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
            </form>

            <p>
                Need an Account? <br />
                <span className='line'>
                    {/* put router link here */}
                    <a href='#'>Sing In</a>
                </span>
            </p>

        </section>
    )
}

export default Login;