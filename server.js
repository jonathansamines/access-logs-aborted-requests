'use strict';

const express = require('express');
const pino = require('pino-http');
const morgan = require('morgan');

const app = express();

app.use(pino());
app.use(morgan());

app.use('/delayed', (req, res) => {
    setTimeout(() => {
        res
            .status(500)
            .json({ message: 'fail' });
    }, 100);
});

app.use('/immediate', (req, res) => {
    res
        .status(500)
        .json({ message: 'fail' });
});

app.listen(4000);