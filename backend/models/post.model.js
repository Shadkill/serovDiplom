const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    preview:{
        type: String,
    },
    content:{
        type: String,
    },
    category:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    likeCount:{
        type: Number,
        default: 0
    },
    likedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;