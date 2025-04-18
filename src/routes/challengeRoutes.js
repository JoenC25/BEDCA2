const challengeController = require('../controllers/challengeController');
const userController = require('../controllers/userController');
const levelMiddleware = require('../middlewares/levelMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require("express");
const router = express.Router();

router.post("/", jwtMiddleware.verifyToken, userController.checkUserById, challengeController.ceateNewChallenge);
router.get("/", challengeController.readAllChallenge);

router.get("/:challenge_id", challengeController.readByChallengeid)
router.put("/:challenge_id", 
    jwtMiddleware.verifyToken, 
    userController.checkUserById, 
    
    challengeController.checkChallengeById, 
    challengeController.checkCreatorUserId, 

    challengeController.updateChallengeById
);
router.delete("/:challenge_id", 
    jwtMiddleware.verifyToken, 
    userController.checkUserById, 
    
    challengeController.deleteById
);

router.post("/completion/:challenge_id", 
    jwtMiddleware.verifyToken, 
    userController.checkUserById,
    challengeController.checkChallengeById, 

    challengeController.incrementSkillpoints, 
    levelMiddleware.getLevelData, 
    levelMiddleware.getLevelRequirement, 
    userController.levelUp,

    challengeController.createNewCompletionRecord
);
router.get("/completion/:challenge_id", challengeController.readCompletionById);

module.exports = router;