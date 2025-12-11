// importando libs
import fastify from "fastify";
import Cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import dotenv from 'dotenv'

// importando a conexão com o banco de dados e configs
import pg from './databases/conectar_banco.js'
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
import Mostrar_usuario from "./routes/usuario/mostrar_dadosUsuario.js";

// imports de trens
import cadastroTREM from "./routes/trens/registrar_trem.js";
import deletar_trem from "./routes/trens/deletar_trem.js";
import atualizarTrem from "./routes/trens/atualizar_trem.js";
import Mostrar_trens from "./routes/trens/mostrar_trem.js";

// imports de manutenção
import enviarTrem_manu from "./routes/trens_manutencao/enviar_manutencao.js";
import tirar_trem_manu from "./routes/trens_manutencao/tirar_manutencao.js";
import obterChamadosManutencao from "./routes/trens_manutencao/obter_manutencao.js";

dotenv.config();

const app: FastifyInstance = fastify({ logger: true });

await app.register(FastifyJWT, {secret: JWT_SECRET });

await app.register(pg);
await app.register(Cors, { origin: true });

// rotas de usuarios
await app.register(usuariosRegistro, {prefix: '/api'});
await app.register(logar_usario, {prefix: '/api'});
await app.register(deletar_user, {prefix: '/api'});
await app.register(alterar_user, {prefix: '/api'});
await app.register(Mostrar_usuario, {prefix: '/api'});

// rotas de trens
await app.register(cadastroTREM, {prefix: '/api'});
await app.register(deletar_trem, {prefix: '/api'});
await app.register(atualizarTrem, {prefix: '/api'});
await app.register(Mostrar_trens, {prefix: '/api'});

// rotas de manutenção
await app.register(enviarTrem_manu, {prefix: '/api'});
await app.register(tirar_trem_manu, {prefix: '/api'});
await app.register(obterChamadosManutencao, {prefix: '/api'});


const PORT = process.env.PORT ? Number(process.env.PORT) : 3250;

app.listen({ port: PORT, host: '0.0.0.0'}, () => {
    console.log(`server rodando no ${PORT}`)
});