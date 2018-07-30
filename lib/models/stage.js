const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    number: String,
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