const plantController = require('../controllers/plantController');
const gardenController = require('../controllers/gardenController');
const userController = require('../controllers/userController');
const restMiddleware = require('../middlewares/restMiddleware');
const levelMiddleware = require('../middlewares/levelMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require("express")
const router = express.Router();

router.post('/', 
    jwtMiddleware.verifyToken, 
    userController.checkUserById, 

    restMiddleware.calculateAwake, // 409
    levelMiddleware.getLevelData, 
    restMiddleware.getEnergy, 
    restMiddleware.calculateEnergyPlant, // 409

    gardenController.checkGardenExists, // 404
    gardenController.checkOwnership, // 403

    plantController.createPlant
);

router.get('/:plant_id', plantController.readSinglePlant)

router.put('/:plant_id', 
    jwtMiddleware.verifyToken, 
    userController.checkUserById, 

    plantController.updatePlant
);

router.put('/:plant_id/water', 
    jwtMiddleware.verifyToken, 
    userController.checkUserById, 
    
    restMiddleware.calculateAwake, 
    levelMiddleware.getLevelData, 
    restMiddleware.getEnergy, 
    restMiddleware.calculateEnergyPlant,
    
    plantController.waterPlant
);

module.exports = router;