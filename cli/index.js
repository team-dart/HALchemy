const Game = require('./game');
const request = require('superagent');
const API_URL = 'localhost:3000/api';
const getWit = require('../lib/util/wit');

let token = '';

function getResponse(intent, mood, stage) {
    return request
        .get(`${API_URL}/responses?intent=${intent}&mood=${mood}&stage=${stage}`)
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
    return request
        .put(`${API_URL}/ships`)
        .set('Authorization', token)
        .then(({ body }) => {
            return body;
        });
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
    updateShip(ship) {
        return request
            .put(`${API_URL}/ships`)
            .set('Authorization', token)
            .send(ship)
            .then(({ body }) => body);
    },
    think(intent, mood, stage) {
        if(intent === 'stats') {
            return getShipStats()
                .then(({ name, oxygen, lifeSupport, fuel, shields }) => {
                    return `The ${name} has shields at ${shields}%. Our fuel is down to ${fuel}%. Oxygen levels are only at ${oxygen}%. And the power to the crew's cryopods is currently ${lifeSupport}%.`;
                });
        }
        else if(intent === 'increase shields') {
            return updateShipStats();
        }
        else if(intent === 'survival rate') {
            return getSurvivalRate();
        }
        else {
            let response;
            return getResponse(intent, mood, stage)
                .then(body => {
                    response = body;
                    if(response) {
                        return this.updateMood(mood + body.output.change);
                    }
                })
                .then(() => {
                    if(response) return response;
                    else return 'I\'m not sure what you mean.';
                });
        }
    },
    
    deleteShip() {
        return request
            .del(`${API_URL}/ships`)
            .set('Authorization', token);
    },
    
    updateStage(stage, result) {
        return request
            .get(`${API_URL}/stages/${stage}/${result}`)
            .set('Authorization', token)
            .then(({ body }) => body);
        
    }
    //updateLeaderboard() {}

};




const game = new Game(hal);
game.start();