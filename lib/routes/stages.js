const router = require('express').Router();
const Stage = require('../models/Stage');
const { Types } = require('mongoose');
const ensureAuth = require('../util/ensure-auth')();


module.exports = router

    .get('/:name', ensureAuth, (req, res, next) => {
        console.log('DOIN A STAGE GET');
        Stage.find({ name: req.params.name })
            .then(stage => {
                console.log('STAGE:', stage);
                res.json(stage);
            })
            .catch(next);
    });

    