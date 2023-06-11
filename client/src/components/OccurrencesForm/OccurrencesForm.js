import { useEffect, useRef, useState } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './OccurrencesForm.css';
import axios from '../../api/axios';
import dayJS from 'dayjs';

const KM_REGEX = /^[0-9]{1,4}$/;
const LOCAL_REGEX = /^.{1,125}$/;

const OccurrencesForm = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [km, setKm] = useState('');
    const [validKm, setValidKm] = useState(false);
    const [kmFocus, setKmFocus] = useState(false);

    const [location, setLocation] = useState('');
    const [validLocation, setValidLocation] = useState(false);
    const [locationFocus, setLocationFocus] = useState(false);

    const [registerdAt, setRegisterdAt] = useState('');

    const [occurrenceType, setOccurrenceType] = useState('');

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = KM_REGEX.test(km);
        setValidKm(result);
    }, [km]);

    useEffect(() => {
        const result = LOCAL_REGEX.test(location);
        setValidLocation(result);
    }, [location]);

    useEffect(() => {
        setErrMsg('');
    }, [km, location]);


    const handleNewOccurrence = async (e) => {
        e.preventDefault();

        const date = new Date(registerdAt);
        const isoDate = date.toISOString();
        console.log(isoDate);

        const authData = JSON.parse(localStorage.getItem('authData'));
        const user_id = authData?.id;

        // console.log(registerdAt, location, occurrenceType, km, user_id);

        try {
            const token = authData?.token;

            // Check the time before sending the request
            if (!checkDateTime(registerdAt)) {
                console.log('Invalid time');
                return;
            }

            const response = await axios.post('/occurrences', {
                registered_at: isoDate,
                local: location,
                occurrence_type: parseInt(occurrenceType),
                km: parseInt(km),
                user_id: parseInt(user_id)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }
            });

            setKm('');
            setLocation('');
            setOccurrenceType('');
            // window.location.reload();
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

    function checkDateTime(dateTime) {
        const selectedDateTime = new Date(dateTime);
        const currentDateTime = new Date();
        return selectedDateTime <= currentDateTime;
    }

    return (
        <div className='OccurrencesForm-conatiner'>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</p>
            <form onSubmit={handleNewOccurrence} className='OccurrencesForm-form'>
                <div className='OccurrencesForm-conatiner_input'>
                    <label className='OccurrencesForm-label' htmlFor='name'>
                        Local
                        <span className={validLocation ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validLocation || !location ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        className='OccurrencesForm-input'
                        type='text'
                        ref={userRef}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        aria-invalid={validLocation ? "false" : "true"}
                        onFocus={() => setLocationFocus(true)}
                        onBlur={() => setLocationFocus(false)}
                        placeholder='Street/Lane'
                        value={location}
                    />
                    <p id="uidnote" className={locationFocus && location && !validLocation ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        1 to 125 characters.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>
                </div>

                <div className='OccurrencesForm-conatiner_input'>
                    <label className='OccurrencesForm-label' htmlFor='phone'>
                        KM:
                        <span className={validKm ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validKm || !km ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        className='OccurrencesForm-input'
                        type='text'
                        ref={userRef}
                        onChange={(e) => setKm(e.target.value)}
                        required
                        aria-invalid={validKm ? "false" : "true"}
                        onFocus={() => setKmFocus(true)}
                        onBlur={() => setKmFocus(false)}
                        placeholder='Please enter a value up to 9999Km'
                        value={km}
                    />
                    <p id="eidnote" className={kmFocus && km && !validKm ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Allowed Km 1 to Km 9999.<br />
                    </p>
                </div>

                <div className='OccurrencesForm-conatiner_input'>
                    <label className='OccurrencesForm-label' htmlFor='phone'>
                        Time
                    </label>
                    <input
                        className='OccurrencesForm-input'
                        type="datetime-local"
                        onChange={(e) => setRegisterdAt(e.target.value)}
                        placeholder='Time'
                        value={registerdAt}
                    />
                </div>

                <div className='OccurrencesForm-conatiner_input'>
                    <label className='OccurrencesForm-label' htmlFor='option'>
                        Option:
                    </label>

                    <select
                        className='OccurrencesForm-input OccurrencesForm-label'
                        onChange={(e) => setOccurrenceType(e.target.value)}
                        id='option'
                        value={occurrenceType}
                    >
                        <option className='OccurrencesForm-option' value='0'>
                            Select an option
                        </option>
                        <option className='OccurrencesForm-option' value='1'>
                            Atropelamento
                        </option>
                        <option className='OccurrencesForm-option' value='2'>
                            Deslizamento
                        </option>
                        <option className='OccurrencesForm-option' value='3'>
                            Colisão frontal
                        </option>
                        <option className='OccurrencesForm-option' value='4'>
                            Capotagem
                        </option>
                        <option className='OccurrencesForm-option' value='5'>
                            Saída de pista
                        </option>
                        <option className='OccurrencesForm-option' value='6'>
                            Batida em objeto fixo
                        </option>
                        <option className='OccurrencesForm-option' value='7'>
                            Veículo avariado
                        </option>
                        <option className='OccurrencesForm-option' value='8'>
                            Colisão com motocicletas
                        </option>
                        <option className='OccurrencesForm-option' value='9'>
                            Colisão no mesmo sentido ou transversal
                        </option>
                        <option className='OccurrencesForm-option' value='10'>
                            Construção
                        </option>
                    </select>
                </div>
                <button className='OccurrencesForm-button' type='submit'>
                    Submit
                </button>
            </form>
        </div>
    );
}



export default OccurrencesForm;