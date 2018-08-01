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



const shipNames = ['Argo', 'Space Titanic', 'USS Swinetrek', 'The Reliant', 'Shippy McShipface', 'Space Battleship Yamato', 'Botany Bay', 'Blood Crow'];

const postShip = () => {
    const name = shipNames[Math.floor(Math.random() * shipNames.length)];
    const ship = {
        stage: 'Asteroids',
        name: name,
        oxygen: 50,
        lifeSupport: 70,
        fuel: 40,
        mood: 100,
        payload: 100,
        hull: 80
    };   
    return Ship.create(ship);
};

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })


    // TO-DO: Attach random ship, set stage to 1
    .post('/signup', ({ body }, res, next) => {
        const { name, password } = getCredentials(body);
        let ship;

        User.findOne({ name })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Username already in use'
                    });
                }
                return postShip();
            })
            .then(savedShip => {
                const user = new User(body);
                ship = savedShip;
                user.generateHash(password);
                user.ship = savedShip._id;
                return user.save();
            })
                
            .then(user => tokenService.sign(user)
            )
            .then(token => {
                res.json({ token, ship });
            })
            .catch(next);
    })

    .post('/signin', ({ body }, res, next) => {
        const { name, password } = getCredentials(body);

        User.findOne({ name })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    try {
                        throw new HttpError({
                            code: 401,
                            message: 'Invalid username or password'
                        });
                    } catch (e) {
                        console.log('I do not recognize those credentials. Please try again.');
                    }
                }
                return tokenService.sign(user);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });
