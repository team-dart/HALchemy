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
            input: ['Hi'],
            output: ['Greetings'],
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

});
