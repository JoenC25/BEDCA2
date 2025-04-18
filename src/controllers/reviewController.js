const model = require("../models/reviewModel.js");

// Get all reviews
module.exports.readAllReview = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllReview:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    model.selectAll(callback);
}

// Creates a review
module.exports.createReview = (req, res, next) => {
    if(req.body.review_amt == undefined || req.body.challenge_id == undefined) {
        res.status(400).json({
            message: "request body missing required fields"
        });
        return;
    } else if(req.body.review_amt > 5 || req.body.review_amt < 1) {
        res.status(400).send({
             message: "review_amt can only be between 1 to 5"
        });
        return;
    }

    const data = {
        user_id: res.locals.user_id,
        review_amt: req.body.review_amt,
        challenge_id: req.body.challenge_id,
        notes: req.body.notes
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createMessage:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results[1][0]);
        }
    }

    model.insertSingle(data, callback);
}

// Gets review by review id
module.exports.readReviewById = (req, res, next) => {
    const data = {
        review_id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readReviewById:", error);
            res.status(500).json(error);
        } else if(results.length == 0) {
            res.status(404).json({
                message: "Review not found"
            });
        } else {
            res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}

// Updates review by review id
module.exports.updateReviewById = (req, res, next) => {
    if(req.body.review_amt == undefined || req.body.challenge_id == undefined) {
        res.status(400).json({
            message: "request body missing required fields"
        });
        return;
    } else if(req.body.review_amt > 5 || req.body.review_amt < 1) {
        res.status(400).json({
            message: "review_amt can only be between 1 to 5"
       });
       return;
    }

    const data = {
        review_id: req.params.id,
        notes: req.body.notes,
        review_amt: req.body.review_amt,
        challenge_id: req.body.challenge_id,
        user_id: res.locals.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateReviewById:", error);
            res.status(500).json(error);
        } else if (results[0].affectedRows == 0) {
            res.status(404).json({
                message: "review not found"
            });
        } else {
            res.status(200).json(results[1][0]);
        }
    }

    model.updateById(data, callback);
}

// Deletes review by review id
module.exports.deleteReviewById = (req, res, next) => {
    const data = {
        review_id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteReviewById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) {
                res.status(404).json({
                    message: "review not found"
                });
            } else {
                res.status(204).send();
            }
        }
    }

    model.deleteById(data, callback);
}