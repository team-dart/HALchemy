const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk, save } = request;


describe('Ships API', () => {
    
    beforeEach(() => dropCollection('ships'));
    beforeEach(() => dropCollection('users'));
    

    let token;
    beforeEach(() => {
        return save({
            name: 'N User',
            password: '60'
        }, 'auth/signup')
            .then(body => token = body.token);
    });

    let ship;
    beforeEach('gets a ship by id', () => {
        return request
            .get('/api/ships')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isDefined(body);
                ship = body;
            });
    });
    
    it('checks that a new user includes a ship', () => {
        assert.isDefined(ship._id);
    });

    it('gets a ship\'s average status', () => {
        return request
            .get('/api/ships/stats/avg')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.equal(body.avgStatus, 74);
            });
    });

    it('gets ship\'s lowest status value', () => {
        return request
            .get('/api/ships/stats/min')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.strictEqual(body.minStatus, 40);
            });
    });

    it('updates ship stats', () => {
        ship.oxygen = 50;
        return request
            .put('/api/ships')
            .set('Authorization', token)
            .send(ship)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, ship);
            });
    });

    it('deletes a ship', () => {
        return request
            .del('/api/ships')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });

    
});