const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    },
    isRead:{
        type: Boolean,
        default: false
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;