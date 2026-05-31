const express = require('express');

const router = express.Router();

const Category = require('../models/category.model');
const authenticationToken = require('../middlewear/middlewear');


router.get('/category', async(req,res) =>{
    try{
        const categories = await Category.find();
        res.json(categories);
    }catch(err){
       console.log(err);
       res.status(500).json({message: 'Ошибка сервера'});
    }
});
router.put('/updateCategory/:id', authenticationToken(['admin']), async(req, res) =>{
    try{
        const {name} = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, {name: name}, {new: true});
        res.json(category);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.delete('/deleteCategory/:id', authenticationToken(['admin']), async(req, res) =>{
    try{
        const category = await Category.findByIdAndDelete(req.params.id);
        if(!category)
            return res.status(404).json({message: 'Категория не найдена'});
        res.json({message: 'Категория удалена'});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Ошибка сервера'});
    }
})

module.exports = router;