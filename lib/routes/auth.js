const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../util/token-service');
const ensureAuth = require('../util/ensure-auth')();

// // don't need until write 'get by id'
const { HttpError } = require('../util/errors');
// // const make404 = id => new HttpError({
// //     code: 404,
// //     message: `No ship with id ${id}`
// // });

const getCredentials = body => {
    const { name, password } = body;
    delete body.password;
    return { name, password };
};

module.exports = router

    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })

    .post('/signup', ({ body }, res, next) => {
        const { name, password } = getCredentials(body);

        User.findOne({ name })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Username already in use'
                    });
                }
                const user = new User(body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.json({ token }))
            .catch(next);
    })

    .post('/signin', ({ body }, res, next) => {
        const { name, password } = getCredentials(body);

        User.findOne({ name })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid username or password'
                    });
                }
                return tokenService.sign(user);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });

