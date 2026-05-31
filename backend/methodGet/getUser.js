const express= require('express');

const router = express.Router();

const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');
const Ban = require('../models/ban.user.model');

router.get('/getUser', authenticationToken(), async(req,res)=>{
    const id = req.user.id;
    if(!id)
        return res.status(400).json({message: 'Введите id!'});
    
    try {
        const user = await User.findById(id).populate('category');
        if(!user)
            return res.status(404).json({message: 'Пользователь не найден!'});
        
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
})

router.get('/getUsers', authenticationToken(), async(req,res)=>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
})
router.get('/getBannedEmails',authenticationToken(['admin']),  async (req, res) => {
    try {
        const bannedUsers = await Ban.find(); // Предполагается, что модель Ban хранит только email
        res.json(bannedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении заблокированных пользователей' });
    }
});
router.post('/banUser', authenticationToken(['admin']), async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email }); // Проверяем, существует ли пользователь

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const banned = new Ban({ email });
        await banned.save();
        res.json({ message: 'Пользователь заблокирован' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при блокировке пользователя' });
    }
});
router.delete('/unbanUser', authenticationToken(['admin']), async (req, res) => {
    const { email } = req.body;

    try {
        await Ban.deleteOne({ email }); // Удаляем заблокированный email из модели Ban
        res.json({ message: 'Пользователь разблокирован' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при разблокировке пользователя' });
    }
});

module.exports = router;