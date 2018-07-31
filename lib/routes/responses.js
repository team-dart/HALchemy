const router = require('express').Router();
const Response  = require('../models/response');
// const { HttpError } = require('../util/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No response with id ${id}`
// });

module.exports = router

    .post('/', (req, res, next) => {
        Response.create(req.body)
            .then(response => res.json(response))
            .catch(next); 
    })

    .get('/', (req, res) => {
        Response.aggregate([
            { $match: { intent: req.query.intent } },
            { $unwind: '$output' },
            { $match: { 'output.mood': +req.query.mood } },
            { $sample: { size: 1 } }  
        ])

            .then(response => {
                res.json(response[0]);
            });
    });