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

request.getToken = () => request
    .post('/api/auth/signup')
    .send({
        email: 'example@example.com';
        password: 'abc123'
    })
    .then(({ body }) => body.token);

after(done => server.close(done));

module.exports = request;