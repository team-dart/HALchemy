const router = require('express').Router();
const Stage = require('../models/Stage');
const ensureAuth = require('../util/ensure-auth')();


module.exports = router

    .get('/:name', ensureAuth, (req, res, next) => {
        Stage.find({ name: req.params.name })
            .then(stage => res.json(stage[0]))
            .catch(next);
    })

    .post('/', (req, res, next) => {
        Stage.create(req.body)
            .then(stage => res.json(stage))
            .catch(next);
    })

    .put('/:name', ensureAuth, (req, res, next) => {
        Stage.findOneAndUpdate({ name: req.params.name },
            req.body, 
            {
                new: true,
                runValidators: true
            })
            .then(stage => res.json(stage))
            .catch(next);
    })

    .get('/:name/survival', ensureAuth, (req, res) => {
        Stage.aggregate([
            { $match: { name: req.params.name } },
            { 
                $project: {
                    _id: '$name',
                    stageSuccess:
                    { $multiply: [100, { $divide: ['$success', { $sum: ['$success', '$failure'] }] }] }
                }
            }])
            .then(stageSuccess => {
                res.json(stageSuccess[0]);
            });
    });




    