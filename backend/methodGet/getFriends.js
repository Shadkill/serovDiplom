const express = require('express');

const router = express.Router();

const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');

router.get('/friends', authenticationToken(),async(req,res)=>{
      try {
        const searchQuery = req.query.search; // Get search query from request
        const user = await User.findById(req.user.id).populate('friends');
        
        if (!user) {
            return res.status(401).json({message: 'Пользователь не найден'});
        }

        let friends = user.friends;

        // If search query exists, filter friends
        if (searchQuery) {
            friends = friends.filter(friend => 
                `${friend.name} ${friend.surname}`.toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        }

        return res.json(friends);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
})

module.exports = router;