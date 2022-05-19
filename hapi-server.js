'use strict';

const timers = require('timers/promises');
const Hapi = require('@hapi/hapi');
const Pino = require('hapi-pino');

async function main() {
    const server = new Hapi.Server({ host: '127.0.0.1', port: '4000' });
    await server.register(Pino);

    server.route({
        path: '/delayed',
        method: 'GET',
        async handler(request, h) {
            await timers.setTimeout(100);
            return h
                .response({ message: 'fail' })
                .code(500);
        }
    });

    server.route({
        path: '/immediate',
        method: 'GET',
        handler(request, h) {
            return h
                .response({ message: 'fail' })
                .code(500);
        }
    });
    
    await server.start();
}

main();