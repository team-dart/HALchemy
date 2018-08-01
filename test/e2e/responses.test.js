const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { save } = request;
const getWit = require('../../lib/util/wit');
const { Types } = require('mongoose');

describe.only('Responses API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('ships'));
    beforeEach(() => dropCollection('responses'));

    let halResponseOne;
    let halResponseTwo;
    let token;

    beforeEach(() => {
        return save({
            name: 'N User',
            password: '60'
        }, 'auth/signup')
            .then(body => {
                token = body.token;
            });
    });

    beforeEach(() => {
        return save({
            intent: 'direct',
            output: [{
                response: 'Onward!',
                mood: 100,
                change: -30
            },
            {
                response: 'Setting the course.',
                mood: 100,
                change: -30
            },
            {
                response: 'I hate you',
                mood: 50,
                change: -30
            },
            {
                response: 'I loathe you',
                mood: 0,
                change: -30
            }],
            continue: 'Asteroids-Direct',
            stages: ['Asteroids']
        }, 'responses', token)
            .then(data => {
                halResponseOne = data;
            });
    });
    beforeEach(() => {
        return save({
            intent: 'hi',
            output: [{
                response: 'Hello!',
                mood: 100,
                change: -30
            },
            {
                response: 'Hi.',
                mood: 50,
                change: -30
            },
            {
                response: 'Bye',
                mood: 0,
                change: -30
            }],
            stages: ['Asteroids', 'Asteroids-Direct', 'Asteroids-Avoid']
        }, 'responses', token)
            .then(data => {
                halResponseTwo = data;
            });
    });

    it('saves a response', () => {
        assert.isOk(halResponseOne._id);
        assert.equal(halResponseOne.intent, 'direct');
    });

    it('gets a response by query', () => {
        return request
            .get('/api/responses?intent=direct&mood=-20&stage=Asteroids')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isDefined(body.output);
                assert.equal(body.intent, 'direct');
            });
    });

    it.skip('uses wit.ai', () => {
        return getWit('what\'s the status report?')
            .then(data => assert.equal(data[0].value, 'stats'));
    });

});