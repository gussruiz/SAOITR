const express =  require('express');
const router =  express.Router();
const verifyJWT =  require('../middleware/verifyJWT');

const userController =  require('../controllers/userController');

router.post('/users', userController.handleNewUser);
router.post('/login', userController.handleLogin);
router.post('/logout',verifyJWT, userController.handleLogout);

module.exports = router;




