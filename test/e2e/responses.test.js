const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Responses API', () => {

    beforeEach(() => dropCollection('responses'));

    let halResponseOne;

    function saveResponse(response) {
        return request
            .post('/api/responses')
            .send(response)
            .then(checkOk)
            .then(({ body }) => body);       
    }

    beforeEach(() => {
        return saveResponse({
            input: ['hi', 'hello', 'hey'],
            output: [{
                response: 'Greetings',
                mood: 100,
                change: -30
            },
            {
                response: 'Hey hey',
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
            continue: '2a'
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
            .get('/api/responses?input=hi&mood=100')
            .then(({ body }) => {
                assert.isDefined(body[0].output);
            });
    });

    it('gets a response by multi query', () => {
        return request
            .get('/api/responses?input=hi+hello&mood=100')
            .then(({ body }) => {
                assert.isDefined(body[0].output);
            });
    });

    it.only('parses user inputs to only keywords', () => {
        const input = 'i choose to go through the asteroids';
        const sentence = input.split(' ');
        const answer = sentence.filter(w => w.match('asteroids' || /through/));

        assert.deepEqual(answer, ['asteroid', 'through']);
    });

});
