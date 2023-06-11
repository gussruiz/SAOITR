import {useEffect, useState} from 'react';
import axios from '../../api/axios';
import './OccurrencesDisplay.css';

const OccurrencesDisplay = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);
      
    const fetchData = async () => {
        try {
            const response = await axios.get('/occurrences');
            setData(response.data);
            console.log(data)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="grid-container">
                {data.map((item) => (
                    <div key={item.id} className="grid-item">
                        <div className="grid-item-content">
                            <p>Hoário: {new Date(item.registered_at).toLocaleString('pt-BR')}</p>
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
                    </div>
                ))}
            </div>
        </>
    );
    
}

export default OccurrencesDisplay