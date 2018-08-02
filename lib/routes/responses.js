const router = require('express').Router();
const Response  = require('../models/response');
const getWit = require('../util/wit');
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

    .get('/', (req, res, next) => {

        const mood = req.query.mood;
        const intent = req.query.intent;
        const stage = req.query.stage;
        
        Response.aggregate([
            { $match: { stages: stage } },
            { $match: { intent: intent } },
            { $unwind: '$output' },
            { $match: { 'output.mood': { $gte: +mood, $lt: (+mood + 50) } } },
            { $sample: { size: 1 } }  
        ])
            .then(response => res.json(response[0]))
            .catch(next);
    })

    .post('/intent', (req, res, next) => {
        console.log('REQ.BODY,', req.body);
        return getWit(req.body.input)
            .then(intent => {
                if(!intent) res.json('unrecognized');
                else res.json(intent[0].value);
            })
            .catch(next);
    });