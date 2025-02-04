const model = require('../models/gardenModel');

// Garden Management
module.exports.checkOwnership = (req, res, next) => {
    if (req.body.garden_id==undefined) {
        res.status(400).json({
            message: "request body missing garden_id"
        });
        return;
    }
    
    const data = {
        garden_id: req.body.garden_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error createPlant:", error);
            res.status(500).json(error);
        } else if (results[0].owner_id != res.locals.user_id) {
            res.status(403).json({
                message: "garden does not belong to user"
            });
        } else {
            next();
        }
    }
    model.selectById(data, callback);
}

// Checks if the garden exists
module.exports.checkGardenExists = (req, res, next) => {
    const data = {
        garden_id: req.params.garden_id ? req.params.garden_id : req.body.garden_id
    }
    
    const callback = (error, results) => {
        if (error) {
            console.error("Error checkGardenExists:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "garden not found"
            });
        } else {
            next();
        }
    }
    model.selectById(data, callback);
}

// GET all Gardens
module.exports.getAllGardens = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error getGardenById:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }
    model.selectAll(callback);
}

// GET Garden by Garden id
module.exports.getGardenById = (req, res, next) => {
    const data = {
        garden_id: req.params.garden_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error getGardenById:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "garden not found with requested garden_id"
            });
        } else {
            res.status(200).json(results[0]);
        }
    }
    model.selectById(data, callback);
}

// POST Garden
module.exports.createGarden = (req, res, next) => {
    if (req.body.garden_name==undefined) {
        res.status(400).json({
            message: "request body missing garden_name"
        });
        return;
    }
    
    const data = {
        owner_id: res.locals.user_id,
        garden_name: req.body.garden_name
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error createGarden:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results[1][0]);
        }
    }
    model.insertSingle(data, callback)
}

