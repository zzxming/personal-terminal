// server.js
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({
    dev,
});
const handle = app.getRequestHandler();

const log = require('./middleware/log');
const morgan = require('morgan');

app.prepare()
    .then(() => {
        const server = express();

        // server.use(log.netLog());
        // global.console = log;

        // server.use(morgan('short'));

        server.all('*', (req, res) => {
            handle(req, res);
        });

        server.listen(port, (err) => {
            if (err) {
                throw err;
            }
            console.info(`> Ready on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
