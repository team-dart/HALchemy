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
        return request
            .post(`${API_URL}/auth/signin`)
            .send(credentials)
            .then(({ body }) => {
                token = body.token;
                return body;
            });
    },
    think(input) {
        return request
            .get(`${API_URL}/responses?input=${input}`)
            .then(({ body }) => body.output);
    },



};


const game = new Game(hal);
game.start();