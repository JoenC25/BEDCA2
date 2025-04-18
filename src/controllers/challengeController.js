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
        } else if (results[0].creator_id != res.locals.user_id) {
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
    if (req.body.challenge == undefined || req.body.skillpoints == undefined ) {
        res.status(400).json({
            message: "Request body challenge or skillpoints is undefined"
        });
        return; 
    } else if (!Number.isInteger(Number(req.body.skillpoints))) {
        res.status(400).json({
            message: "Skillpoints must be an integer"
        });
        return; 
    }

    const data = {
        challenge: req.body.challenge,
        creator_id: res.locals.user_id,
        skillpoints: req.body.skillpoints
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewUser:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                ...results[1][0], 
                ownership: results[1][0].creator_id == res.locals.user_id,
                message: `Challenge created!`
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
            res.status(200).json(results.map(challenge => ({
                ...challenge,
                ownership: challenge.creator_id == res.locals.user_id
            })));
        }
    }
    model.selectAll(callback);
}

// ENDPOINT 6
module.exports.updateChallengeById = (req, res, next) => {
    if (req.body.challenge == undefined || req.body.skillpoints == undefined ) {
        res.status(400).send({
            message: "Request body challenge or skillpoints is missing"
        });
        return; 
    }
    
    const data = {
        challenge_id: req.params.challenge_id,
        challenge: req.body.challenge,
        skillpoints: req.body.skillpoints,
        creator_id: res.locals.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallengeById: ", error);
            res.status(500).json(error);
        } else {
            res.status(200).json({
                ...results[1][0],
                message: "Challenge updated"
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
    if (req.body.completed == undefined) {
        res.status(400).send({
            message: "Request body missing completed"
        });
        return; 
    }

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.user_id,
        completed: req.body.completed,
        notes: req.body.notes
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewCompletionRecord: ", error);
            res.status(500).json(error);
        } else {
            const newCompletion = results[1][0];
            if (newCompletion.completed) {
                message = "Challenge Completed! Check your profile for completion log"
            } else {
                message = "Challenge not Completed! Have another go at it some time..."
            }
            
            res.status(201).json(
                results[1].map(completion => ({
                ...completion,
                completed: Boolean(completion.completed),
                
                skillpoints: res.locals.levelData.skillpoints,
                level: res.locals.levelData.level,
                leveled_up: res.locals.leveled_up,
                message: message
                }))[0]
            )

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
            const completion = results[0];
            res.status(200).json({
                complete_id: completion.complete_id,
                challenge_id: completion.challenge_id,
                user_id: completion.user_id,
                completed: Boolean(completion.completed),
                notes: completion.notes,
                creation_date: completion.creation_date,
                challenge: completion.challenge
            });
        }
    }
    model.selectCompletionById(data, callback);
}

// GET by challenge_id
module.exports.readByChallengeid = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readByChallengeid: ", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "requested challenge_id does not exist"
            });
        } else {
            res.status(200).json(results[0]);
        }
    }
    model.findChallengeId(data, callback)
}