require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const APP_SECRET = process.env.APP_SECRET;

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            // because you are not stashing token, this is probably okay.
            // just be aware that tokens are generally long-lived and the user
            // might play another game and have a different ship
            ship: user.ship
        };

        return sign(payload, APP_SECRET);
    },
    verify(token) {
        return verify(token, APP_SECRET);
    }
};
