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

    it('validates all required fields', () => {
        const ship = new Ship({});
        const errors = getErrors(ship.validateSync(), 7);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.oxygen.kind, 'required');
        assert.equal(errors.lifeSupport.kind, 'required');
        assert.equal(errors.fuel.kind, 'required');
        assert.equal(errors.hal.kind, 'required');
        assert.equal(errors.payload.kind, 'required');
        assert.equal(errors.hull.kind, 'required');
    }); 

    it('validates fields that have min of 0', () => {
        const ship = new Ship({
            name: 'Shape Shipster',
            oxygen: -1,
            lifeSupport: -85, 
            fuel: -100,
            hal: -60,
            payload: -95,
            hull: -60
        });

        const errors = getErrors(ship.validateSync(), 6);
        assert.equal(errors.oxygen.kind, 'min');
        assert.equal(errors.lifeSupport.kind, 'min');
        assert.equal(errors.fuel.kind, 'min');
        assert.equal(errors.hal.kind, 'min');
        assert.equal(errors.payload.kind, 'min');
        assert.equal(errors.hull.kind, 'min');
    });

    it('validates fields that have max of 100', () => {
        const ship = new Ship({
            name: 'Shape Shipster',
            oxygen: 101,
            lifeSupport: 185, 
            fuel: 110,
            hal: 160,
            payload: 195,
            hull: 160
        });

        const errors = getErrors(ship.validateSync(), 6);
        assert.equal(errors.oxygen.kind, 'max');
        assert.equal(errors.lifeSupport.kind, 'max');
        assert.equal(errors.fuel.kind, 'max');
        assert.equal(errors.hal.kind, 'max');
        assert.equal(errors.payload.kind, 'max');
        assert.equal(errors.hull.kind, 'max');
    });

});