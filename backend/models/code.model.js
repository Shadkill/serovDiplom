const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true
    },
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;