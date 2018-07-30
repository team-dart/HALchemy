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

    it('gets a ship by id', () => {
        return request
            .get(`/api/ships/${spaceTitanic._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, spaceTitanic);
            });
    });

    it('updates ship stats', () => {
        spaceTitanic.oxygen = 60;
        return request
            .put(`/api/ships/${spaceTitanic._id}`)
            .send(spaceTitanic)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, spaceTitanic);
            });
    });

    it('deletes a ship', () => {
        return request
            .delete(`/api/ships/${spaceTitanic._id}`)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/ships');
            });
    });
}); 
