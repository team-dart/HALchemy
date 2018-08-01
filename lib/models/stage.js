const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true  
    },
    intro: {
        type: String,
        required: true
    },
    success: Number,
    failure: Number
});

module.exports = mongoose.model('Stage', schema);