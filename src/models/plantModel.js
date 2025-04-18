const pool = require('../services/db');

// Plant Management
// Create a plant
module.exports.insertPlant = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Plant (garden_id, plant_name) VALUES (?, ?);
        
        UPDATE User SET energy = energy - ? WHERE user_id = ?;

        UPDATE Garden SET plant_count = plant_count + 1 WHERE garden_id = ?; 

        SELECT * FROM Plant
        INNER JOIN PlantTiers ON PlantTiers.tier_num = Plant.tier_num
        INNER JOIN Garden ON Garden.garden_id = Plant.garden_id
        WHERE plant_id = LAST_INSERT_ID();
    `;
    // Insert plant, update user's energy, returns created plant, and updates plant count for that garden
    const VALUES = [data.garden_id, data.plant_name, data.energy_deduction, data.user_id, data.garden_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Update plant info
module.exports.updatePlant = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Plant SET plant_name = ? WHERE plant_id = ?;
        SELECT * FROM Plant WHERE plant_id = ?;
    `;
    const VALUES = [data.plant_name, data.plant_id, data.plant_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Select plant by plant id
module.exports.selectSingle = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Plant
        INNER JOIN PlantTiers ON PlantTiers.tier_num = Plant.tier_num
        WHERE plant_id = ?;
    `;
    const VALUES = [data.plant_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Water a plant, tier up plant
module.exports.updatePlantTier = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Plant SET tier_num = tier_num + 1 WHERE plant_id = ? AND tier_num < 10;

        SELECT * FROM Plant
        INNER JOIN PlantTiers ON PlantTiers.tier_num = Plant.tier_num
        INNER JOIN Garden ON Garden.garden_id = Plant.garden_id
        WHERE plant_id = ?;

        UPDATE User 
        SET energy = energy - CASE WHEN (SELECT tier_num FROM Plant WHERE plant_id = ?) < 10 THEN ? ELSE 0 END 
        WHERE user_id = ?;
    `;
    const VALUES = [data.plant_id, data.plant_id, data.plant_id, data.energy_deduction, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Select plants by garden
module.exports.selectPlantByGardenid = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT Plant.plant_name, Plant.plant_id, PlantTiers.tier_name, Plant.tier_num, Garden.owner_id, Plant.created_on FROM Plant
        INNER JOIN PlantTiers ON PlantTiers.tier_num = Plant.tier_num
        INNER JOIN Garden ON Garden.garden_id = Plant.garden_id
        WHERE Plant.garden_id = ?;
    `;
    const VALUES = [data.garden_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}