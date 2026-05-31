const express = require('express');

const router = express.Router();

const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');

router.get('/usersRequests', authenticationToken(), async(req,res)=>{
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('friendRequests');
        if(!user)
            return res.status(404).json({message: 'Пользователь не найден'});

        res.json(user.friendRequests);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

module.exports = router;