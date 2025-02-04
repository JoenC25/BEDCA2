const pool = require('../services/db');

// SELECT by username
module.exports.findUsername = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User
        WHERE username = ?;
    `;
    VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// SELECT by user_id
module.exports.findUserid = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// ENDPOINT 1
module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO User (username, email, password) VALUES (?, ?, ?);
        SELECT user_id, username, email, skillpoints, level, energy FROM User WHERE user_id = LAST_INSERT_ID();
    `;
    VALUES = [data.username, data.email, data.password];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ENDPOINT 2
module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User;
    `;

    pool.query(SQLSTATEMENT, callback);
};

// ENDPOINT 3
module.exports.updateById = (data, callback) => {
    const MYSQLSTATEMENT = `
        UPDATE User
        SET username = ?, skillpoints = ?
        WHERE user_id = ?;

        SELECT * FROM User WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.skillpoints, data.user_id, data.user_id];
    
    pool.query(MYSQLSTATEMENT, VALUES, callback);
};


// SECTION B
// Rest Function
module.exports.findUseridRest = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Rest
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.removeRest = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Rest
        WHERE user_id = ?
    `;
    const VALUES = [data.user_id]

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertRest = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Rest (user_id) VALUES (?);
        UPDATE Rest SET awake_on = DATE_ADD(rested_on, INTERVAL ? MINUTE);
        SELECT * FROM Rest WHERE rest_id = LAST_INSERT_ID();

        UPDATE User SET energy = 100;
    `;
    const VALUES = [data.user_id, data.rest_time];

    pool.query(SQLSTATEMENT, VALUES, callback);
}


// Updating Level of User
module.exports.findRequiredPoints = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT required_points FROM Levels WHERE level = ?;
    `;
    const VALUES = [data.level];

    pool.query(SQLSTATEMENT, VALUES, callback)
}

module.exports.updateLevel = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User SET level = ? WHERE user_id = ?;
    `;
    const VALUES = [data.level, data.user_id];;

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Select garden by user_id
module.exports.selectGardenByUserid = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Garden WHERE owner_id = ?;
    `;
    const VALUES = [data.owner_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}



// User management
module.exports.selectByUsernameOrEmail = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User WHERE username = ? or email = ?;
    `;
    const VALUES = [data.username, data.email];

    pool.query(SQLSTATEMENT, VALUES, callback);
}