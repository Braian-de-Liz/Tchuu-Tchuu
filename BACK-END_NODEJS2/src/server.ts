// importando libs
import fastify from "fastify";
import Cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import dotenv from 'dotenv'

// importando a conexão com o banco de dados e configs
import db from './databases/conectar_banco.js'
import FastifyJWT from '@fastify/jwt';
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('A variável de ambiente JWT_SECRET não está definida.');
}
const JWT_SECRET: string = secret;


// import de usuario
import usuariosRegistro from "./routes/usuario/registrarUsuario.js";
import logar_usario from "./routes/usuario/loginUsuario.js";
import deletar_user from "./routes/usuario/deletarUsuario.js";
import alterar_user from "./routes/usuario/atualizarUsuario.js";


dotenv.config();

const app: FastifyInstance = fastify({ logger: true });

await app.register(FastifyJWT, {secret: JWT_SECRET });

await app.register(db);
await app.register(Cors, { origin: true });

await app.register(usuariosRegistro, {prefix: '/api'});
await app.register(logar_usario, {prefix: '/api'});
await app.register(deletar_user, {prefix: '/api'});
await app.register(alterar_user, {prefix: '/api'});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3250;

app.listen({ port: PORT, host: '0.0.0.0'}, () => {
    console.log(`server rodando no ${PORT}`)
});