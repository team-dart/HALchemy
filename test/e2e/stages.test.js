const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { save } = request;


describe('Stages API', () => {
    
    beforeEach(() => dropCollection('ships'));
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('stages'));

    
    let token;
    beforeEach(() => {
        return save({
            name: 'N User',
            password: '60'
        }, 'auth/signup')
            .then(body => {
                token = body.token;
            });
    });

    let stage;
    beforeEach(()  => {
        return save({
            name: 'Asteroids',
            intro: 'You are approaching a dangerous asteroid belt.',
            success: 1,
            failure: 4
        }, 'stages')
            .then(body => {
                stage = body;
            });
    });

    it('saves a stage', () => {
        assert.isOk(stage._id);
    });

    it('gets a stage by name', () => {
        return request
            .get('/api/stages/Asteroids')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, stage);   
            });
    });
});