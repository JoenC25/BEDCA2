const model = require('../models/plantModel');

// POST Plant (plant a plant)
module.exports.createPlant = (req, res, next) => {
    if (req.body.plant_name==undefined) {
        res.status(400).json({
            message: "request body missing plant_name"
        });
        return;
    }
    
    const data = {
        garden_id: req.body.garden_id,
        plant_name: req.body.plant_name,
        energy_deduction: res.locals.energy_deduction,
        user_id: res.locals.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error createPlant:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                ...results[3][0],
                ownership: results[3][0].owner_id == res.locals.user_id,
                energy: `Energy remaining: ${res.locals.energy - res.locals.energy_deduction}`,
                message: `Plant '${req.body.plant_name}' created! (-${res.locals.energy_deduction} energy)`
            });
        }
    }
    
    model.insertPlant(data, callback);
}

// PUT Plant
module.exports.updatePlant = (req, res, next) => {
    if (req.body.plant_name==undefined) {
        res.status(400).json({
            message: "request body missing plant_name"
        });
        return;
    }
    
    const data = {
        plant_name: req.body.plant_name,
        plant_id: req.params.plant_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error updatePlant:", error);
            res.status(500).json(error);
        } else if (results[0].affectedRows == 0) {
            res.status(404).json({
                message: "requested plant_id does not exist"
            });
        } else {
            res.status(200).json({
                ...results[1][0],
                message: "Plant renamed successfully"
        });
        }
    }
    model.updatePlant(data, callback);
}

// GET Plant by plant id
module.exports.readSinglePlant = (req, res, next) => {
    const data = {
        plant_id: req.params.plant_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readSinglePlant:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }
    model.selectSingle(data, callback);
}

// GET Plants by Garden id
module.exports.getPlantsByGardenId = (req, res, next) => {
    const data = {
        garden_id: req.params.garden_id
    }
    
    const callback = (error, results) => {
        if (error) {
            console.error("Error getPlants:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "requested garden_id has no plants"
            });
        } else {
            res.status(200).json(
                results.map(plant => ({
                    ...plant,
                    ownership: plant.owner_id == res.locals.user_id,
                    energy_deduction: res.locals.energy_deduction,
                    message: res.locals.message,
                    insufficient_energy: res.locals.insufficient_energy,
                    resting: res.locals.resting
                }))
            );
        }
    }
    model.selectPlantByGardenid(data, callback);
}

// Water plant
module.exports.waterPlant = (req, res, next) => {
    const data = {
        plant_id: req.params.plant_id,
        energy_deduction: res.locals.energy_deduction,
        user_id: res.locals.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error updatePlant:", error);
            res.status(500).json(error);
        } // if no values returned, plant doesn't exist
        else if (results[1].length == 0) {
            res.status(404).json({
                message: "requested plant_id does not exist"
            });
        } // if plant tier not affected, plant is at max level
        else if (results[0].affectedRows == 0) {
            res.status(409).json({
                message: "plant is at max level"
            });
        } else {
            res.status(200).json({
                ...results[1][0],
                ownership: results[1][0].owner_id == res.locals.user_id,
                energy: `Energy remaining: ${res.locals.energy - res.locals.energy_deduction}`,
                message: `'${results[1][0].plant_name}' Tier UP! (-${res.locals.energy_deduction} energy)`
            });
        }
    }
    model.updatePlantTier(data, callback);
}

