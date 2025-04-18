const model = require('../models/userModel');

// Checks if user is resting
module.exports.checkResting = (req, res, next) => {
    const data = {
        user_id: res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error calculateAwake", error);
            res.status(500).json(error);
        } else if (results[0] != undefined) { // No rest data, user is not resting
            const targetDatetime = new Date(results[0].awake_on);
            const now = new Date();
            if (now < targetDatetime) { // checks if time now is before the awake time
                res.status(409).json({
                    message: "User is resting!",
                    resting: true
                });
            } else {
                next();
            }
        } else {
            next();
        }
    }

    model.selectRestByUserid(data, callback);
}

// Purely calculates if user is resting
module.exports.calculateResting = (req, res, next) => {
    const data = {
        user_id: res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error calculateAwake", error);
            res.status(500).json(error);
        } else if (results[0] != undefined) { // No rest data, user is not resting
            const targetDatetime = new Date(results[0].awake_on);
            const now = new Date();
            if (now < targetDatetime) { // checks if time now is before the awake time
                res.locals.message = "User is resting!";
                res.locals.resting = true
            }
        }
        next();
    }

    model.selectRestByUserid(data, callback);
}

// Checks if user is already at max energy
module.exports.checkMaxEnergy = (req, res, next) => {
    const data = {
        user_id : res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error readRestById:", error);
            res.status(500).json(error);
        } else if (results[0].energy == 100) {
            res.status(409).json({
                message: "You are at full energy!"
            });
        } else {
            next();
        }
    }

    model.findUserid(data, callback);
}

// Removes the previous rest data of user by user_id, so that a new one can be made
module.exports.deleteRest = (req, res, next) => {
    const data = {
        user_id : res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteRest:", error);
            res.status(500).json(error);
        } else {
            next();
        }
    }

    model.removeRest(data, callback);
}

// Retreiving energy data
module.exports.getEnergy = (req, res, next) => {
    const data = {
        user_id: res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error getEnergy:", error);
            res.status(500).json(error);
        } else {
            res.locals.energy = results[0].energy
            next();
        }
    }

    model.findUserid(data, callback);
}

// Calculates and returns error if the user has enough energy to carry out action, both creating plants and watering them have the same energy formula
module.exports.checkEnergyPlant = (req, res, next) => {
    const energy_deduction = Math.round((20 * (0.75**res.locals.levelData.level)) + 10);
        
    // if the energy deduction required is more than the energy of the user
    if (res.locals.energy < energy_deduction){
        res.status(409).json({
            message: "insufficient energy, you need to rest!"
        });
        return;
    } else {
        res.locals.energy_deduction = energy_deduction;
        next();
    }
}

// Purely calculates if the user has enough energy to carry out action
module.exports.calculateEnergyPlant =  (req, res, next) => {
    const energy_deduction = Math.round((20 * (0.75**res.locals.levelData.level)) + 10);

    if (res.locals.energy < energy_deduction){
        res.locals.message = "insufficient energy, you need to rest!";
        res.locals.insufficient_energy = true;
    }

    res.locals.energy_deduction = energy_deduction;
    next();
}