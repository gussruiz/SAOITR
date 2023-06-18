const data = {
    occurrences: require('../model/occurrences.json'),
    setOccurrences: function (data) {this.occurrences  = data} 
};

const fsPromises = require('fs').promises;
const path = require('path');

const getAllOccurences = (req, res) => {
    res.json(data.occurrences);
}

const createNewOccurence = async (req, res) => {

    const {registered_at, local, occurrence_type, km, user_id} = req.body;
    if(!registered_at || !local || !occurrence_type || !km || !user_id) return res.status(400).json({'message': 'Missing Info'});

    const id = data.occurrences[data.occurrences.length - 1].id + 1 || 1;

    const newOccurence = {
        id: id,
        registered_at: registered_at, 
        local: local, 
        occurrence_type: occurrence_type, 
        km: km, 
        user_id: user_id
    }

    console.log('New Occurrence created')
    console.log(newOccurence)
    
    data.setOccurrences([...data.occurrences, newOccurence]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'occurrences.json'),
        JSON.stringify(data.occurrences)
    );
    res.status(201).json({
        id: id,
        registered_at: registered_at, 
        local: local, 
        occurrence_type: occurrence_type, 
        km: km, 
        user_id: user_id 
    });
}

const updateOccurence = async (req, res) => {
    let ocId = req.params.occurrenceId
    ocId = parseInt(ocId) 
    const occurrence =  data.occurrences.find(oc => oc.id === ocId);
    if(!occurrence) {
        return res.status(400).json({'message': `Occurrence ID: ${req.body.id} not found`});
    }

    occurrence.registered_at =  req.body.registered_at;
    occurrence.local =  req.body.local;
    occurrence.occurrence_type =  req.body.occurrence_type;
    occurrence.km =  req.body.km;
    occurrence.user_id =  req.body.user_id;

    const filteredArray =  data.occurrences.filter(oc => oc.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray];
    data.setOccurrences(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 :0));

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'occurrences.json'),
        JSON.stringify(data.occurrences)
    );

    res.status(200).json({
        id: occurrence.id,
        registered_at: occurrence.registered_at, 
        local: occurrence.local, 
        occurrence_type: occurrence.occurrence_type, 
        km: occurrence.km, 
        user_id: occurrence.user_id
    });
}

const deleteOccurrence = async (req, res) => {
    const ocId = parseInt(req.params.occurrenceId);
    const occurrence = data.occurrences.find((oc) => oc.id === ocId);
  
    if (!occurrence) {
      return res.status(400).json({ message: `Occurrence ID: ${ocId} not found` });
    }
  
    const filteredArray = data.occurrences.filter((oc) => oc.id !== ocId);
    data.setOccurrences(filteredArray);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'occurrences.json'),
        JSON.stringify(data.occurrences)
    );
  
    console.log(`Occurrence ${ocId} deleted`);
    
    res.status(200).json({ message: 'Occurrence deleted successfully' });
  };

const getOccurence = (req, res) => {
    const occurrence =  data.occurrences.find(oc => oc.id === parseInt(req.body.id));
    if(!occurrence) {
        return res.status(400).json({'message': `Occurrence ID: ${req.body.id} not found`});
    }
    res.json(occurrence);
}

module.exports = {
    getAllOccurences, 
    createNewOccurence,
    updateOccurence,
    deleteOccurrence,
    getOccurence
}