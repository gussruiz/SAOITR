
import React, { useState } from 'react';
import './OccurrencesForm.css';
import axios from '../../api/axios';

const OccurrencesForm = () => {
    const [km, setKm] = useState('');
    const [location, setLocation] = useState('');
    const [occurrenceType, setOccurrenceType] = useState('');

    const getCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleNewOccurrence = async (e) => {
        e.preventDefault();
    
        const currentTime = getCurrentTime();
        const authData = JSON.parse(localStorage.getItem('authData'));
        const user_id = authData?.id;
    
        console.log(currentTime, location, occurrenceType, km, user_id);
    
        try {
            const token = authData?.token;
            const response = await axios.post('/occurrences',
                {
                    registered_at: currentTime,
                    local: location,
                    occurrence_type: occurrenceType,
                    km: km,
                    user_id: user_id
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                }
            );
    
            setKm('');
            setLocation('');
            setOccurrenceType('');
        } catch (err) {
            console.log(err);
        }
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
                        id='name'
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
                        id='phone'
                        onChange={(e) => setKm(e.target.value)}
                        placeholder='Kilometer'
                        value={km}
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