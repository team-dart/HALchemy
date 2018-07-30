const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    input: [String],
    output: [String],
    mood: Number,
    continue: Boolean
});

module.exports = mongoose.model('Response', schema);