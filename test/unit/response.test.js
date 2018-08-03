const { assert } = require('chai');
const Response = require('../../lib/models/response');

describe('Response model', () => {
    it('validates a good response model', () => {
        const data = {
            intent: 'stats',
            output: [{
                response: 'Greetings',
                mood: 100,
                change: -35
            }],
            continue: 'Asteroids',
            stages: ['Start']
        };

        const response = new Response(data);

        const json = response.toJSON();
        delete json._id;
        delete json.output[0]._id;
        assert.deepEqual(json, data);
        assert.isUndefined(response.validateSync());
    });
});

