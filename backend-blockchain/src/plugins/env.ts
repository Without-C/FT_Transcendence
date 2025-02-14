import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin'
import fastifyEnv from '@fastify/env';

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            AMQP_URL: string
        };
    }
}

const schema = {
    type: 'object',
    required: ['AMQP_URL'],
    properties: {
        AMQP_URL: {
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
