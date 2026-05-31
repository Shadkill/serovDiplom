const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    }
});

const Ban = mongoose.model('Ban', banSchema);

module.exports = Ban;