const { assert } = require('chai');
const Response = require('../../lib/models/response');
// don't need yet  const { getErrors } = require('./helpers');

describe('Response model', () => {
    it('validates a good response model', () => {
        const data = {
            input: ['Hi', 'Hello', 'Hey'],
            output: ['Greetings', 'Hello, human', 'Welcome'],
            mood: 100,
            continue: true
        };

        const response = new Response(data);

        const json = response.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(response.validateSync());
    });
});

