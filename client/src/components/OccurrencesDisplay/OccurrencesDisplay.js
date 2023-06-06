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
                            <p>Hoário: {item.registered_at}</p>
                            <p>Local: {item.local}</p>
                            <p>Tipo: {item.occurrence_type}</p>
                            <p>KM: {item.km}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
    
}
{/* <div className="grid-item">
    <div className="grid-item-content">
        Text 1
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Texto
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Text 3
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Text 4
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Text 5
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Text 6
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Text 7
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Text 8
    </div>
</div>
<div className="grid-item">
    <div className="grid-item-content">
        Text 9
    </div>
</div> */}

export default OccurrencesDisplay