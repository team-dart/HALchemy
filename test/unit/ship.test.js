const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Ship = require('../../lib/models/ship');

describe('Ship model', () => {

    it('validates a good ship model', () => {
        const data = {
            name: 'Space Titanic',
            oxygen: 100, 
            lifeSupport: 85, 
            fuel: 100,
            hal: 60,
            payload: 95,
            hull: 100
        };

        const ship = new Ship(data);
    
        const json = ship.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(ship.validateSync());
    });

    it('name, oxygen, lifeSupport, fuel, hal, payload, hull all required', () => {
        const ship = new Ship({});
        const errors = getErrors(ship.validateSync(), 7);
        assert.equal(errors.name.kind, 'required');
    }); 

});