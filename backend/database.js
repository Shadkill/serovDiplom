const dotenv = require('dotenv');

const db = require('mongoose');

dotenv.config();
try {
    db.connect(process.env.database);
console.log('connection');
} catch (error) {
    console.error(error);
    console.log('connection error');
}
