import { useEffect, useRef, useState } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';

const USER_REGEX = /^.{2,10}$/i;
const PWD_REGEX = /^.{2,125}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]{2,125}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

const REGUISTER_URL = '/users/';

const Register = () => {
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);


	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [sucess, setSucess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		const result = USER_REGEX.test(user);
		setValidName(result);
	}, [user]);

	useEffect(() => {
		const result = EMAIL_REGEX.test(email);
		setValidEmail(result);
	}, [email]);

	useEffect(() => {
		const result = PWD_REGEX.test(pwd);
		setValidPwd(result);
		const match = pwd === matchPwd;
		setValidMatch(match)
	}, [pwd, matchPwd]);

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd, matchPwd]);


	const handleSubmit = async (e) => {
		e.preventDefault();
		//if button enabled woth js hack
		const v1 = USER_REGEX.test(user);
		const v2 = PWD_REGEX.test(pwd);
		const v3 = EMAIL_REGEX.test(email);

		if (!v1 || !v2 || !v3) {
			setErrMsg("Invalid Entry");
			return;
		}
		// console.log(user, pwd, email);
		// setSucess(true);
		try {
			const response = await axios.post(REGUISTER_URL, 
				JSON.stringify({ user, pwd, email }), 
				{
					headers: {'Content-Type': 'application/json'},
					withCredentials: true
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
				setErrMsg('Username Taken')
			} else {
				setErrMsg('Registration Failed');
			}
			errRef.current.focus();
		}
	}

	return (
		<>
			{sucess ? (
				<section>
					<h1>Sucsess!</h1>
					<p>
						<a href='#'>Sing In</a>
					</p>
				</section>
			) : (
				<section>
					<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</p>
					<h3>Welcome to</h3>
					<h1>SAOTIR - LOGO WIP</h1>
					<div>
						<h2>Register</h2>
						<form onSubmit={handleSubmit}>
							{/* input username */}
							<>
								<label htmlFor="username">
									Username:
									<span className={validName ? "valid" : "hide"}>
										<FontAwesomeIcon icon={faCheck} />
									</span>
									<span className={validName || !user ? "hide" : "invalid"}>
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
								/>

								<p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
									<FontAwesomeIcon icon={faInfoCircle} />
									2 to 10 characters.<br />
									Letters, numbers, underscores, hyphens allowed.
								</p>
							</>

							{/* input email */}
							<>
								<label htmlFor="email">
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
								/>

								<p id="eidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
									<FontAwesomeIcon icon={faInfoCircle} />
									2 to 125 characters.<br />
									Required @ and .com.
								</p>
							</>

							{/* input password */}
							<>
								<label htmlFor="password">
									Password:
									<span className={validPwd ? "valid" : "hide"}>
										<FontAwesomeIcon icon={faCheck} />
									</span>
									<span className={validPwd || !pwd ? "hide" : "invalid"}>
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
								/>

								<p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
									<FontAwesomeIcon icon={faInfoCircle} />
									2 to 125 characters.<br />
									Recomend to include uppercase and lowercase letters, a number and a special character.<br />
									Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
								</p>

							</>

							{/*input match password */}
							<>
								<label htmlFor="confirm_pwd">
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
									required
									aria-invalid={validMatch ? "false" : "true"}
									aria-describedby="confirmnote"
									onFocus={() => setMatchFocus(true)}
									onBlur={() => setMatchFocus(false)}
								/>

								<p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
									<FontAwesomeIcon icon={faInfoCircle} />
									Must macth the first password field<br />
								</p>
							</>

							<button disabled={!validName || !validPwd || !validMatch || !validEmail ? true : false}>
								Sign Up
							</button>

							<p>
								Already registerd? <br />
								<span className="Line">
									{/* put rourter link here*/}
									<a href="#">Sing In</a> {/*Placeholder link*/}
								</span>
							</p>
						</form>
					</div>
				</section>
			)}
		</>
	)
}

export default Register;