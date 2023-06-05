const data = {
    occurrences: require('../model/occurrences.json'),
    setOccurrences: function (data) {this.occurrences  = data} 
};

const getAllOccurences = (req, res) => {
    res.json(data.occurrences);
}

const createNewOccurence = (req, res) => {

    const {registered_at, local, occurrence_type, km, user_id} = req.body;
    const id = data.occurrences[data.occurrences.length - 1].id + 1 || 1;

    const newOccurence = {
        id: id,
        registered_at: registered_at, 
        local: local, 
        occurrence_type: occurrence_type, 
        km: km, 
        user_id: user_id
    }
    
    data.setOccurrences([...data.occurrences, newOccurence]);
    res.status(201).json(data.occurrences);
}

const updateOccurence = (req, res) => {
    const occurrence =  data.occurrences.find(oc => oc.id === parseInt(req.body.id));

    if(!occurrence) {
        return res.status(400).json({'message': `Occurrence ID: ${req.body.id} not found`});
    }

    if(req.body.registered_at) employee.registered_at =  req.body.registered_at;
    if(req.body.local) employee.local =  req.body.local;
    if(req.body.occurrence_type) employee.occurrence_type =  req.body.occurrence_type;
    if(req.body.km) employee.km =  req.body.km;

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
        message: 'Occurrence deleted successfuly'
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