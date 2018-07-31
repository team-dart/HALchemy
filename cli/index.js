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
        return getWit(input);
    },
        
    think(input) {
        if(input === 'stats') {
            return request 
                .get(`${API_URL}/ships`)
                .set('Authorization', token)
                .then(({ body }) => {
                    return body;
                });

        }
        else {

            const query = {
                intent: input,
                mood: ship.mood
            };
            let response;
            return request
                .get(`${API_URL}/responses?intent=${query.intent}&mood=${query.mood}`)
                .set('Authorization', token)
                .then(({ body }) => {
                    response = body;
                    // ship.mood += body.output.change;
                    // return request
                    //     .put(`${API_URL}/ships/${ship.id}`)
                    //     .send(ship);
                    return response;
                });
                // .then(() => {
    
                //     return response;
                // });
        }
    },

    deleteShip(id) {
        return request.del(`${API_URL}/ships/${id}`);
    },
    //updateLeaderboard() {}

};


const game = new Game(hal);
game.start();