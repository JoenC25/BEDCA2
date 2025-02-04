const pool = require('../services/db')

// SELECT challenge_id
module.exports.findChallengeId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// ENDPOINT 4
module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints)
        VALUES (?, ?, ?);
        SELECT * FROM FitnessChallenge WHERE challenge_id = LAST_INSERT_ID();
    `;
    const VALUES = [data.creator_id, data.challenge, data.skillpoints];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// ENDPOINT 5
module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FitnessChallenge;
    `;
    
    pool.query(SQLSTATEMENT, callback);
}

// ENDPOINT 6
module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE FitnessChallenge
        SET challenge = ?, creator_id = ?, skillpoints = ?
        WHERE challenge_id = ?;
        SELECT * FROM FitnessChallenge WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge, data.creator_id, data.skillpoints, data.challenge_id, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// ENDPOINT 7
module.exports.removeById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM FitnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// ENDPOINT 8
module.exports.insertSingleCompletion = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, completed, creation_date, notes) 
        VALUES (?, ?, ?, ?, ?);
        SELECT complete_id, challenge_id, user_id, completed, DATE(creation_date) AS creation_date, notes
        FROM UserCompletion WHERE complete_id = LAST_INSERT_ID();
    `;
    const VALUES = [data.challenge_id, data.user_id, data.completed, data.creation_date, data.notes];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateSkillpoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = skillpoints + ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.skillpoints, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback)
}

// ENDPOINT 9
module.exports.selectCompletionById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, completed, DATE(creation_date) AS creation_date, notes 
        FROM UserCompletion
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}