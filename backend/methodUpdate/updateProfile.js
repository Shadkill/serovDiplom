const express = require('express');

const router  =express.Router();

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const User = require('../models/user.model');
const authenticationToken = require('../middlewear/middlewear');
const upload = multer({storage});

router.post('/updateProfile', authenticationToken(), upload.single('avatar'), async (req, res) => {
    try {
        const {name, surname,login,categories } = req.body;
        if(!req.file){
            const user = await User.findByIdAndUpdate(req.user.id,{
                name,
                surname,
                login,
                category: categories
            });
           return res.status(200).json({message: 'Профиль успешно изменен'});
        }
        const avatar = req.file.path;
        const user = await User.findByIdAndUpdate(req.user.id,{
            name,
            surname,
            login,
            avatar,
            category: categories
        });
        return res.status(200).json({message: 'Профиль успешно изменен'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

module.exports = router;