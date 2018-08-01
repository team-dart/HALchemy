const router = require('express').Router();
const Ship = require('../models/ship');
const { HttpError } = require('../util/errors');
const { Types } = require('mongoose');
const ensureAuth = require('../util/ensure-auth')();

const make404 = id => new HttpError({
    code: 404,
    message: `No ship with id ${id}`
});

module.exports = router

    .post('/', (req, res, next) => {
        Ship.create(req.body)
            .then(ship => res.json(ship))
            .catch(next);
    })

    .get('/stats/avg', ensureAuth, (req, res) => {
        Ship.aggregate([
            { $match: { _id: Types.ObjectId(req.user.ship) } },
            {
                $project: {
                    _id: '$_id',
                    avgStatus: 
                    { $avg: ['$oxygen', 'lifeSupport', '$fuel', '$mood', '$payload', '$shields'] } 
                }     
            }])
            .then(avgStatus => {
                res.json(avgStatus[0]);
            });
    })

    .get('/stats/min',  ensureAuth, (req, res) => {
        Ship.aggregate([
            { $match: { _id: Types.ObjectId(req.user.ship) } },
            {
                $project: {
                    _id: '$_id',
                    minStatus: 
                    { $min: ['$oxygen', 'lifeSupport', '$fuel', '$mood', '$payload', '$shields'] } 
                }     
            }])
            .then(minStatus => {
                res.json(minStatus[0]);
            });
    })

    .get('/', ensureAuth, (req, res, next) => {
        Ship.findById(req.user.ship)
            .lean()
            .then(ship => {
                if(!ship) {
                    next(make404(req.params.id));
                }
                else {
                    res.json(ship);
                }
            })
            .catch(next);
    })

    .put('/', ensureAuth, (req, res, next) => {
        Ship.findByIdAndUpdate(
            req.user.ship,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(ship => res.json(ship))
            .catch(next);
    })

    .delete('/', ensureAuth, (req, res, next) => {
        Ship.findByIdAndRemove(req.user.ship)
            .then(ship => res.json({ removed: !!ship }))
            .catch(next);
    });
       