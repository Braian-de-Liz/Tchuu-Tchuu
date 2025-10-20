// src/server.js
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

import { setupWebSocket } from './websockets/chatServer.js';

import usuariosRegistro from './routers/usuario/registrarUsuarios.js';
import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js';
import logarUsuario from './routers/usuario/loginUsuario.js';
import atualizarUser from './routers/usuario/atualizarUsuario.js';
import { Mostrar_usuario } from './routers/usuario/mostrar_dadosUsuario.js';

import cadastroTREM from './routers/trens/registrar_trem.js';
import deletarTREM from "./routers/trens/deletar_trem.js";
import atualizarTREM from './routers/trens/atualizar_trem.js';
import mostrarTREM from './routers/trens/mostrar_trem.js'

import cadastroSensor from './routers/sensores/cadastrarSensor.js';

import dotenv from 'dotenv';



const app = express();
dotenv.config();

app.use(cors());
// app.use(cors({origin: 'https://tchuu-tchuu-front-end.onrender.com', credentials: true })); 
// ESSA ACIMA LINHA SÓ SERÁ ATIVADA COM O SISTEMA COMPLETO, MAS EM DESENVOLVIMENTO ELA ATRAPALHA

const server = createServer(app);
const { wss } = setupWebSocket(server);
app.use(express.json());



// Rotas de Usuários;
app.use('/api', usuariosRegistro);
app.use('/api', deletarUsuariosRoutes);
app.use('/api', logarUsuario);
app.use('/api', Mostrar_usuario);
app.use('/api', atualizarUser);


// Rotas de Trens 
app.use('/api', cadastroTREM);
// app.use('/api', deletarTREM);
// app.use('/api', );
// app.use('/api', );x


// Rotas para sensores;
app.use('/api', cadastroSensor);
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );




// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );



const PORT = process.env.PORT || 3250;


// para testes locais
/* server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); */



server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});