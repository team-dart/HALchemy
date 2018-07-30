const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe.only('Auth API', () => {

    beforeEach(() => dropCollection('users'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'joe blow',
                password: 'abc'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
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
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid username or password');
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
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Username already in use');
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