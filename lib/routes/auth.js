const router = require('express').Router();
const User = require('../models/user');

// // don't need until write 'get by id'
// // const { HttpError } = require('../util/errors');
// // const make404 = id => new HttpError({
// //     code: 404,
// //     message: `No ship with id ${id}`
// // });

module.exports = router

    .post('/auth/signup', (req, res, next) => {
        
    });

