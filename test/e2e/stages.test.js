const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { getToken, checkOk, save } = request;


describe('Stages API', () => {
    
    beforeEach(() => dropCollection('ships'));
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('stages'));

    
    let token;
    beforeEach(() => {
        return getToken()
            .then(_token => token = _token);
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
            .get(`/api/stages/${stage.name}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, stage);   
            });
    });

    it('updates a stage success', () => {
        stage.success++;
        return request 
            .put(`/api/stages/${stage.name}/success`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isDefined(body, stage);
            });
    });
    it('updates a stage failure', () => {
        stage.failure++;
        return request 
            .put(`/api/stages/${stage.name}/failure`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isDefined(body, stage);
            });
    });

    it('gets survival percentage', () => {
        return request
            .get('/api/stages/Asteroids/survival')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.strictEqual(body.stageSuccess, 20);
            });
    });
});