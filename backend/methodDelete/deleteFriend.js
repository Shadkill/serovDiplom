const express = require('express');

const router = express.Router();

const User = require('../models/user.model');
const Message = require('../models/messages.model');
const Chat = require('../models/chat.model');
const authenticationToken = require('../middlewear/middlewear');

router.delete('/deleteFriend/:id', authenticationToken(), async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({message: 'Авторизация не выполнена'});
        const friendId = req.params.id;
        
        await User.findByIdAndUpdate(user._id,{
            $pull: { friends: friendId }
        });
        const chat=  await Chat.find({
            $or: [
                { participants: { $in: [user._id, friendId] } },
                { participants: { $in: [friendId, user._id] } }
            ]
        });
        await Message.deleteMany({
            chatId: chat._id,
        })
        await Chat.findByIdAndDelete(chat._id);
        await User.findByIdAndUpdate(friendId,{
            $pull: { friends: user._id }
        })
        return res.status(200).json({message: 'Пользователь удалён из друзей'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.delete('/deleteMessage/:id', authenticationToken(), async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({message: 'Авторизация не выполнена'});
        const messageId = req.params.id;
        
        await Message.findByIdAndDelete(messageId);
        return res.status(200).json({message: 'Сообщение удалено'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
})


module.exports = router;