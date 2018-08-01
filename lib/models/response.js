const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    intent: String,
    output: [{
        response: String,
        mood: Number,
        change: Number
    }],
    continue: {
        type: Schema.Types.ObjectId,
        ref: 'Stage'
    },
    stageId: [{
        type: Schema.Types.ObjectId,
        ref: 'Stage'
    }]
});

module.exports = mongoose.model('Response', schema);