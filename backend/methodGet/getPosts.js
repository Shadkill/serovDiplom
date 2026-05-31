const express = require('express');
const router = express.Router();

const Post = require('../models/post.model');
const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');

router.get('/posts', authenticationToken(), async(req,res)=>{
    try {
        const user = await User.findById(
           req.user.id,
        );
        if(!user) return res.status(401).json({message: 'Авторизация не выполнена'});

        const posts = await Post.find({
            category: { $in: user.category }
        }).sort({createdAt: -1}).populate('author');
       return res.json(posts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/postByUser', authenticationToken(), async(req,res)=>{
    try {
        const posts = await Post.find({
            author: req.user.id
        }).sort({
            createdAt: -1
        });
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

module.exports =router;