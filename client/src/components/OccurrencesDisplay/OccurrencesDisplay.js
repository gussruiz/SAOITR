import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './OccurrencesDisplay.css';

import { faPenToSquare, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Modal = ({ isOpen, onClose, occurrence }) => {

    const [newKm, setNewKm] = useState('');

    const [newLocation, setNewLocation] = useState('');

    const [newRegisteredAt, setNewRegisteredAt] = useState('');

    const [newOccurrenceType, setNewOccurrenceType] = useState('');


    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}><FontAwesomeIcon icon={faX} /></span>

                <form>
                    <label htmlFor="local">
                        Local:
                    </label>
                    <input
                        id='local'
                        type='text'
                        placeholder={occurrence.local}
                    />
                    <br />
                    <br />
                    <label htmlFor="km">
                        KM:
                    </label>
                    <input
                        id='local'
                        type='text'
                        placeholder={occurrence.km}
                    />
                    <br />
                    <br />
                    <label htmlFor="time">
                        Time:
                    </label>
                    <input
                        id='time'
                        type='datetime-local'
                        placeholder={occurrence.registered_at.toLocaleString()}
                    />
                    <br />
                    <br />
                    <select
                        id='option'
                    >
                        <option value='0'>
                            Select an option
                        </option>
                        <option value='1'>
                            Atropelamento
                        </option>
                        <option value='2'>
                            Deslizamento
                        </option>
                        <option value='3'>
                            Colisão frontal
                        </option>
                        <option value='4'>
                            Capotagem
                        </option>
                        <option value='5'>
                            Saída de pista
                        </option>
                        <option value='6'>
                            Batida em objeto fixo
                        </option>
                        <option value='7'>
                            Veículo avariado
                        </option>
                        <option value='8'>
                            Colisão com motocicletas
                        </option>
                        <option value='9'>
                            Colisão no mesmo sentido ou transversal
                        </option>
                        <option value='10'>
                            Construção
                        </option>
                    </select>
                </form>
            </div>
        </div>
    );
};

const OccurrencesDisplay = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    const user_id = authData?.id;

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
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="grid-container">
                {data.map((item) => (
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
                                <button className='buttons'>
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
