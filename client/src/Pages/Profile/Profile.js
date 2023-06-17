import { useEffect, useRef, useState } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import { Link } from "react-router-dom";
import md5 from 'md5';
import Header from '../../components/Header/Header';
import './Profile.css';
 
const USER_REGEX = /^.{2,10}$/i;
const PWD_REGEX = /^.{2,125}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]{2,125}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
 
const Profile = () => {
 
    const [data, setData] = useState([]);
 
    useEffect(() => {
        fetchData();
    }, []);
 
    const fetchData = async () => {
        const authData = JSON.parse(localStorage.getItem('authData'));
        const userId = authData?.id;
        const token = authData?.token;
 
        console.log(userId)
 
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
 
    //-------------------------------------------------------------------------------------------------------------
 
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
 
 
    const handleUpdate = async (e) => {
 
        const authData = JSON.parse(localStorage.getItem('authData'));
        const userId = authData?.id;
        const token = authData?.token;
 
        e.preventDefault();
 
        // if button enabled woth js hack
        const v1 = USER_REGEX.test(name);
        const v2 = PWD_REGEX.test(password);
        const v3 = EMAIL_REGEX.test(email);
 
        // if (!v1 || !v3) {
        //     setErrMsg("Invalid Entry");
        //     return;
        // }
 
        try {
            const requestData = {
                name: name === '' ? data.name : name,
                email: email === '' ? data.email : email,
                password: password === '' ? null : md5(password)
            };
 
            console.log(requestData);
 
            const response = await axios.put(`/users/${userId}`,
                JSON.stringify(requestData),
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            // clear input fields
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
 
    return (
        <>
            <Header />
            <>
                    <>
                        <section>
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</p>
                            <form className="formProfile" onSubmit={handleUpdate}>
                                <h3>{data.name}</h3>
                                <h3>{data.email}</h3>
                                <>
                                    {/* input username */}
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
                                        placeholder="Name"
                                        className="inputProfile"
                                        // value={data.name}
                                    />
 
                                    <p id="uidnote" className={userFocus && name && !validName ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        2 to 10 characters.<br />
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>
                                </>
 
                                {/* input email */}
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
                                        placeholder="E-mail"
                                        className="inputProfile"
                                        // value={data.email}
                                    />
 
                                    <p id="eidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        2 to 125 characters.<br />
                                        Required @ and .com.
                                    </p>
                                </>
 
                                {/* input password */}
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
                                </>
                            </form>
                        </section>
                    </>
            </>
        </>
    );
 
}
 
export default Profile
