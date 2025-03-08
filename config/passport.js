const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { getDb } = require("../db/connect");  // Use the MongoDB connection utility

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: "user"
}, (accessToken, refreshToken, profile, done) => {
    const db = getDb();  // Get the MongoDB connection
    const usersCollection = db.collection("users");  // Access the 'users' collection

    // Find user by GitHub ID
    usersCollection.findOne({ githubId: profile.id })
        .then((user) => {
            if (!user) {
                // If user doesn't exist, create a new user
                const newUser = {
                    githubId: profile.id,
                    username: profile.username,
                    avatar: profile.photos[0].value
                };
                return usersCollection.insertOne(newUser);  // Insert the new user
            }
            return user;  // Return existing user
        })
        .then((user) => {
            // If a user was created, return the inserted user object
            return done(null, user.ops ? user.ops[0] : user);  // Extract the user object from result
        })
        .catch((err) => {
            // Handle errors correctly by passing them to done
            return done(err, null);
        });
}));

passport.serializeUser((user, done) => {
    console.log("Serializing user: ", user);
    done(null, user._id);  // Use _id instead of id as it’s returned by MongoDB
});

passport.deserializeUser((id, done) => {
    console.log("Deserializing user by id: ", id);
    const db = getDb();  // Get the MongoDB connection
    const usersCollection = db.collection("users");  // Access the 'users' collection

    // Find user by _id
    usersCollection.findOne({ _id: id })
        .then((user) => {
            done(null, user);  // Pass the user data to done()
        })
        .catch((err) => {
            done(err, null);  // Pass any error to done
        });
});
