const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
})

module.exports = mongoose.model('User', UserSchema, 'user');