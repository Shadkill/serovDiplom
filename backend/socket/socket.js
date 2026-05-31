const socketIo = require('socket.io');
const Message = require('../models/messages.model');



const configureSocket = (httpServer) => {
    const io = socketIo(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'DELETE'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected: ' + socket.id);

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chat ${chatId}`);
        });

        socket.on('sendMessage', async ({ chatId, senderId, content }) => {
            try {
                const message = new Message({ chatId, senderId, content });
                await message.save();
                socket.to(chatId).emit('receivedMessage', message);
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('error', { message: 'Ошибка сервера' });
            }
        });

        // Add new socket event for message deletion
        socket.on('deleteMessage', async ({ messageId, chatId }) => {
            try {
                await Message.findByIdAndDelete(messageId);
                // Broadcast deletion to all users in the chat
                io.to(chatId).emit('messageDeleted', { messageId, chatId });
            } catch (error) {
                console.error('Error deleting message:', error);
                socket.emit('error', { message: 'Ошибка при удалении сообщения' });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id);
        });
    });

    return io;
};


module.exports = configureSocket; 