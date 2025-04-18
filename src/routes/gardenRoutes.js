const gardenController = require('../controllers/gardenController');
const plantController = require('../controllers/plantController');
const userController = require('../controllers/userController');
const levelMiddleware = require('../middlewares/levelMiddleware');
const restMiddleware = require('../middlewares/restMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require("express")
const router = express.Router();


router.post('/', jwtMiddleware.verifyToken, userController.checkUserById, gardenController.createGarden);
router.get('/', gardenController.getAllGardens);

// Read garden info
router.get('/:garden_id', gardenController.getGardenById);

// Read garden info with relation to userid (check ownership)
router.get('/:garden_id/user', 
    jwtMiddleware.verifyToken, 
    userController.checkUserById, 
    
    restMiddleware.calculateResting, 
    levelMiddleware.getLevelData,
    restMiddleware.getEnergy, 
    restMiddleware.calculateEnergyPlant, 
    
    gardenController.getGardenById
);

// Read plant info by gardenid
router.get('/:garden_id/plants', plantController.getPlantsByGardenId);

// Read plant info by gardenid with relation to userid (check ownership)
router.get('/:garden_id/plants/user', 
    jwtMiddleware.verifyToken, 
    userController.checkUserById,

    restMiddleware.calculateResting, 
    levelMiddleware.getLevelData,
    restMiddleware.getEnergy, 
    restMiddleware.calculateEnergyPlant,
    
    gardenController.checkGardenExists, 
    plantController.getPlantsByGardenId
);

module.exports = router;