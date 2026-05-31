const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Ban = require('../models/ban.user.model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const Code = require('../models/code.model');
const jwt = require('jsonwebtoken');
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
router.post('/registerCode', async(req,res)=>{
    const {name,surname,login,email,password,category, repeatPassword} = req.body;
    if(!name||!surname||!login||!email||!password||!category||!repeatPassword)
        return res.status(400).json({message: 'Введите все поля!'});
    if(password!==repeatPassword)
        return res.status(400).json({message: 'Пароли не совпадают!'});
    if(password.length<8)
        return res.status(400).json({message: 'Пароль должен быть не менее 8 символов!'});
    try {
        const bansUser = await Ban.findOne({
            email: email,
        });
        if(bansUser)
            return res.status(400).json({message: 'Вы забанены!'});

        const searchUser = await User.findOne({
            email: email,
        });
        if(searchUser)
            return res.status(400).json({message: 'Пользователь с таким email уже зарегистрирован!'});

    const codeExists = await Code.findOne({
        email: email,
    });
    if(codeExists)
        await Code.deleteMany({
        email: email,
    });

    const resetCode = Math.floor(100000 + Math.random()*900000).toString();

    const codeHash = await bcrypt.hash(resetCode, 10);
    await Code.create({
        email: email,
        code: codeHash,
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Подтверждение почты',
        text: `Ваш код для подтверждения почты: ${resetCode}`
    };
    transporter.sendMail(mailOptions, (error,info)=>{
        if (error) {
            console.error('Ошибка при отправке письма:', error);
            return res.status(500).json({ message: 'Ошибка при отправке письма' });
        }
        console.log('Письмо отправлено:', info.response);
        return res.status(200).json({message: "Код отправлен на вашу почту"});
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.post('/register', async(req,res)=>{
    const {name,surname,login,email,password,category,code} = req.body;
    if(!name||!surname||!login||!email||!password||!category||!code)
        return res.status(400).json({message: 'Введите все поля!'});
    try {
        const codeExists = await Code.findOne({
            email: email,
        });
        if(!codeExists)
            return res.status(400).json({message: 'Неверный код!'});

        const match = await bcrypt.compare(code, codeExists.code);
        if(!match)
            return res.status(400).json({message: 'Неверный код!'});

        const searchUser = await User.findOne({
            email: email,
        });
        if(searchUser)
            return res.status(400).json({message: 'Пользователь с таким email уже зарегистрирован!'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name,
            surname: surname,
            login: login,
            email: email,
            password: hashedPassword,
            category: category,
        });
        await Code.deleteOne({
            email: email,
        });
        const accessToken = jwt.sign({
            id: newUser.id,
            role: newUser.role
        },process.env.JWT_SECRET,{
            expiresIn: '8h'
        });
        return res.status(200).json({message: 'Регистрация прошла успешно!', token:accessToken,role:newUser.role});s
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
});


router.post('/loginCode', async(req,res)=>{
    const { email, password} = req.body;
    if(!email||!password)
        return res.status(400).json({message: 'Введите все поля!'});
    try {
        const bansUser = await Ban.findOne({
            email: email,
        });
        if(bansUser)
            return res.status(400).json({message: 'Вы забанены!'});
        
        const user = await User.findOne({
            email: email,
        });
        if(!user)
            return res.status(400).json({message: 'Пользователь не найден!'});
        const match = await bcrypt.compare(password, user.password);
        if(!match)
            return res.status(400).json({message: 'Неверный пароль!'});

        const resetCode = Math.floor(100000 + Math.random()*900000).toString();
        const codeExists = await Code.findOne({
            email: email,
        });
        if(codeExists)
            await Code.deleteOne({
                email: email,
            });

            const codeHash = await bcrypt.hash(resetCode, 10);
            await Code.create({
                email: email,
                code: codeHash,
            });
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Подтверждение почты',
                text: `Ваш код для подтверждения почты: ${resetCode}`
            };
            transporter.sendMail(mailOptions, (error,info)=>{
                if (error) {
                    console.error('Ошибка при отправке письма:', error);
                    return res.status(500).json({ message: 'Ошибка при отправке письма' });
                }
                console.log('Письмо отправлено:', info.response);
                return res.status(200).json({message: "Код отправлен на вашу почту"});
            })
    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
});

router.post('/login', async(req,res)=>{
    const { email, password,code} = req.body;
    if(!code||!email||!password)
        return res.status(400).json({message: 'Введите все поля!'});
    try {
        const user = await User.findOne({
            email: email,
        });
        if(!user)
            return res.status(400).json({message: 'Пользователь не найден!'});
        const match = await bcrypt.compare(password, user.password);
        if(!match)
            return res.status(400).json({message: 'Неверный пароль!'});

        const codeExists = await Code.findOne({
            email: email,
        })
        if(!codeExists)
            return res.status(400).json({message: 'Неверный код!'});

        const matchCode = await bcrypt.compare(code, codeExists.code);
        if(!matchCode)
            return res.status(400).json({message: 'Неверный код!'});
        
        await Code.deleteOne({
            email: email,
        });
        const accessToken = jwt.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET,{
            expiresIn: '8h'
        });
        return res.status(200).json({message: 'Авторизация прошла успешно!', token: accessToken, role: user.role});

    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Ошибка сервера'});
    }
});

module.exports = router;