const express = require('express');

const router = express.Router();

const Post = require('../models/post.model');
const authenticationToken = require('../middlewear/middlewear');


router.post('/likePost/:id', authenticationToken(), async(req,res)=>{
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const post = await Post.findById(id);
        if(!post)
            return res.status(404).json({message: 'Пост не найден'});

        if (post.likedBy.includes(userId)) {
            // Если уже лайкнул, убираем лайк
            post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
            post.likeCount--;
        } else {
            // Если не лайкал, добавляем лайк
            post.likedBy.push(userId);
            post.likeCount++;
        }
        await post.save();
        return res.status(200).json({ likes: post.likedBy.length, likedBy: post.likedBy });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
});
module.exports =router;