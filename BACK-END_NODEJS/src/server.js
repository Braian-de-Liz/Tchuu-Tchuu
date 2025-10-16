// src/server.js
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

import { setupWebSocket } from './websockets/chatServer.js';

import usuariosRegistro from './routers/usuario/registrarUsuarios.js';
import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js';
import logarUsuario from './routers/usuario/loginUsuario.js';
import atualizarUser from './routers/usuario/atualizarUsuario.js';
import Mostrar_usuario from './routers/usuario/mostrar_dadosUsuario.js';

import cadastroTREM from './routers/trens/registrar_trem.js';
import deletarTREM from "./routers/trens/deletar_trem.js";
import atualizarTREM from './routers/trens/atualizar_trem.js';
import mostrarTREM from './routers/trens/mostrar_trem.js'

import dotenv from 'dotenv';



const app = express();
dotenv.config();

app.use(cors());
// app.use(cors({origin: 'https://tchuu-tchuu-front-end.onrender.com', credentials: true }));  // ESSA LINHA SÓ SERÁ ATIVADA COM O SISTEMA COMPLETO, MAS EM DESENVOLVIMENTO ELA ATRAPALHA

const server = createServer(app);
const { wss } = setupWebSocket(server);
app.use(express.json());



// Rotas de Usuários;
app.use('/api', usuariosRegistro);
app.use('/api', deletarUsuariosRoutes);
app.use('/api', logarUsuario);
app.use('/api', Mostrar_usuario);
app.use('/api', atualizarUser);


// Rotas de Trens (essas são rotas de API não rotas que envolvam trilhos dos trens);
app.use('/api', cadastroTREM);
// app.use('/api', deletarTREM);
// app.use('/api', );
// app.use('/api', );x


// Rotas para cadastrar sensores;
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );




// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );

app.get('/acordar', (req, res) => {
    const now = new Date().toISOString();
    const userAgent = req.get('User-Agent') || 'Unknown';
    console.log(`Elias estária orgulhoso recebido em: ${now} | IP: ${req.ip} | Elias-testador: ${userAgent}`);
    res.json({ status: 'funcionando', server: 'Tchuu-Tchuu', timestamp: now });
});

const PORT = process.env.PORT || 3250;


// para testes locais
/* server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); */


server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});