const pool = require("../services/db");

const SQLSTATEMENT = `
    DROP TABLE IF EXISTS User;
    DROP TABLE IF EXISTS FitnessChallenge;
    DROP TABLE IF EXISTS UserCompletion;
    DROP TABLE IF EXISTS Reviews;
    DROP TABLE IF EXISTS Rest;
    DROP TABLE IF EXISTS Levels;
    DROP TABLE IF EXISTS Garden;
    DROP TABLE IF EXISTS Plant;
    DROP TABLE IF EXISTS PlantTiers;

    CREATE TABLE User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT,
        skillpoints INT DEFAULT 0,
        level INT DEFAULT 0,
        energy INT DEFAULT 100,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    );

    CREATE TABLE FitnessChallenge (
        challenge_id INT AUTO_INCREMENT PRIMARY KEY,
        creator_id INT NOT NULL,
        challenge TEXT NOT NULL,
        skillpoints INT NOT NULL
    );

    CREATE TABLE UserCompletion (
        complete_id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        user_id INT NOT NULL,
        completed BOOL NOT NULL,
        notes TEXT,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Reviews (
        review_id INT PRIMARY KEY AUTO_INCREMENT,
        review_amt INT NOT NULL,
        challenge_id INT NOT NULL,
        notes TEXT,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Rest (
        rest_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        rested_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        awake_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Levels (
        level INT NOT NULL,
        required_points INT NOT NULL
    );

    CREATE TABLE Garden (
        garden_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        garden_name TEXT NOT NULL,
        plant_count INT DEFAULT 0
    );

    CREATE TABLE Plant (
        plant_id INT AUTO_INCREMENT PRIMARY KEY,
        garden_id INT NOT NULL,
        plant_name TEXT NOT NULL,
        tier_num INT DEFAULT 1,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE PlantTiers (
        tier_num INT NOT NULL,
        tier_name TEXT NOT NULL
    );

    INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints) VALUES
    (1, 'Complete 2.4km within 15 minutes', 50),
    (1, 'Cycle around the island for at least 50km', 100),
    (2, 'Complete a full marathon (42.2km)', 200),
    (2, 'Hold a plank for 5 minutes', 50),
    (2, 'Perform 100 push-ups in one session', 75);

    INSERT INTO Levels (level, required_points) VALUES
    (1, 50),
    (2, 150),
    (3, 300),
    (4, 600),
    (5, 1000),
    (6, 1500),
    (7, 2050),
    (8, 2750),
    (9, 3750),
    (10, 5000);

    INSERT INTO PlantTiers (tier_num, tier_name) VALUES
    (1, 'Seedling'),
    (2, 'Sprout'),
    (3, 'Sapling'),
    (4, 'Budding'),
    (5, 'Blooming'),
    (6, 'Thriving'),
    (7, 'Lush'),
    (8, 'Legendary'),
    (9, 'Ancient'),
    (10, 'Singularity Root(MAX)');
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
    if(error){
        console.error("Error creating tables: ", error);
    } else {
        console.log("Tables created successfully: ", results);
    }
    process.exit();
});