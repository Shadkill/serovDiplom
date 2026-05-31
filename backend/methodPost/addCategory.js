const express = require('express');

const router = express.Router();

const Category =require('../models/category.model');
const authenticationToken = require('../middlewear/middlewear');


router.post('/createCategory',authenticationToken(['admin']), async(req,res)=>{
    const {name}= req.body;

    if(!name)
        return res.status(400).json({message: 'Введите имя категории!'});

    try {
        const category = await Category.find({
            name: name
        });
        if(category.length > 0)
            return res.status(400).json({message: 'Категория с таким именем уже существует!'});
        const newCategory = new Category({
            name: name
        });
        await newCategory.save();
        res.json({message: 'Категория создана!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

module.exports =router;