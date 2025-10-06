// src/server.js
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { setupWebSocket } from './modulos/chatServer.js';

import usuariosRegistro from './routers/usuario/registrarUsuarios.js';
import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js';
import logarUsuario from './routers/usuario/loginUsuario.js';
import atualizarUser from './routers/usuario/atualizarUsuario.js';
import Mostrar_usuario from './routers/usuario/mostrar_dadosUsuario.js';

import deletarTREM from "./routers/trens/deletar_trem.js";
import cadastroTREM from './routers/trens/registrar_trem.js';

import dotenv from 'dotenv';



const app = express();
dotenv.config();
app.use(cors());
const server = createServer(app);
const { wss } = setupWebSocket(server);
app.use(express.json());



// Rotas de Usuários;
app.use('/api', usuariosRegistro);
app.use('/api', deletarUsuariosRoutes);
app.use('/api', logarUsuario);


// Rotas de Trens (essas são rotas de API não rotas que envolvam trilhos dos trens);
app.use('/api', cadastroTREM);
// app.use('/api', deletarTREM);
// app.use('/api', );
// app.use('/api', );


// Rotas para cadastrar sensores;
// app.use('/api', );




// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );

app.get('/acordar', (req, res) => {
    const now = new Date().toISOString();
    res.json({ status: 'funcionando', server: 'Tchuu-Tchuu', timestamp: now });
    console.log("elias");
});

const PORT = process.env.PORT || 3250;


// para testes locais
/* server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); */


server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});