const express = require('express');

const app = express();

const cors = require('cors');

const path = require('path');

const dotenv = require('dotenv');

const http = require('http');
const socketIo = require('socket.io');
dotenv.config();

const db =require('./database');

const configureSocket = require('./socket/socket');

const server = http.createServer(app);

const io = configureSocket(server);


app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({extended:false}));

const auth = require('./methodPost/Authorization');
const addCategory = require('./methodPost/addCategory');
const getCategory = require('./methodGet/getCategory');
const getUser = require('./methodGet/getUser');
const addPost = require('./methodPost/addPost');
const getPost = require('./methodGet/getPosts');
const addLike = require('./methodPost/addLike');
const updateProfile = require('./methodUpdate/updateProfile');
const userByLogin = require('./methodGet/getUserByLogin');
const addFriend = require('./methodPost/addFriend');
const friendRequests = require('./methodGet/getRequests');
const friends = require('./methodGet/getFriends');
const friendDelete = require('./methodDelete/deleteFriend');
const chats = require('./methodGet/getChats');


app.use('/api', auth);
app.use('/api', addCategory);
app.use('/api', getCategory);
app.use('/api', getUser);
app.use('/api', addPost);
app.use('/api', getPost);
app.use('/api', addLike);
app.use('/api', updateProfile);
app.use('/api', userByLogin);
app.use('/api', addFriend);
app.use('/api', friendRequests);
app.use('/api', friends);
app.use('/api', friendDelete);
app.use('/api', chats);


server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})




