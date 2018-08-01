const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    stage: String,
    name: {
        type: String,
        required: true  
    },
    oxygen: {
        type: Number,
        max: 100,
        required: true
    },
    lifeSupport: {
        type: Number,
        max: 100,
        required: true
    },
    fuel: {
        type: Number,
        max: 100,
        required: true
    },
    mood: {
        type: Number,
        max: 100,
        required: true
    }, 
    payload: {
        type: Number,
        max: 100,
        required: true
    },
    hull: {
        type: Number,
        max: 100,
        required: true
    }
});

module.exports = mongoose.model('Ship', schema);