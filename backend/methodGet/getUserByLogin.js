const express = require('express');

const router = express.Router();

const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');
const Post = require('../models/post.model');
router.get('/userLogin/:login', async(req,res)=>{
    try {
        const {login} = req.params;
        if(!login)
            return res.status(400).json({message: 'Пользователь не найден'});
        const user = await User.findOne({login: login});
        if(!user)
            return res.status(404).json({message: 'Пользователь не найден'});
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
} );

router.get('/postByUser/:login', authenticationToken(), async(req,res)=>{
    try {
        const {login} = req.params;
        if(!login)
            return res.status(400).json({message: 'Пользователь не найден'});
        const user = await User.findOne({login: login});
        const posts = await Post.find({author:user.id}).sort({
            createdAt: -1
        });
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
})


module.exports = router;