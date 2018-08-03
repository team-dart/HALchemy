const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { getToken, checkOk } = request;

describe('Auth API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('ships'));


    let token;
    beforeEach(() => {
        return getToken()
            .then(_token => token = _token);
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });


    it('verifies a token', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('can sign in a user', () => {
        return request
            .post('/api/auth/signin')
            .send({
                name: 'joe blow',
                password: 'abc'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('fails on wrong password', () => {
        return request
            .post('/api/auth/signin')
            .send({
                name: 'joe blow',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'I do not recognize those credentials. Please try again.');
            });
    });

    it('cannot signup with same name', () => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'joe blow',
                password: 'abc'
            })
            .then(res => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'I\'m sorry, but that username already in use.');
            });        
    });

    // it('Gives 401 on bad username signin', () => {
    //     return request
    //         .post('/api/auth/signin')
    //         .send({
    //             email: 'joe blow',
    //             password: 'abc'
    //         })
    //         .then(res => {
    //             assert.equal(res.status, 401);
    //             assert.equal(res.body.error, 'Invalid name or password');
    //         });
    // });
    
});