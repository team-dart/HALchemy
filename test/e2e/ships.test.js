const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

let newUser;

describe.only('Ships API', () => {

    beforeEach(() => dropCollection('ships'));
    beforeEach(() => dropCollection('users'));


    function createUser(user) {
        return request
            .post('/api/auth/signup')
            .send(user)
            .then(checkOk)
            .then(({ body }) => body);
    }
    
    beforeEach(() => {
        return createUser({
            name: 'N User',
            password: '60', 
            stage: 0,
            ship: 'Space Titanic'
        })
            .then(data => {
                newUser = data;
            });
    });
    
    it('checks that a new user includes a ship', () => {
        assert.isOk(newUser.ship);
    });

    


    // it('gets a ship by id', () => {
    //     return request
    //         .get(`/api/ships/${spaceTitanic._id}`)
    //         .then(({ body }) => {
    //             assert.deepEqual(body, spaceTitanic);
    //         });
    // });

    // it('gets a ship\'s average status', () => {
    //     return request
    //         .get(`/api/ships/${spaceTitanic._id}/stats`)
    //         .then(({ body }) => {
    //             assert.equal(body.avgStatus, '92');
    //         });
    // });

    // it('gets ship\'s lowest status value', () => {
    //     return request
    //         .get(`/api/ships/${spaceTitanic._id}/min`)
    //         .then(({ body }) => {
    //             assert.equal(body.minStatus, '60');
    //         });
    // });

    // it('updates ship stats', () => {
    //     spaceTitanic.oxygen = 50;
    //     return request
    //         .put(`/api/ships/${spaceTitanic._id}`)
    //         .send(spaceTitanic)
    //         .then(checkOk)
    //         .then(({ body }) => {
    //             assert.deepEqual(body, spaceTitanic);
    //         });
    // });

    
});