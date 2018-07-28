const { assert } = require('chai');
const User = require('../../lib/models/user');

describe('User Model', () => {

    it('Verifies a good user model', () => {
        const data = {
            name: 'username',
            email: 'example@example.com',
            password: 'abc123',
            stage: 2,
            ship: 3
        };

        console.log(data);

        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password, 'password should not be set');

        user.generateHash(data.password);
        assert.isDefined(user.hash, 'hash is defined');
        assert.notEqual(user.hash, data.password, 'hash not same as password');

        assert.isUndefined(user.validateSync());

        assert.isTrue(user.comparePassword(data.password), 'compare good password');
        assert.isFalse(user.comparePassword('bad password'), 'compare bad password');
    });
});