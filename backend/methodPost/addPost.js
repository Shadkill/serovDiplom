const express = require('express');
const authenticationToken = require('../middlewear/middlewear');
const Channel = require('../models/channel.model')
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const Post = require('../models/post.model');
const upload = multer({storage});
router.post('/addPost', authenticationToken(),upload.single('preview'), async(req,res)=>{
    try {
        const {content, categories} = req.body;
        if(!req.file){
            return res.status(400).json({message: 'Файл не был загружен'});
        }
        if(typeof categories === 'string') {
            const categoryIds = categories.split(',').map(id => id.trim()).map(id => mongoose.Types.ObjectId(id));
            req.body.categories = categoryIds; // Преобразуем строку в массив ObjectId
        }
        const preview = req.file.path;
        if(!content||!categories){
            return res.status(400).json({message: 'Заполните все поля!'});
        }
        const newPost = new Post({
            content: content,
            category: req.body.categories,
            preview,
            author: req.user.id
        });
        await newPost.save();
        return res.status(200).json({message:'Пост добавлен!'});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
});
router.post('/channels',authenticationToken(),upload.single('avatar'), async(req,res)=>{
try {
        const { name, username, description, categories } = req.body;
        
        // ID создателя достаем из токена (обычно мидлвар авторизации записывает его в req.user)
        // Если у тебя называется по-другому (например, req.userId), поменяй здесь.
        const creatorId = req.user ? req.user.id : req.body.creatorId; 

        // 1. Валидация обязательных полей
        if (!name || !username) {
            return res.status(400).json({ message: 'Название и ссылка (@username) обязательны для заполнения' });
        }

        if (!creatorId) {
            return res.status(401).json({ message: 'Пользователь не авторизован' });
        }

        // 2. Проверяем, чистим юзернейм от знака @, если пользователь его ввел
        const cleanUsername = username.replace(/^@/, '').trim();

        // 3. Проверка на уникальность юзернейма канала
        const candidate = await Channel.findOne({ username: cleanUsername });
        if (candidate) {
            return res.status(400).json({ message: 'Канал с такой ссылкой уже существует' });
        }

        // 4. Обработка пути к аватару, если файл был загружен (multer сохраняет в req.file)
        let avatarPath = '';
        if (req.file) {
            avatarPath = req.file.path.replace(/\\/g, '/'); // Нормализуем слэши для Windows
        }

        // 5. Парсим категории. Из FormData массивы часто приходят строкой или как 'categories[]'
        let parsedCategories = [];
        if (categories) {
            parsedCategories = Array.isArray(categories) ? categories : [categories];
        } else if (req.body['categories[]']) {
            parsedCategories = Array.isArray(req.body['categories[]']) 
                ? req.body['categories[]'] 
                : [req.body['categories[]']];
        }

        // 6. Создаем новый канал
        const newChannel = new Channel({
            name: name.trim(),
            username: cleanUsername,
            description: description ? description.trim() : '',
            avatar: avatarPath,
            creatorId: creatorId,
            subscribers: [creatorId], // Создатель автоматически становится первым подписчиком
            categories: parsedCategories
        });

        // 7. Сохраняем в БД
        await newChannel.save();

        res.status(201).json({ 
            message: 'Канал успешно создан', 
            channel: newChannel 
        });

    } catch (error) {
        console.error('Ошибка при создании канала:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера при создании канала' });
    }
})

module.exports =router;