import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin'
import fastifyEnv from '@fastify/env';

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            ALLOW_CONCURRENT_GAMES: string
        };
    }
}

const schema = {
    type: 'object',
    required: ['ALLOW_CONCURRENT_GAMES'],
    properties: {
        ALLOW_CONCURRENT_GAMES: {
            type: 'boolean',
        },
    }
}

const envPlugin: FastifyPluginAsync = fp(async (fastify) => {
    await fastify.register(fastifyEnv, {
        schema: schema,
    });
}, {
    name: "env",
});

export default envPlugin;
