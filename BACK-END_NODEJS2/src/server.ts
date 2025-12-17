// importando libs
import fastify from "fastify";
import Cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import fastifyWebsocket from '@fastify/websocket';
import dotenv from 'dotenv'

import pg from './databases/conectar_banco.js'
import FastifyJWT from '@fastify/jwt';

dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('A variável de ambiente JWT_SECRET não está definida.');
}
const JWT_SECRET: string = secret;

import chatServer from "./connections/chatServer.js";
import espServerPlugin from './connections/ESP_Server.js';


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

// imports de sensores
import cadastrarSensor_req from "./routes/sensores/cadastrarSensor.js";
import deletar_sensor from "./routes/sensores/deletarSensor.js";
import alterarSensor from "./routes/sensores/alterarSensor.js";
import listar_sensores from "./routes/sensores/exibirSensores.js";

// imports de alertas e dashboard
import getAlertas from "./routes/dash/getAlertas.js";
import dadosgraficos from "./routes/dash/dadosgraficos.js";

// imports de rotas e estacoes
import salvarEstacao from "./routes/rotas_e_estacoes/salvarEstacao.js";
import obterEstacoes from "./routes/rotas_e_estacoes/obterEstacao.js";
import excluirEstacao from "./routes/rotas_e_estacoes/excluirEstacao.js";
import AtualizarEstacao from "./routes/rotas_e_estacoes/atualizarPosicaoEstacao.js";

import salvarRota from "./routes/rotas_e_estacoes/salvarRota.js";
import OObterRotas from "./routes/rotas_e_estacoes/obterRotas.js";
import ExcluirRota from "./routes/rotas_e_estacoes/ExcluirRota.js";
import AtualizarRota from "./routes/rotas_e_estacoes/Atualizar_Rota.js";

const app: FastifyInstance = fastify({ logger: true });

await app.register(pg);
await app.register(FastifyJWT, { secret: JWT_SECRET });
await app.register(Cors, { origin: true });

await app.register(fastifyWebsocket);
await app.register(chatServer);
await app.register(espServerPlugin);


// rotas de usuarios
await app.register(usuariosRegistro, { prefix: '/api' });
await app.register(logar_usario, { prefix: '/api' });
await app.register(deletar_user, { prefix: '/api' });
await app.register(alterar_user, { prefix: '/api' });
await app.register(Mostrar_usuario, { prefix: '/api' });

// rotas de trens
await app.register(cadastroTREM, { prefix: '/api' });
await app.register(deletar_trem, { prefix: '/api' });
await app.register(atualizarTrem, { prefix: '/api' });
await app.register(Mostrar_trens, { prefix: '/api' });

// rotas de manutenção
await app.register(enviarTrem_manu, { prefix: '/api' });
await app.register(tirar_trem_manu, { prefix: '/api' });
await app.register(obterChamadosManutencao, { prefix: '/api' });

// rotas de sensores
await app.register(cadastrarSensor_req, { prefix: '/api' });
await app.register(deletar_sensor, { prefix: '/api' });
await app.register(alterarSensor, { prefix: '/api' });
await app.register(listar_sensores, { prefix: '/api' });

// rotas de Alertas e dash
await app.register(getAlertas, { prefix: '/api' });
await app.register(dadosgraficos, { prefix: '/api' });

// rotas de rotas e estações
await app.register(salvarEstacao, { prefix: '/api' });
await app.register(obterEstacoes, { prefix: '/api' });
await app.register(excluirEstacao, { prefix: '/api' });
await app.register(AtualizarEstacao, { prefix: '/api' });

await app.register(salvarRota, { prefix: '/api' });
await app.register(OObterRotas, { prefix: '/api' });
await app.register(ExcluirRota, {prefix: '/api'});
await app.register(AtualizarRota, {prefix: '/api'});


const PORT = process.env.PORT ? Number(process.env.PORT) : 3250;

app.listen({ port: PORT, host: '0.0.0.0' }, () => {
    console.log(`server rodando no ${PORT}`)
});