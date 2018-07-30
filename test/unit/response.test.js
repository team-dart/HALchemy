const { assert } = require('chai');
const Response = require('../../lib/models/response');
const { Types } = require('mongoose');
// don't need yet  const { getErrors } = require('./helpers');

describe('Response model', () => {
    it('validates a good response model', () => {
        const data = {
            input: ['hi'],
            output: [{
                response: 'Greetings',
                mood: 100,
                change: -35
            }],
            continue: '2b',
            stageId: Types.ObjectId()
        };

        const response = new Response(data);

        const json = response.toJSON();
        delete json._id;
        delete json.output[0]._id;
        assert.deepEqual(json, data);
        assert.isUndefined(response.validateSync());
    });
});

