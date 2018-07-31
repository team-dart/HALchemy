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
        const mood = req.query.mood;
        const intent = req.query.intent;
        Response.aggregate([
            { $match: { intent: intent } },
            { $unwind: '$output' },
            { $match: { 'output.mood': { $gte: +mood, $lt: (+mood + 50) } } },
            { $sample: { size: 1 } }  
        ])
            .then(response => {
                res.json(response[0]);
            });
    });