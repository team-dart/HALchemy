const router = require('express').Router();
const Ship = require('../models/ship');

// // don't need until write 'get by id'
// // const { HttpError } = require('../util/errors');
// // const make404 = id => new HttpError({
// //     code: 404,
// //     message: `No ship with id ${id}`
// // });

module.exports = router

    .post('/ships', (req, res, next) => {
        Ship.create(req.body)
            .then(ship => res.json(ship))
            .catch(next);
    });

