const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    input: [String],
    output: [{
        response: String,
        mood: Number,
        change: Number
    }],
    continue: String,
    stageId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Response', schema);