var mongoose = require('mongoose');

var AuthUserSchema = new mongoose.Schema(
    {
        username: String,
        password: String
     }
);

module.exports = mongoose.model('authUser', AuthUserSchema);