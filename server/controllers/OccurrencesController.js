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
    res.status(201).json({message: "Occurrence register completed successfully"});
}

const updateOccurence = (req, res) => {
    const occurrence =  data.occurrences.find(oc => oc.id === parseInt(req.body.id));

    if(!occurrence) {
        return res.status(400).json({'message': `Occurrence ID: ${req.body.id} not found`});
    }

    if(req.body.registered_at) occurrence.registered_at =  req.body.registered_at;
    if(req.body.local) occurrence.local =  req.body.local;
    if(req.body.occurrence_type) occurrence.occurrence_type =  req.body.occurrence_type;
    if(req.body.km) occurrence.km =  req.body.km;

    const filteredArray =  data.occurrences.filter(oc => oc.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, occurrence];
    data.setOccurrences(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 :0));

    res.status(200).json({
        id: occurrence.id,
        registered_at: occurrence.registered_at, 
        local: occurrence.local, 
        occurrence_type: occurrence.occurrence_type, 
        km: occurrence.km, 
        user_id: occurrence.user_id
    });
}

const deleteOccurence = (req, res) => {
    const occurrence =  data.occurrences.find(oc => oc.id === parseInt(req.body.id));
    if(!occurrence) {
        return res.status(400).json({'message': `Occurrence ID: ${req.body.id} not found`});
    }
    const filteredArray =  data.occurrences.filter(oc => oc.id !== parseInt(req.body.id));
    data.setOccurrences([...filteredArray]);
    res.status(200).json({
        message: 'Occurrence deleted successfully'
    });
}

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
    deleteOccurence,
    getOccurence
}