const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    number: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        required: true  
    },
    intro: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Stage', schema);