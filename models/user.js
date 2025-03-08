const { getDb } = require("../db/connect");  // Assuming you've created a utility to connect to MongoDB

// Function to find a user by GitHub ID
const findUserByGithubId = async (githubId) => {
    const db = getDb();  // Get the database connection
    const usersCollection = db.collection("users");  // Access the 'users' collection

    const user = await usersCollection.findOne({ githubId });  // Find a user by GitHub ID
    return user;
};

// Function to create a new user
const createUser = async (githubId, username, avatar) => {
    const db = getDb();  // Get the database connection
    const usersCollection = db.collection("users");  // Access the 'users' collection

    const newUser = {
        githubId,
        username,
        avatar
    };

    const result = await usersCollection.insertOne(newUser);  // Insert the new user
    return result.ops[0];  // Return the created user document
};

module.exports = {
    findUserByGithubId,
    createUser
};

