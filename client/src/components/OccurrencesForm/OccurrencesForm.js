
import React, { useState } from 'react';
import './OccurrencesForm.css';
import axios from '../../api/axios';

const OccurrencesForm = () => {
    const [km, setKm] = useState('');
    const [location, setLocation] = useState('');
    const [occurrenceType, setOccurrenceType] = useState('');
    const [registerdAt, setRegisterdAt] = useState('');


    const handleNewOccurrence = async (e) => {
        e.preventDefault();
    
        const authData = JSON.parse(localStorage.getItem('authData'));
        const user_id = authData?.id;
    
        console.log(registerdAt, location, occurrenceType, km, user_id);
    
        try {
            const token = authData?.token;
    
            // Check the time before sending the request
            if (!checkDateTime(registerdAt)) {
                console.log('Invalid time');
                return;
            }
    
            const response = await axios.post('/occurrences', {
                registered_at: registerdAt,
                local: location,
                occurrence_type: parseInt(occurrenceType),
                km: parseInt(km),
                user_id: user_id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }
            });
    
            setKm('');
            setLocation('');
            setOccurrenceType('');
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    
    function checkDateTime(dateTime) {
        const selectedDateTime = new Date(dateTime);
        const currentDateTime = new Date();
        return selectedDateTime <= currentDateTime;
    }

    return (
        <div className='OccurrencesForm-conatiner'>
            <form onSubmit={handleNewOccurrence} className='OccurrencesForm-form'>
                <div className='OccurrencesForm-conatiner_input'>
                    <label className='OccurrencesForm-label' htmlFor='name'>
                        Local
                    </label>
                    <input
                        className='OccurrencesForm-input'
                        type='text'
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder='Street/Lane'
                        value={location}
                    />
                </div>

                <div className='OccurrencesForm-conatiner_input'>
                    <label className='OccurrencesForm-label' htmlFor='phone'>
                        KM
                    </label>
                    <input
                        className='OccurrencesForm-input'
                        type='text'
                        pattern="^[0-9]{1,4}$"
                        onChange={(e) => setKm(e.target.value)}
                        placeholder='Please enter a value up to 9999Km'
                        value={km}
                    />
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