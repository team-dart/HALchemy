const Game = require('./game');
const request = require('superagent');
const API_URL = 'localhost:3000/api';

let token = '';
const hal = {
    signup(credentials) {
        return request
            .post(`${API_URL}/auth/signup`)
            .send(credentials)
            .then(({ body }) => {
                token = body.token;
                return body;
            });
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