
const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe.only('Ships API', () => {

    beforeEach(() => dropCollection('ships'));

    let spaceTitanic;

    function saveShip(ship) {
        return request
            .post('/api/ships')
            .send(ship)
            .then(checkOk)
            .then(({ body }) => body);
    }

    beforeEach(() => {
        return saveShip({
            name: 'Space Titanic',
            oxygen: 100, 
            lifeSupport: 100, 
            fuel: 100,
            hal: 100,
            payload: 100,
            hull: 100
        })

            .then(data => {
                spaceTitanic = data;
            });
    });
    
    it('saves a ship', () => {
        assert.isOk(spaceTitanic._id);
    });
});