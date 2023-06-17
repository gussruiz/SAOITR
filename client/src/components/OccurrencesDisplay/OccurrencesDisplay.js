import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './OccurrencesDisplay.css';

import { faPenToSquare, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Modal = ({ isOpen, onClose, occurrence }) => {

    const [newLocation, setNewLocation] = useState('');
    const [newKm, setNewKm] = useState('');
    const [newRegisteredAt, setNewRegisteredAt] = useState('');
    const [newOccurrenceType, setNewOccurrenceType] = useState('');


    if (!isOpen) {
        return null;
    }

    const handleUpdateOccurrence = async (e) => {

        const authData = JSON.parse(localStorage.getItem('authData'));
        const userId = authData?.id;
        const token = authData?.token;

        e.preventDefault();
        const requestData = {
            local: newLocation === '' ? occurrence.local : newLocation,
            km: newKm === '' ? occurrence.km : newKm,
            registered_at: newRegisteredAt === '' ? occurrence.registered_at : newRegisteredAt,
            occurrence_type: newOccurrenceType === '' ? occurrence.occurrence_type : newOccurrenceType,
            user_id: occurrence.user_id
        };

        console.log(requestData);

        let occurrenceId = parseInt(occurrence.id);
        try {
            const response = await axios.put(`/occurrences/${occurrenceId}`,
                JSON.stringify(requestData),
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            window.location.reload();
        } catch (error) {
            console.log(error)
        }


    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}><FontAwesomeIcon icon={faX} /></span>

                <form onSubmit={handleUpdateOccurrence} className='updateForm'>
                    <div className='UpdateForm-conatiner_input'>
                        <label htmlFor="local" className='updateForm-label'>
                            Location:
                        </label>
                        <input
                            className='updateForm-input'
                            id='local'
                            type='text'
                            onChange={(e) => setNewLocation(e.target.value)}
                            placeholder={occurrence.local}
                        />
                    </div>
                    <div className='UpdateForm-conatiner_input'>
                        <label htmlFor="km" className='updateForm-label'>
                            KM:
                        </label>
                        <input
                            className='updateForm-input'
                            id='local'
                            type='text'
                            onChange={(e) => setNewKm(e.target.value)}
                            placeholder={occurrence.km}
                        />
                    </div>
                    <div className='UpdateForm-conatiner_input'>
                        <label htmlFor="time" className='updateForm-label'>
                            Time:
                        </label>
                        <input
                            className="updateForm-input"
                            id="time"
                            type="datetime-local"
                            step={2}
                            onChange={(e) => setNewRegisteredAt(e.target.value)}
                            placeholder="Enter the date please"
                        />
                    </div>
                    <div className='UpdateForm-conatiner_input'>
                        <label htmlFor="option" className='updateForm-label'>
                            Option:
                        </label>
                        <select
                            className='updateForm-input'
                            id='option'
                            onChange={(e) => setNewOccurrenceType(e.target.value)}
                        >
                            <option className='updateForm-option' value='0'>
                                Select an option
                            </option>
                            <option className='updateForm-option' value='1'>
                                Atropelamento
                            </option>
                            <option className='updateForm-option' value='2'>
                                Deslizamento
                            </option>
                            <option className='updateForm-option' value='3'>
                                Colisão frontal
                            </option>
                            <option className='updateForm-option' value='4'>
                                Capotagem
                            </option>
                            <option className='updateForm-option' value='5'>
                                Saída de pista
                            </option>
                            <option className='updateForm-option' value='6'>
                                Batida em objeto fixo
                            </option>
                            <option className='updateForm-option' value='7'>
                                Veículo avariado
                            </option>
                            <option className='updateForm-option' value='8'>
                                Colisão com motocicletas
                            </option>
                            <option className='updateForm-option' value='9'>
                                Colisão no mesmo sentido ou transversal
                            </option>
                            <option className='updateForm-option' value='10'>
                                Construção
                            </option>
                        </select>
                    </div>

                    <button className='updateForm-button' type='submit'>
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

const OccurrencesDisplay = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    const user_id = authData?.id;
    const token = authData?.token;
    const isLoggedIn = !!authData?.token;

    const [sliderValue, setSliderValue] = useState(false);

    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/occurrences');
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteOcccurrence =  async (e, id, ocUserID) => {
        e.preventDefault();
        console.log(id);
        let OccurrenceId = parseInt(id);
        console.log('Local Storage '+ user_id);
        console.log('Param from function '+ ocUserID)

        try {
            const response = await axios.delete(`/occurrences/${OccurrenceId}`,
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            // window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    const filteredData = sliderValue ? data.filter(item => item.user_id === user_id) : data;


    return (
        <>
            {isLoggedIn ? (<>
                <div className='sliderContainer'>
                    <label className="switch">
                        <input type="checkbox" onChange={() => setSliderValue(!sliderValue)} /> {/* Update the slider value */}
                        <span className="slider">
                            <span className="slider-label slider-label-right">All</span>
                            <span className="slider-label slider-label-left">Yours</span>
                        </span>
                    </label>
                </div>
            </>
            ) : (<></>)}

            <div className="grid-container">
                {filteredData.map((item) => (
                    <div key={item.id} className="grid-item">
                        <div className="grid-item-content">
                            <p>Horário: {new Date(item.registered_at).toLocaleString('pt-BR', { timeZone: 'UTC' })}</p>
                            <p>Local: {item.local}</p>
                            {item.occurrence_type === 1 && <p>Tipo: Atropelamento</p>}
                            {item.occurrence_type === 2 && <p>Tipo: Deslizamento</p>}
                            {item.occurrence_type === 3 && <p>Tipo: Colisão frontal</p>}
                            {item.occurrence_type === 4 && <p>Tipo: Capotagem</p>}
                            {item.occurrence_type === 5 && <p>Tipo: Saída de pista</p>}
                            {item.occurrence_type === 6 && <p>Tipo: Batida em objeto fixo</p>}
                            {item.occurrence_type === 7 && <p>Tipo: Veículo avariado</p>}
                            {item.occurrence_type === 8 && <p>Tipo: Colisão com motocicletas</p>}
                            {item.occurrence_type === 9 && <p>Tipo: Colisão no mesmo sentido ou transversal</p>}
                            {item.occurrence_type === 10 && <p>Tipo: Construção</p>}
                            <p>KM: {item.km}</p>
                        </div>

                        {item.user_id === user_id &&
                            <div className='buttons-container'>
                                <button className='buttons' onClick={() => openModal(item)}>
                                    <FontAwesomeIcon size='lg' icon={faPenToSquare} />
                                </button>
                                <button className='buttons' onClick={(e) => handleDeleteOcccurrence(e, item.id, item.user_id)}>
                                    <FontAwesomeIcon size='lg' icon={faTrash} />
                                </button>
                            </div>
                        }
                    </div>
                ))}
            </div>

            {selectedItem && (
                <Modal isOpen={isModalOpen} occurrence={selectedItem} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
}

export default OccurrencesDisplay;
