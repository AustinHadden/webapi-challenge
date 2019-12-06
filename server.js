const express = require('express');

const projectRouter = require('./projectRouter');

const server = express();

server.use('/api/project', projectRouter);

server.get('/', (req,res) => {
    res.send('<h2>Sprint Time!</h2>');
});

module.exports = server;