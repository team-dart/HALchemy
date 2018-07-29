const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true  
    },
    oxygen: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    lifeSupport: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    fuel: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    hal: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }, 
    payload: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    hull: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }
});

module.exports = mongoose.model('Ship', schema);