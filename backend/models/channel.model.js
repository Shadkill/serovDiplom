const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true, // Уникальный юзернейм канала (например, @my_diplom_channel)
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Создатель/владелец канала
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Массив подписчиков канала
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // Связь с твоей моделью Category (для рекомендаций)
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Ссылка на посты, которые публикуются в этом канале
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Автоматическое обновление поля updatedAt при сохранении
channelSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;