const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    lastMessage:{
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content:{
            type: String
        },
        timestamp:{
            type: Date,
        }
    }
});


const Chat = mongoose.model('Chat',chatSchema);

module.exports = Chat;