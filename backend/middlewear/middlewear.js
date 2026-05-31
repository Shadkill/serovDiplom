const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const Ban = require('../models/ban.user.model')
const User = require('../models/user.model')

const authenticationToken = (requiredRoles = []) =>{//параметр для передачи ролей
    return(req,res,next)=>{
        const authHeader = req.headers['authorization'];
        if(!authHeader){//проверяем есть ли заголовок
            return res.status(401).json({message: 'Гостевой доступ запрещён'});
        }
        const token = authHeader.split(' ')[1];//берём токен из заголовка
        if(!token){
            return res.status(401).json({message: 'Токен не найден'});
        }
        jwt.verify(token, process.env.JWT_SECRET, async(err,user)=>{
            if(err){
                return res.status(403).json({message: 'Сначала войдите в аккаунт!'});
            }
            req.user =user;//добавляем данные о пользователе в запрос


            const usere = await User.findOne({
                _id: user.id
            });
            if(!usere) return res.status(404).json({message: 'Пользователь не найден'});
            const banner = await Ban.findOne({
                email: usere.email
            });
            if(banner) return res.status(403).json({message: 'Ваш аккаунт заблокирован'});
            if(requiredRoles.length>0&&!requiredRoles.includes(user.role)){
                return res.status(403).json({message: 'Вы не имеете необходимых прав доступа'});
            }
            next();
        })
    }
}
module.exports = authenticationToken;