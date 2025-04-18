const userController = require('../controllers/userController');
const challengeController = require('../controllers/challengeController');
const restMiddleware = require('../middlewares/restMiddleware');
const levelMiddleware = require('../middlewares/levelMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require("express")
const router = express.Router();

router.get('/', userController.readAllUser);
router.post('/', userController.checkUserByUsername, userController.createNewUser);

// Read through ALL challenges with relation to userid (check ownership)
router.get('/challenges', jwtMiddleware.verifyToken, userController.checkUserById, challengeController.readAllChallenge);

router.get('/singleUser', jwtMiddleware.verifyToken, userController.readUserById);
router.put('/singleUser', jwtMiddleware.verifyToken, userController.checkUserById, userController.checkUserByUsername, userController.updateUserById);

router.post('/singleUser/rest', 
    jwtMiddleware.verifyToken,
    userController.checkUserById, 

    restMiddleware.checkResting, 
    restMiddleware.checkMaxEnergy, 
    levelMiddleware.getLevelData, 

    restMiddleware.deleteRest, 
    userController.createRest
);
router.get('/singleUser/challenges', jwtMiddleware.verifyToken, userController.checkUserById, userController.readChallengesByUserid)

router.get('/singleUser/rest', jwtMiddleware.verifyToken, userController.checkUserById, restMiddleware.checkResting, restMiddleware.checkMaxEnergy, userController.readRestByUserid);

router.get('/singleUser/gardens', jwtMiddleware.verifyToken, userController.checkUserById, userController.readGardenByUserid);

router.get('/singleUser/completions', jwtMiddleware.verifyToken, userController.checkUserById, userController.readCompletionByUserid)

module.exports = router;