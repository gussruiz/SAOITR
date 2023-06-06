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

	const [errMsg, setErrMsg] = useState('');
	const [sucess, setSucess] = useState(false);

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
		setErrMsg('');
	}, [name, password]);


	const handleUpdate = async (e) => {
		e.preventDefault();
		//if button enabled woth js hack
		const v1 = USER_REGEX.test(name);
		const v2 = PWD_REGEX.test(password);
		const v3 = EMAIL_REGEX.test(email);

		if (!v1 || !v2 || !v3) {
			setErrMsg("Invalid Entry");
			return;
		}
		// console.log(user, pwd, email);
		// setSucess(true);
		try {
			const response = await axios.post('',
				JSON.stringify({name, email, password: md5(password) }),
				{
					headers: { 'Content-Type': 'application/json' },
					
				}
			);
			console.log(response.data);
			console.log(response.accessToken);
			console.log(JSON.stringify(response));
			setSucess(true);
			//clear input fields 
		} catch (err) {
			if(!err?.response) {
				setErrMsg('No server response');
			} else if(err.response?.status === 409) {
				setErrMsg('E-mail Taken')
			} else {
				setErrMsg('Registration Failed');
			}
			errRef.current.focus();
		}
	}

    return (
        <>
            <Header/>
            <>
                {sucess ? (
                    <>
                        <div className="backgroundProfile">
                            <div className="shapeProfile"></div>
                            <div className="shapeProfile"></div>
                        </div>
                        <section className="successMsg">
                            <h1 className="successMsg_title" >Welcome to Saotir</h1>
                            <Link className="successMsg_link" to="/login">Sing In</Link>
                        </section>
                    </>
                ) : (
                    <>
                        <section>
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</p>
                                <form className="formProfile" onSubmit={handleUpdate}>
                                    <h3>Sing Up</h3>	
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
                                            required
                                            aria-invalid={validName ? "false" : "true"}
                                            aria-describedby="uidnote"
                                            onFocus={() => setUserFocus(true)}
                                            onBlur={() => setUserFocus(false)}
                                            placeholder="Name"
                                            className="inputProfile"
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
                                            required
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="eidnote"
                                            onFocus={() => setEmailFocus(true)}
                                            onBlur={() => setEmailFocus(false)}
                                            placeholder="E-mail"
                                            className="inputProfile"
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
                                            required
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
                                        
                                        <button disabled={!validName || !validPwd || !validEmail ? true : false} className="buttonProfile">
                                            Update
                                        </button>
                                    </>
                                </form>
                        </section>	
                    </>
                )}
            </>
        </>
    );

}

export default Profile