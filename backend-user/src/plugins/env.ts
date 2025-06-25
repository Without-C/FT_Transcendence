import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin'
import fastifyEnv from '@fastify/env';

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            OAUTH_UID_42: string,
            OAUTH_REDIRECT_42: string,
            FRONTEND_URL: string,
            SECRET: string
        };
    }
}

const schema = {
    type: 'object',
    required: ['OAUTH_UID_42', 'OAUTH_REDIRECT_42', 'FRONTEND_URL', 'SECRET'],
    properties: {
        OAUTH_UID_42: {
            type: 'string'
        },
        OAUTH_REDIRECT_42: {
            type: 'string'
        },
        FRONTEND_URL: {
            type: 'string',
        },
        SECRET: {
            type: 'string',
        }
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
