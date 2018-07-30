const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe.only('Responses API', () => {

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
            output: ['Greetings', 'Hello, human'],
            mood: 82,
            continue: true
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
            .get('/api/responses?input=hi')
            .then(({ body }) => {
                assert.isDefined(body[0].output);
            });

    });

});
