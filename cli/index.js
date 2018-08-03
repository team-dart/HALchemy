const Game = require('./game');
const request = require('superagent');
// const API_URL = 'https://halchemy.herokuapp.com/api';
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
            .then(res => {
                if(res.error) return res.error;
                token = res.body.token;
                return res.body;
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

    parseIntent(input) {
        return request
            .post(`${API_URL}/responses/intent`)
            .set('Authorization', token)
            .send({ input })
            .then(({ body }) => body);
    },
    
    think(intent, mood, stage) {
        if(intent === 'stats') {
            return this.getShipStats()
                .then(({ name, oxygen, lifeSupport, fuel, shields }) => {
                    return `The ${name} has shields at ${shields}%. Our fuel is down to ${fuel}%. Oxygen levels are only at ${oxygen}%. And the power to the crew's cryopods is currently ${lifeSupport}%.`;
                });
        }
        else if(intent === 'survival rate') {
            return this.getSurvivalRate(stage)
                .then(({ stageSuccess }) => {
                    return `I calculate the odds of survival to be exactly ${stageSuccess}%.`;
                });
        }
        else {
            let response;
            return this.getResponse(intent, mood, stage)
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
    
    getResponse(intent, mood, stage) {
        return request
            .get(`${API_URL}/responses?intent=${intent}&mood=${mood}&stage=${stage}`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },

    getShipStats() {
        return request 
            .get(`${API_URL}/ships`)
            .set('Authorization', token)
            .then(({ body }) => {
                return body;
            });
    },

    getSurvivalRate(stage) {
        return request
            .get(`${API_URL}/stages/${stage}/survival`)
            .set('Authorization', token)
            .then(({ body }) => body);
    },
    
    updateStage(stage, result) {
        return request
            .put(`${API_URL}/stages/${stage}/${result}`)
            .set('Authorization', token)
            .then(({ body }) => body);
    }

};


const game = new Game(hal);
game.start();