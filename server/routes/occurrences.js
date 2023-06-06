const express =  require('express');
const router =  express.Router();
const verifyJWT =  require('../middleware/verifyJWT');

const OccurrencesController =  require('../controllers/OccurrencesController');

router.get('/occurrences', OccurrencesController.getAllOccurences);
router.post('/occurrences', verifyJWT, OccurrencesController.createNewOccurence);
router.get('/occurrences/:occurrenceId', verifyJWT, OccurrencesController.getOccurence);
router.put('/occurrences/:occurrenceId', verifyJWT, OccurrencesController.updateOccurence);
router.delete('/occurrences/:occurrenceId', verifyJWT, OccurrencesController.deleteOccurence);


module.exports = router;