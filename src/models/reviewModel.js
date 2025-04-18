const pool = require('../services/db');

// Select all
module.exports.selectAll = (callback) => {
    const SQLSTATMENT = `
        SELECT * FROM Reviews;
    `;

    pool.query(SQLSTATMENT, callback);
}

// Insert single
module.exports.insertSingle = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO Reviews (review_amt, notes, challenge_id, user_id)
        VALUES (?, ?, ?, ?);
        SELECT * FROM Reviews WHERE review_id = LAST_INSERT_ID();
    `;
    const VALUES = [data.review_amt, data.notes, data.challenge_id, data.user_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

// Select by review id
module.exports.selectById = (data, callback) => {
    const SQLSTATMENT = `
        SELECT * FROM Reviews
        WHERE review_id = ?;
    `;
    const VALUES = [data.review_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

// Update by review id
module.exports.updateById = (data, callback) => {
    const SQLSTATMENT = `
        UPDATE Reviews 
        SET review_amt = ?, notes = ?, challenge_id = ?, user_id = ?
        WHERE review_id = ?;
        SELECT * FROM Reviews WHERE review_id = ?;
    `;
    const VALUES = [data.review_amt, data.notes, data.challenge_id, data.user_id, data.review_id, data.review_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

// Delete by review id
module.exports.deleteById = (data, callback) => {
    const SQLSTATMENT = `
        DELETE FROM Reviews 
        WHERE review_id = ?;
    `;
    const VALUES = [data.review_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}