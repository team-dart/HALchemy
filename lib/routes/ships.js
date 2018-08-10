const router = require('express').Router();
const Ship = require('../models/ship');
const { HttpError } = require('../util/errors');
const { Types } = require('mongoose');
const ensureAuth = require('../util/ensure-auth')();

const make404 = id => new HttpError({
    code: 404,
    message: `No ship with id ${id}`
});

const getPipeline = type => id => ([
    { $match: { _id: Types.ObjectId(id) } },
    {
        $project: {
            _id: '$_id',
            [`${type}Status`]: { 
                [`$${type}`]: ['$oxygen', 'lifeSupport', '$fuel', '$mood', '$payload', '$shields'] 
            } 
        }     
    }
]);

const getAvg = getPipeline('avg');
const getMin = getPipeline('min');

module.exports = router

    .get('/stats/avg', ensureAuth, (req, res, next) => {
        Ship.aggregate(getAvg(req.user.ship))
            .then(avgStatus => {
                res.json(avgStatus[0]);
            })
            .catch(next);
    })

    .get('/stats/min',  ensureAuth, (req, res, next) => {
        Ship.aggregate(getMin(req.user.ship))
            .then(minStatus => {
                res.json(minStatus[0]);
            })
            .catch(next);
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

    // Is this needed?
    .delete('/', ensureAuth, (req, res, next) => {
        Ship.findByIdAndRemove(req.user.ship)
            .then(ship => res.json({ removed: !!ship }))
            .catch(next);
    });
       