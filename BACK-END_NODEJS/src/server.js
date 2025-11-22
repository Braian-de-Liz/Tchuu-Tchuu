// BACK-END_NODEJS\src\server.js

// libs necessárias
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

// websocket
import { setupWebSocket } from './connections/chatServer.js';
import { iniciarServidorEsp } from './connections/ESP_Server.js';


// rotas de usuário
import usuariosRegistro from './routers/usuario/registrarUsuarios.js';
import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js';
import logarUsuario from './routers/usuario/loginUsuario.js';
import atualizarUser from './routers/usuario/atualizarUsuario.js';
import { Mostrar_usuario } from './routers/usuario/mostrar_dadosUsuario.js';


// rotas de trens
import cadastroTREM from './routers/trens/registrar_trem.js';
import deletarTREM from './routers/trens/deletar_trem.js';
import atualizarTREM from './routers/trens/atualizar_trem.js';
import mostrarTREM from './routers/trens/mostrar_trem.js';


// rotas de sensores
import cadastroSensor from './routers/sensores/cadastrarSensor.js';
import alterarSensor from './routers/sensores/alterarSensor.js';
import deletarSensor from './routers/sensores/deletarSensor.js';
import exibirSensor from './routers/sensores/exibirSensor.js';


// rotas de rotas e estações
import atualizar_Rota from './routers/rotas_e_estacoes/atualizar_Rotas.js';
import obter_Rotas from './routers/rotas_e_estacoes/obterRotas.js';
import Salvar_Rota from './routers/rotas_e_estacoes/salvarRota.js';
import excluir_Rota from './routers/rotas_e_estacoes/excluirRota.js';

import atualizar_estacao from './routers/rotas_e_estacoes/atualizarPosicaoEstacao.js';
import obter_estacao from './routers/rotas_e_estacoes/obterEstacoes.js';
import Salvar_estacoes from './routers/rotas_e_estacoes/salvarEstacao.js';
import excluir_estacoes from './routers/rotas_e_estacoes/excluirEstacao.js';

// manutenção
import enviar_manutencao from './routers/trens_manutencao/enviar_manutencao.js'
import obter_manutencao from './routers/trens_manutencao/obter_manitencao.js'
import tirar_manutencao from './routers/trens_manutencao/tirar_manutencao.js'

import dotenv from 'dotenv';


const app = express();
dotenv.config();

// app.use(cors());

app.use(cors({
    origin: ['https://tchuu-tchuu-front-end.onrender.com', 'http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));

const server = createServer(app);
const { wss } = setupWebSocket(server);
iniciarServidorEsp();

app.use(express.json());



// Rotas de Usuários;
app.use('/api', usuariosRegistro);
app.use('/api', deletarUsuariosRoutes);
app.use('/api', logarUsuario);
app.use('/api', Mostrar_usuario);
app.use('/api', atualizarUser);


// Rotas de Trens 
app.use('/api', cadastroTREM);
app.use('/api', deletarTREM);
app.use('/api', mostrarTREM);
// app.use('/api', );



// Rotas para sensores;
app.use('/api', cadastroSensor);
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );



// Rotas para rotas
app.use('/api', atualizar_Rota);
app.use('/api', obter_Rotas);
app.use('/api', excluir_Rota);
app.use('/api', Salvar_Rota);

// Rotas para estações
app.use('/api', atualizar_estacao);
app.use('/api', obter_estacao);
app.use('/api', excluir_estacoes);
app.use('/api', Salvar_estacoes);

// Rotas para manutenção
app.use('/api', enviar_manutencao);
app.use('/api', obter_manutencao);
app.use('/api', tirar_manutencao);



app.get('/acordar', (req, res) => {
    const now = new Date().toISOString();
    const userAgent = req.get('User-Agent') || 'Unknown';
    console.log(`ACORDA PREGUIÇOSO, OHHHH LÁPADA SECA ${now} | IP: ${req.ip} | Elias-testador: ${userAgent}`);
    res.json({ status: 'funcionando', server: 'Tchuu-Tchuu', timestamp: now });
});





const PORT = process.env.PORT || 3250;


server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});