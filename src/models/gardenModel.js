const pool = require('../services/db');

// Garden Management
module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Garden;
    `;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Garden WHERE garden_id = ?;
    `;
    const VALUES = [data.garden_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Garden (owner_id, garden_name) VALUES (?, ?);
        SELECT * FROM Garden WHERE garden_id = LAST_INSERT_ID();
    `;
    const VALUES = [data.owner_id, data.garden_name];

    pool.query(SQLSTATEMENT, VALUES, callback);
}