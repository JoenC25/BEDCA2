# Garden Gains
Manage gardens and plants, level up through completing various fitness challenges!

## Prerequisites
Before running the tests, ensure that the following dependencies are installed:

- Node.js
- npm (Node Package Manager)

## Setting Up Environment Variables

This repository provides instructions for setting up environment variables using a `.env` file in an Express.js application. The environment variables will be used in the `db.js` file located in the `src/services` directory.

### Setup

To set up environment variables for your Express.js application, follow these steps:

1. Create a file named `.env` in the root directory of your project.
2. Open the `.env` file and add the following lines:

   ```
   DB_HOST=<your_database_host>
   DB_USER=<your_database_user>
   DB_PASSWORD=<your_database_password>
   DB_DATABASE=<your_database_name>
   JWT_SECRET_KEY=<your_secret_key>
   JWT_EXPIRES_IN=<duration>
   JWT_ALGORITHM=<selected_algorithm>
   ```

   Replace `<your_database_host>`, `<your_database_user>`, `<your_database_password>`, and `<your_database_name>` with the appropriate values for your database connection.

   Replace `<your_secret_key>`, `<duration>`, and `<selected_algorithm>` with the appropriate values for your JSON web token usage.

   For example:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=1234
   DB_DATABASE=GardenGains
   JWT_SECRET_KEY=your-secret-key
   JWT_EXPIRES_IN=15m
   JWT_ALGORITHM=HS256
   ```

   Note: Make sure there are no spaces around the equal sign (=) in each line.

3. Save the `.env` file.

## Installation
Install Dependencies:
Navigate to the terminal and install the required dependencies with npm
```bash
npm install bcrypt dotenv express jsonwebtoken mysql2 nodemon
```

## Usage
To start the application, run the following command
```bash
npm run start
```

## Description
This Gamified Fitness Challenge System involves a 'level up' mechanic, whenever skillpoints are updated, and affects other mechanics. 
A 'rest' mechanic, which prevents user from performing actions but restores user's energy count, rest time is affected by level.
A 'planting' mechanic, allowing the user to plant a plant for the cost of energy, the energy deducted is affected by level. The user can also name each plant individually and creatively.
The user can create gardens for their plants.
The user will also be able to manage plants and gardens.