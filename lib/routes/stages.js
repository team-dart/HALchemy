const router = require('express').Router();
const Stage = require('../models/stage');
const ensureAuth = require('../util/ensure-auth')();

// don't these need to be under an admin role?

module.exports = router

    // why not id?
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

    .put('/:name/success', ensureAuth, (req, res, next) => {
        Stage.findOne({ name: req.params.name })
            .then(stage => {
                // since you aleady have the model, modify and call save()

                stage.success++;
                // isn't the stage name already the name you found it by???
                stage.name = stage.name; // ?

                return stage.save();
            })
            .then(stage => {
                res.json(stage);
            })
            .catch(next);
    })

    .put('/:name/failure', ensureAuth, (req, res, next) => {
        let stage;
        Stage.findOne({ name: req.params.name })
            .then(_stage => {
                stage = _stage;
                stage.failure++;
                return stage.save();
            })
            .then(stage => {
                res.json(stage);
            })
            .catch(next);
    })

    .get('/:name/survival', ensureAuth, (req, res, next) => {
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
            })
            .catch(next);
    });




    