const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    favoriteStyles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MustacheStyle' 
    }]
}); 

const UserModel = mongoose.model('User', userSchema, 'users');

module.exports = UserModel;
