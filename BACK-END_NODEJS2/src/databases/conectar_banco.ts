// BACK-END_TYPE\src\databases\conectar_banco.ts
import fp from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres'; 
import { FastifyPluginAsync } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const conectar: FastifyPluginAsync = async (app, options) => {
    await app.register(fastifyPostgres, {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: true
        }
    });
}

export default fp(conectar);