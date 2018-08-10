const router = require('express').Router();
const Response  = require('../models/response');
const getWit = require('../util/wit');


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
        
        // nice use of aggregate here!
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
        return getWit(req.body.input)
            .then(intent => {
                if(!intent) res.json('unrecognized');
                else res.json(intent[0].value);
            })
            .catch(next);
    });