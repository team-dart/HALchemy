const Game = require('./game');
const request = require('superagent');
const API_URL = 'something'

let token = '';
const hal = {
    signup(credentials) {
        //POST to signup
        //POST to ship
        //return body
    },
    signin(credentials) {
        //POST to signin
        //GET ship
        //return body
    },
    think(input) {
        // return request
        //     .get()
        const response = 'HAL RESPONSE';
        return Promise.resolve({
            response
        });

    },



};


const game = new Game(hal);
game.start();