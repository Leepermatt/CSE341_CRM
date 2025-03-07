const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    githubId: String,
    username: String,
    avatar: String
});

module.exports = mongoose.model("User", UserSchema);
