const express =  require('express');
const router =  express.Router();
const verifyJWT =  require('../middleware/verifyJWT');

const userController =  require('../controllers/userController');

router.post('/users', userController.handleNewUser);
router.post('/login', userController.handleLogin);
router.post('/logout',verifyJWT, userController.handleLogout);

router.get('/users/:userId',verifyJWT, userController.getUser);
router.put('/users/:userId',verifyJWT, userController.updateUser);
router.delete('/users/:userId',verifyJWT, userController.deleteUser);

module.exports = router;




