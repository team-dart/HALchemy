const Game = require('./game');
const request = require('superagent');
const API_URL = 'localhost:3000/api';
const getWit = require('../lib/util/wit');


let token = '';
//ship id, mood, name
let ship = {
    mood: 100
};

let user;

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

    parseIntent(input) {
        return getWit(input)
            .then(intent => intent);
    },
        
    think(input) {
        const query = {
            intent: input,
            mood: ship.mood
        };
        console.log('QUERY:', query);
        return request
            .get(`${API_URL}/responses?intent=${query.intent}&mood=${query.mood}`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },

    deleteShip(id) {
        return request.del(`${API_URL}/ships/${id}`);
    },
    //updateLeaderboard() {}

};


const game = new Game(hal);
game.start();