const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const express = require('express');
const router = express.Router();

router.get('/', reviewController.readAllReview);
router.post('/', jwtMiddleware.verifyToken, userController.checkUserById, reviewController.createReview);
router.get('/:id', reviewController.readReviewById);
router.put('/:id', jwtMiddleware.verifyToken, userController.checkUserById, reviewController.updateReviewById);
router.delete('/:id', reviewController.deleteReviewById);

module.exports = router;