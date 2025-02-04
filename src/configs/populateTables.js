const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
    if (error) {
      console.error("Error creating tables:", error);
    } else {
      console.log("Tables created successfully");
    }
    process.exit();
  }

bcrypt.hash('1234', saltRounds, (error, hash) => {
    if (error) {
        console.error("Error hashing password:", error);
    } else {
        console.log("Hashed password:", hash);
    
        const SQLSTATEMENT = `
            INSERT INTO User (username, skillpoints, level, energy, email, password) VALUES
            ('socuser1', 0, 0, 100, 'socuser1@email.com', '${hash}'),
            ('socuser2', 1000, 5, 100, 'socuser2@email.com', '${hash}');

            INSERT INTO Reviews (review_amt, notes, user_id) VALUES
            (4, 'I Love BED and this game', 2),
            (5, 'Website worthy of an A.', 1);

            INSERT INTO Garden (owner_id, garden_name, plant_count) VALUES
            (1, 'Cyber Sprouts', 5),
            (1, 'Beet It.', 2),
            (2, 'Garden of Eatin\\'', 1),
            (1, 'Lawn and Order', 4);
            
            INSERT INTO Plant (garden_id, plant_name, tier_num) VALUES
            (1, 'Photon Sprout', 2),
            (1, 'Hacker Cactus', 1),
            (1, 'Mint Condition', 4),
            (1, 'Avocadude', 8),
            (2, 'Whispermint', 6),
            (1, 'Billy', 2),
            (2, 'Gobbleroot', 3),
            (4, 'Carrot', 4),
            (4, 'Oak', 2),
            (4, 'Spruce', 7),
            (3, 'The tree of knowlegde and evil.', 1),
            (4, 'Potato', 4);
        `;

        pool.query(SQLSTATEMENT, callback);
    }
});