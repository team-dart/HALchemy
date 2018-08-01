const Game = require('./game');
const request = require('superagent');
const API_URL = 'ds023418.mlab.com:23418/api';
const getWit = require('../lib/util/wit');


let token = '';



function getResponse(intent, mood) {
    return request
        .get(`${API_URL}/responses?intent=${intent}&mood=${mood}`)
        .set('Authorization', token)
        .then(({ body }) => body);
}
function getShipStats() {
    return request 
        .get(`${API_URL}/ships`)
        .set('Authorization', token)
        .then(({ body }) => {
            return body;
        });
}
function updateShipStats() {

}
function getSurvivalRate() {

}

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

    getShip() {
        return request
            .get(`${API_URL}/ships`)
            .set('Authorization', token)
            .then(({ body }) => body);
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
    getStage(stageName) {
        return request
            .get(`${API_URL}/stages/${stageName}`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },
    updateStage(stage) {
        return request
            .put(`${API_URL}/ships`)
            .set('Authorization', token)
            .send({ stage: stage });
    },
    think(intent, mood) {
        if(intent === 'stats') {
            return getShipStats();
        }
        else if(intent === 'increase shields') {
            return updateShipStats();
        }
        else if(intent === 'survival rate') {
            return getSurvivalRate();
        }
        else {
            let response;
            return getResponse(intent, mood)
                .then(body => {
                    response = body;
                    return this.updateMood(mood + body.output.change);
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