const Game = require('./game');
const request = require('superagent');
const API_URL = 'localhost:3000/api';
const getWit = require('../lib/util/wit');


let token = '';
let mood;

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

    getMood() {
        return request
            .get(`${API_URL}/ships`)
            .set('Authorization', token)
            .then(({ body }) => mood = body.mood);
    },

    updateMood(mood) {
        return request
            .put(`${API_URL}/ships`)
            .set('Authorization', token)
            .send({ mood: mood })
            .then(({ body }) => mood = body.mood);
    },

    parseIntent(input) {
        return getWit(input)
            .then(intent => {
                if(!intent) return 'unrecognized';
                else return intent[0].value;
            });
    },
    updateStage(stage) {
        return request
            .put(`${API_URL}/users`)
            .set('Authorization', token)
            .send({ stage: stage })
            .then(({ body }))
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
                mood: mood
            };
            let response;
            return request
                .get(`${API_URL}/responses?intent=${query.intent}&mood=${mood}`)
                .set('Authorization', token)
                .then(({ body }) => {
                    response = body;
                    mood += body.output.change;
                    return this.updateMood(mood);
                })
                .then(() => {
                    return response;
                });
        }
    },

    deleteShip() {
        return request
            .del(`${API_URL}/ships`)
            .set('Authorization', token);
    },
    //updateLeaderboard() {}

};


const game = new Game(hal);
game.start();