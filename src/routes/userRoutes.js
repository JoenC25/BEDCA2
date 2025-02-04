const userController = require('../controllers/userController');
const restMiddleware = require('../middlewares/restMiddleware');
const levelMiddleware = require('../middlewares/levelMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


const express = require("express")
const router = express.Router();

router.get('/', userController.readAllUser);
router.post('/', userController.checkUserByUsername, userController.createNewUser);

router.get('/singleUser', jwtMiddleware.verifyToken, userController.readUserById);
router.put('/singleUser', jwtMiddleware.verifyToken, userController.checkUserById, userController.checkUserByUsername, userController.updateUserById);

router.post('/singleUser/rest', 
    jwtMiddleware.verifyToken,
    userController.checkUserById, 
    restMiddleware.calculateAwake, 
    restMiddleware.checkMaxEnergy, 
    restMiddleware.deleteRest, 
    levelMiddleware.getLevelData, 
    userController.createRest
);
router.get('/singleUser/rest', jwtMiddleware.verifyToken, userController.checkUserById, userController.readRestByUserId);

router.get('/singleUser/gardens', jwtMiddleware.verifyToken, userController.checkUserById, userController.getGardenByUserid);

module.exports = router;