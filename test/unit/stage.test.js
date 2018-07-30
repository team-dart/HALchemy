const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Stage = require('../../lib/models/stage');

describe('Stage model', () => {

    it('validates a good stage model', () => {
        const data = {
            name: 'Asteroids',
            intro: 'You are approaching a dangerous asteroid belt. You could choose to avoid the asteroids, but that will take time, perhaps too much time. Do you dare navigate through the belt?'
        };

        const stage = new Stage(data);
    
        const json = stage.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(stage.validateSync());
    });

    it('validates all required fields', () => {
        const stage = new Stage({});
        const errors = getErrors(stage.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.intro.kind, 'required');
    
    }); 

    

});