const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const getWit = require('../../lib/util/wit');
const { Types } = require('mongoose');

describe('Responses API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('ships'));
    beforeEach(() => dropCollection('responses'));

    let halResponseOne;
    let token;

    function saveResponse(response) {
        return request
            .post('/api/responses')
            .set('Authorization', token)
            .send(response)
            .then(checkOk)
            .then(({ body }) => body);       
    }
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'joe blow',
                password: 'abc'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    beforeEach(() => {
        return saveResponse({
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
                mood: 50,
                change: -30
            }],
            continue: '2a',
            stageId: Types.ObjectId()
        })
            .then(data => {
                halResponseOne = data;
            });
    });

    it('saves a response', () => {
        assert.isOk(halResponseOne._id);
    });

    it('gets a response by query', () => {
        return request
            .get('/api/responses?intent=direct&mood=100')
            .set('Authorization', token)
            .then(({ body }) => assert.isDefined(body.output));
    });

    it.skip('uses wit.ai', () => {
        return getWit('what\'s the status report?')
            .then(data => assert.equal(data[0].value, 'stats'));
    });

});