const mongoose = require('mongoose');
const { Schema } = mongoose;

const shipNames = [
    'Argo',
    'Space Titanic',
    'USS Swinetrek',
    'The Reliant',
    'Shippy McShipface',
    'Space Battleship Yamato',
    'Botany Bay',
    'Blood Crow'
];

// put defaults in the schema!

const schema = new Schema({
    stage: {
        type: String,
        default: 'Asteroids'
    },
    name: {
        type: String,
        required: true,
        // you can use functions too!
        default() {
            return shipNames[Math.floor(Math.random() * shipNames.length)];
        }
    },
    oxygen: {
        type: Number,
        max: 100,
        required: true,
        default: 50
    },
    lifeSupport: {
        type: Number,
        max: 100,
        required: true,
        default: 70
    },
    fuel: {
        type: Number,
        max: 100,
        required: true,
        default: 40
    },
    mood: {
        type: Number,
        max: 100,
        required: true,
        default: 100
    }, 
    payload: {
        type: Number,
        max: 100,
        required: true,
        default: 100
    },
    shields: {
        type: Number,
        max: 100,
        required: true,
        default: 80
    }
});

module.exports = mongoose.model('Ship', schema);