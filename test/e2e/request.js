const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();
request.checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 HTTP status code');
    return res;
};

request.save = (data, path, token = '') => {
    return request
        .post(`/api/${path}`)
        .set('Authorization', token)
        .send(data)
        .then(request.checkOk)
        .then(({ body }) => body);
};

request.getToken = () => request
    .post('/api/auth/signup')
    .send({
        name: 'joe blow',
        password: 'abc'
    })
    .then(({ body }) => body.token);

after(done => server.close(done));

module.exports = request;