const express =  require('express');
const router =  express.Router();
const verifyJWT =  require('../middleware/verifyJWT');

const registerController =  require('../controllers/userController');
const logoutController =  require('../controllers/userController');
const authController =  require('../controllers/userController');

router.post('/users', registerController.handleNewUser);
router.post('/login', authController.handleLogin);
router.post('/logout', logoutController.handleLogout);

module.exports = router;




