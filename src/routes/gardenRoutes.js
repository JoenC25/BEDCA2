const gardenController = require('../controllers/gardenController');
const plantController = require('../controllers/plantController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require("express")
const router = express.Router();


router.post('/',jwtMiddleware.verifyToken, userController.checkUserById, gardenController.createGarden);
router.get('/', gardenController.getAllGardens);

router.get('/:garden_id', gardenController.getGardenById);

router.get('/:garden_id/plants', 
    jwtMiddleware.verifyToken, 
    userController.checkUserById,

    gardenController.checkGardenExists, 
    plantController.getPlantsByGardenId
);

module.exports = router;