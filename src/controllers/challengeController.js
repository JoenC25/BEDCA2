const model = require('../models/challengeModel');

// Middleware
module.exports.checkChallengeById = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallengeById: ", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "requested challenge_id does not exist"
            });
        } else {
            res.locals.challengeSkillpoints = results[0].skillpoints;
            next();
        }
    }
    model.findChallengeId(data, callback);
}

module.exports.checkCreatorUserId = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallengeById: ", error);
            res.status(500).json(error);
        } else if (results[0].creator_id != req.body.user_id) {
            res.status(403).json({
                message: "user_id is not same as creator_id"
            });
        } else {
            next();
        }
    }
    model.findChallengeId(data, callback);
}

// ENDPOINT 4
module.exports.ceateNewChallenge = (req, res, next) => {
    if (req.body.challenge == undefined || req.body.user_id == undefined || req.body.skillpoints == undefined ) {
        res.status(400).send({
            message: "Request body challenge, user_id or skillpoints is undefined"
        });
        return; 
    }

    const data = {
        challenge: req.body.challenge,
        creator_id: req.body.user_id,
        skillpoints: req.body.skillpoints
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewUser:", error);
            res.status(500).json(error);
        } else {
            const newChallenge = results[1][0];

            res.status(201).json({
                challenge_id: newChallenge.challenge_id,
                challenge: newChallenge.challenge,
                creator_id: newChallenge.creator_id,
                skillpoints: newChallenge.skillpoints
            });
        }
    }
    model.insertSingle(data, callback);
}

// ENDPOINT 5
module.exports.readAllChallenge = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllChallenge:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results);
        }
    }
    model.selectAll(callback);
}

// ENDPOINT 6
module.exports.updateChallengeById = (req, res, next) => {
    if (req.body.challenge == undefined || req.body.user_id == undefined || req.body.skillpoints == undefined ) {
        res.status(400).send({
            message: "Request body challenge, user_id or skillpoints is missing"
        });
        return; 
    }
    
    const data = {
        challenge_id: req.params.challenge_id,
        challenge: req.body.challenge,
        skillpoints: req.body.skillpoints,
        creator_id: req.body.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallengeById: ", error);
            res.status(500).json(error);
        } else {
            const newChallenge = results[1][0];

            res.status(200).json({
                challenge_id: newChallenge.challenge_id,
                challenge: newChallenge.challenge,
                creator_id: newChallenge.creator_id,
                skillpoints: newChallenge.skillpoints
            });
        }
    }
    model.updateById(data, callback)
}

// ENDPOINT 7
module.exports.deleteById = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    }
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteById: ", error);
            res.status(500).json(error);
        } else if (results.affectedRows == 0) {
            res.status(404).json({
                message: "requested challenge_id does not exist"
            });
        } else {
            res.status(204).send();
        }
    }
    model.removeById(data, callback);
}

// ENDPOINT 8
module.exports.createNewCompletionRecord = (req, res, next) => {
    if (req.body.creation_date == undefined) {
        res.status(400).json({
            message: "creation_date is missing"
        });
        return;
    }

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.user_id,
        completed: req.body.completed,
        creation_date: req.body.creation_date,
        notes: req.body.notes
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewCompletionRecord: ", error);
            res.status(500).json(error);
        } else {
            const newCompletion = results[1][0];

            res.status(201).json({
                complete_id: newCompletion.complete_id,
                challenge_id: newCompletion.challenge_id,
                user_id: newCompletion.user_id,
                completed: Boolean(newCompletion.completed),
                creation_date: newCompletion.creation_date,
                notes: newCompletion.notes
            });
            next();
        }
    }
    model.insertSingleCompletion(data, callback);
}

module.exports.incrementSkillpoints = (req, res, next) => {
    if (req.body.completed) {
        increment = res.locals.challengeSkillpoints;
    } else {
        increment = 5;
    }

    const data = {
        skillpoints: increment,
        user_id: res.locals.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error incrementSkillpoints: ", error);
            res.status(500).json(error);
        }
        next();
    }
    model.updateSkillpoints(data, callback);
}

// ENDPOINT 9
module.exports.readCompletionById = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readCompletionById: ", error);
            res.status(500).json(error);
        } else if (results.length==0) {
            res.status(404).json({
                message: "requested challenge_id does not have any user attempts"
            });
        } else {
            res.status(200).json(results.map(obj => ({
                ...obj,
                completed: Boolean(obj.completed)
              }))
            );
        }
    }
    model.selectCompletionById(data, callback);
}