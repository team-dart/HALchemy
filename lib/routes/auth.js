const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../util/token-service');
const ensureAuth = require('../util/ensure-auth')();
const Ship = require('../models/ship');

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

const shipNames = ['Argo', 'Space Titanic', 'USS Swinetrek', 'The Reliant', 'Shippy McShipface', 'Space Battleship Yamato', 'Botany Bay', 'Blood Crow'];

const postShip = () => {
    const name = shipNames[Math.floor(Math.random() * shipNames.length)];
    const ship = {
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
// array of names, randomize stats, create a new ship, assign name, 
module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })


    // TO-DO: Attach random ship, set stage to 1
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
                return postShip();
            })
            .then(ship => {
                const user = new User(body);
                user.generateHash(password);
                user.ship = ship._id;
                user.stage = 0;
                return user.save();
            })
                
            .then(user => tokenService.sign(user)
            )
            .then(token => {
                res.json({ token });
            })
            .catch(next);
    })


    // TO-DO: retrieve ship, and current stage
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

