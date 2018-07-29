const express = require('express');
const app = express();
// const morgan = require('morgan');

const path = require('path');
const publicDir = path.resolve(__dirname, '../public');
// app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.json());

const { handler, api404 } = require('./util/errors');

const auth = require('./routes/auth');
app.use('/api/auth', auth);

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});

app.use(handler);

module.exports = app;