const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    login:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    category:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    avatar:{
        type: String
    },
    posts_like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    }],
    friendRequests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    sentRequests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt:{
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;