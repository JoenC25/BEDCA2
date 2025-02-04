const challengeController = require('../controllers/challengeController');
const userController = require('../controllers/userController');
const levelMiddleware = require('../middlewares/levelMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require("express");
const router = express.Router();

router.post("/",challengeController.ceateNewChallenge);
router.get("/", challengeController.readAllChallenge);

router.put("/:challenge_id", challengeController.checkChallengeById, challengeController.checkCreatorUserId, challengeController.updateChallengeById);
router.delete("/:challenge_id", challengeController.deleteById);
router.post("/:challenge_id", 
    jwtMiddleware.verifyToken,
    challengeController.checkChallengeById, 
    userController.checkUserById, 
    challengeController.createNewCompletionRecord, 
    challengeController.incrementSkillpoints,
    levelMiddleware.getLevelData, 
    levelMiddleware.getLevelRequirement, 
    userController.levelUp
);
router.get("/:challenge_id", challengeController.readCompletionById);

module.exports = router;