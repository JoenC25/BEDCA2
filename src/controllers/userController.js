const model = require('../models/userModel');

// Middleware
module.exports.checkUserByUsername = (req, res, next) => {
    const data = {
        username: req.body.username
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error getUserByUsername: ", error);
            res.status(500).json(error);
        } else if (results.length != 0 && results[0].user_id != req.params.user_id) { 
            // Only if username exists but not belonging to the user already
            res.status(409).json({
                message: "Username already exists"
            });
        } else {
            next();
        }
    }
    model.findUsername(data, callback);
}

module.exports.checkUserById = (req, res, next) => {
    const data = {
        user_id: res.locals.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserById", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "requested user_id does not exist"
            });
        } else {
            next();
        }
    }
    model.findUserid(data, callback);
}

// ENDPOINT 1
module.exports.createNewUser = (req, res, next) => {
    if (req.body.username==undefined || req.body.email==undefined || req.body.password==undefined) {
        res.status(400).json({
            message: "request body missing required fields"
        });
        return;
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewUser:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results[1][0]);
        }
    }

    model.insertSingle(data, callback);
}

// ENDPOINT 2
module.exports.readAllUser = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUser: ", error);
            res.status(500).json(error);
        }
        else {
            res.status(200).json(results);
        }
    }

    model.selectAll(callback);
}

// ENDPOINT 3
module.exports.updateUserById = (req, res, next) => {
    const data = {
        user_id: res.locals.user_id,
        username: req.body.username,
        skillpoints: req.body.skillpoints
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewUser:", error);
            res.status(500).json(error);
        } else {
            const newUser = results[1][0];
            
            res.status(200).json({
                user_id: newUser.user_id,
                username: newUser.username,
                skillpoints: newUser.skillpoints
            });
        }
    }
    model.updateById(data, callback);
}


//  SECTION B
// POST Rest
module.exports.createRest = (req, res, next) => {
    const rest_time = Math.round(50*(0.92**res.locals.levelData.level)+10)

    const data = {
        user_id : res.locals.user_id,
        rest_time: rest_time
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error createRest:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                rest: results[2][0],
                message: `resting for: ${rest_time} minutes`
            });
        }
    }

    model.insertRest(data, callback);
}

// GET Rest
module.exports.readRestByUserId = (req, res, next) => {
    const data = {
        user_id : res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error readRestByUserId:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "rest data not found"
            });
        } else {
            res.status(200).json(results[0]);
        }
    }

    model.findUseridRest(data, callback);
}


// Updating Level of User
module.exports.levelUp = (req, res, next) => {
    if (res.locals.levelData.skillpoints >= res.locals.required_points) {
        res.locals.levelData.level += 1
    }

    const data = {
        level: res.locals.levelData.level,
        user_id: res.locas.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error levelUp:", error);
            res.status(500).json(error);
        }
    }
    model.updateLevel(data, callback);
}


//GET garden by user_id
module.exports.getGardenByUserid = (req, res, next) => {
    const data = {
        owner_id: res.locals.user_id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error getGardenByUserid:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "user does not own any gardens"
            });
        } else {
            res.status(200).json(results);
        }
    }
    model.selectGardenByUserid(data, callback);
}



// User management
// register
module.exports.checkUsernameOrEmailExists = (req, res, next) => {
    const data = {
        username: req.body.username,
        email: req.body.email
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkUsernameOrEmailExist: ", error);
            res.status(500).json(error);
        } else if (results.length != 0){
            res.status(409).json({
                message: "Username or email already exists"
            });
        } else {
            next();
        }
    };

    model.selectByUsernameOrEmail(data, callback);
};

module.exports.register = (req, res, next) => {
    if (req.body.username == undefined || req.body.email == undefined || req.body.password == undefined) {
        res.status(400).json({
            message: "request body missing required fields"
        });
        return;
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: res.locals.hash
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error register: ", error);
            res.status(500).json(error);
        } else {
            res.locals.user_id = results[1][0].user_id;
            res.locals.message = `User ${results[1][0].username} created successfully.`
            next();
        }
    }

    model.insertSingle(data, callback);
}

// login
module.exports.login = (req, res, next) => {
    if (req.body.username == undefined || req.body.password == undefined) {
        res.status(400).json({
            message: "request body missing required fields"
        });
        return;
    }

    const data = {
        username: req.body.username
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error register: ", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "User not found"
            });
        } else {
            res.locals.hash = results[0].password;
            res.locals.user_id = results[0].user_id;
            next();
        }
    }

    model.selectByUsernameOrEmail(data, callback)
}

// GET user by user_id
module.exports.readUserById = (req, res) => {
    const data = {
        user_id: res.locals.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserById", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({
                message: "requested user_id does not exist"
            });
        } else {
            res.status(200).json(results[0])
        }
    }
    model.findUserid(data, callback);
}