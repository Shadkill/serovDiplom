const express = require('express');

const router = express.Router();

const Chat = require('../models/chat.model');
const Message = require('../models/messages.model');
const authenticationToken = require('../middlewear/middlewear');


router.get('/chats', authenticationToken(), async(req,res)=>{
    try {
        const chats = await Chat.find({participants: req.user.id}).populate('participants');
        if(!chats) return res.status(401).json({message: 'Авторизация не выполнена'});

        res.json(chats);
    } catch(err){
        console.log(err);
    }
 });

 router.get('/chatMessages/:id', authenticationToken(), async(req,res)=>{
    try {
        const messages = await Message.find({
            chatId: req.params.id,
        });
        if(!messages) return res.status(404).json({message: 'Сообщения не найдены'});
        res.json(messages);
    } catch (error) {
        console.log(error);
    }
 })

 module.exports = router;