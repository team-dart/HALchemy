const router = require('express').Router();
const Ship = require('../models/ship');
const { HttpError } = require('../util/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No ship with id ${id}`
});

