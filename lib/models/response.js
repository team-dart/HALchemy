const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    intent: String,
    output: [{
        response: String,
        mood: Number,
        change: Number
    }],
    continue: String,
    stages: [{
        type: String,
    }]
});

module.exports = mongoose.model('Response', schema);