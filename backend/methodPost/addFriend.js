const express= require('express');

const router = express.Router();

const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');
const Chat = require('../models/chat.model');
router.post('/addFriend/:id', authenticationToken(), async(req,res)=>{
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const requests = await User.findOne({
            _id:userId ,
            sentRequests: id,
        });
        if(requests)
            return res.status(400).json({message: 'Вы уже отправляли заявку для этого пользователя!'});

        const friendo = await User.findOne({
            _id: userId,
            friends: id,
        });
        if(friendo)
            return res.status(400).json({message: 'Вы уже являетесь друзьями с этим пользователем!'});
        
        const user = await User.findByIdAndUpdate(userId,{$push: {sentRequests: id}});
          if(!user)
            return res.status(404).json({message: 'Пользователь не найден!'});
        const friend = await User.findByIdAndUpdate(id, {$push:{friendRequests:userId}});
        if(!friend)
            return res.status(404).json({message: 'Пользователь не найден!'});

        return res.status(200).json({message: 'Заявка отправлена!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.post('/addFriendUser/:id', authenticationToken(), async(req,res)=>{
    try {
        const userId = req.user.id;
        const friendId = req.params.id;

        const friendControl = await User.findOne({
            _id:userId,
            friends:  friendId,
        });

        if(friendControl){
             await User.findByIdAndUpdate(userId,{$pull: {friendRequests: friendId}});
             await User.findByIdAndUpdate(friendId,{$pull: {sentRequests: userId}});
            return res.status(400).json({message: 'Вы уже являетесь друзьями с этим пользователем!'});
        }
            

        const user = await User.findByIdAndUpdate(userId, {$push: {friends: friendId}, $pull:{friendRequests: friendId }});
        if(!user)
            return res.status(404).json({message: 'Пользователь не найден!'});
        const friend = await User.findByIdAndUpdate(friendId, {$push: {friends: userId}, $pull:{sentRequests: userId }});
        if(!friend)
            return res.status(404).json({message: 'Пользователь не найден!'});

        const newChat = await Chat.create({
            participants: [userId, friendId],
        })
        return res.status(200).json({message: 'Пользователь добавлен в друзья!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.post('/refusalFriend/:id', authenticationToken(), async(req,res)=>{
    try {
        const userId = req.user.id;
        const friendId = req.params.id;
        const user = await User.findByIdAndUpdate(userId, {$pull:{friendRequests: friendId}});
        if(!user)
            return res.status(404).json({message: 'Пользователь не найден!'});
        const friend = await User.findByIdAndUpdate(friendId, {$pull:{sentRequests: userId}});
        if(!friend)
            return res.status(404).json({message: 'Пользователь не найден!'});
        return res.status(200).json({message: 'Заявка отклонена!'});
    } catch (error) {
        
    }
})

module.exports = router;