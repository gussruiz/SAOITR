import { useEffect, useRef, useState } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import md5 from 'md5';
import Header from '../../components/Header/Header';
import './Profile.css';

const USER_REGEX = /^.{2,10}$/i;
const PWD_REGEX = /^.{2,125}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]{2,125}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

const Profile = () => {

    const [data, setData] = useState([]);

    const userRef = useRef();
    const errRef = useRef();

    const [name, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);


    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(name);
        setValidName(result);
    }, [name]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
        const match = password === matchPwd;
        setValidMatch(match)
    }, [password, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [name, password, matchPwd]);

    const fetchData = async () => {
        const authData = JSON.parse(localStorage.getItem('authData'));
        const userId = authData?.id;
        const token = authData?.token;

        try {
            const response = await axios.get(`/users/${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const authData = JSON.parse(localStorage.getItem('authData'));
        const userId = authData?.id;
        const token = authData?.token;

        try {
            const requestData = {
                name: name === '' ? data.name : name,
                email: email === '' ? data.email : email,
                password: password === '' ? null : md5(password)
            };

            const response = await axios.put(`/users/${userId}`,
                JSON.stringify(requestData),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            window.location.reload();
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 409) {
                setErrMsg('E-mail Taken')
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    }

    const handleDelete =  async (e) => {
        const authData = JSON.parse(localStorage.getItem('authData'));
        const userId = authData?.id;
        const token = authData?.token;

        e.preventDefault();
        try {
            const response = await axios.delete(`/users/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        );
        localStorage.removeItem('authData');
        } catch (error) {
            
        }
        
        console.log('Deletado com sucesso');
    }

    return (
        <>
            <Header />
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</p>
            <form className="formProfile" onSubmit={handleUpdate}>
                <h3>{data.name}</h3>
                <>
                    <label htmlFor="username" className="labelProfile">
                        Username:
                        <span className={validName ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validName || !name ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>

                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                        placeholder={data.name}
                        className="inputProfile"
                    />

                    <p id="uidnote" className={userFocus && name && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        2 to 10 characters.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>
                </>

                <>
                    <label htmlFor="email" className="labelProfile">
                        E-mail:
                        <span className={validEmail ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validEmail || !email ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>

                    <input
                        type="email"
                        id="email"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={validEmail ? "false" : "true"}
                        aria-describedby="eidnote"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        placeholder={data.email}
                        className="inputProfile"
                    />

                    <p id="eidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        2 to 125 characters.<br />
                        Required @ and .com.
                    </p>
                </>

                <>
                    <label htmlFor="password" className="labelProfile">
                        Password:
                        <span className={validPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validPwd || !password ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>

                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        placeholder="Password"
                        className="inputProfile"
                    />

                    <p id="pwdnote" className={pwdFocus && password && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        2 to 125 characters.<br />
                        Recomend to include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>

                    <label htmlFor="confirm_pwd" className="labelRegister">
                        Confirm Password:
                        <span className={validMatch && matchPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>

                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        placeholder="Confirm your password"
                        className="inputRegister"
                    />

                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must macth the first password field<br />
                    </p>

                    <button className="buttonProfile">
                        Update
                    </button>

                    <button onClick={(e) => { e.preventDefault(); handleDelete(e)}} className="buttonDeleteProfile">
                        Delete
                    </button>
                </>
            </form>
        </>
    );

}

export default Profile
