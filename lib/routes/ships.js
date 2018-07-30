const router = require('express').Router();
const Ship = require('../models/ship');
const { HttpError } = require('../util/errors');

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

    .get('/:id', (req, res, next) => {
        Ship.findById(req.params.id)
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

    .put('/:id', (req, res, next) => {
        Ship.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(ship => res.json(ship))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Ship.findByIdAndRemove(req.params.id)
            .then(ship => res.json({ removed: !!ship }))
            .catch(next);
    });
       