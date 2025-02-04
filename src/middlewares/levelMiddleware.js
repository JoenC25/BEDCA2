model = require('../models/userModel');

module.exports.getLevelData = (req, res, next) => {
    const data = {
        user_id: res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error getSkillpoints:", error);
            res.status(500).json(error);
        } else {
            res.locals.levelData = {
                skillpoints: results[0].skillpoints,
                level: results[0].level
            };
            next();
        }
    }

    model.findUserid(data, callback);
}

module.exports.getLevelRequirement = (req, res, next) => {
    const data = {
        level: res.locals.levelData.level + 1
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error getLevelRequirement:", error);
            res.status(500).json(error);
        } else {
            res.locals.required_points = results[0].required_points
            next();
        }
    }

    model.findRequiredPoints(data, callback);
}