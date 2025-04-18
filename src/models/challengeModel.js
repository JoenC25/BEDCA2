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
        SET challenge = ?, skillpoints = ?
        WHERE challenge_id = ?;
        SELECT * FROM FitnessChallenge WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge, data.skillpoints, data.challenge_id, data.challenge_id];

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
        INSERT INTO UserCompletion (challenge_id, user_id, completed, notes) 
        VALUES (?, ?, ?, ?);

        SELECT * FROM UserCompletion 
        INNER JOIN FitnessChallenge ON FitnessChallenge.challenge_id = UserCompletion.challenge_id
        WHERE complete_id = LAST_INSERT_ID();
    `;
    const VALUES = [data.challenge_id, data.user_id, data.completed, data.notes];

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
        SELECT * FROM UserCompletion
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}