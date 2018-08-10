const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../util/token-service');
const ensureAuth = require('../util/ensure-auth')();
const Ship = require('../models/ship');

const { HttpError } = require('../util/errors');


const getCredentials = body => {
    const { name, password } = body;
    delete body.password;
    return { name, password };
};

// moved defaults to models/ship.js

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })

    .post('/signup', ({ body }, res, next) => {
        const { name, password } = getCredentials(body);
        let ship;

        User.findOne({ name })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'I\'m sorry, but that username already in use.'
                    });
                }
                return Ship.create();
            })
            .then(savedShip => {
                const user = new User(body);
                ship = savedShip;
                user.generateHash(password);
                user.ship = savedShip._id;
                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.json({ token, ship }))
            .catch(next);
    })

    .post('/signin', ({ body }, res, next) => {
        const { name, password } = getCredentials(body);

        User.findOne({ name })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'I do not recognize those credentials. Please try again.'
                    });
                }
                return tokenService.sign(user);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });
