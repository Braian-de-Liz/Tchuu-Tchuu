// src/server.js
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { setupWebSocket } from './modulos/chatServer.js';
import usuariosRoutes from './routers/usuario/registrarUsuarios.js';
import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js';
import logarUsuario from './routers/usuario/loginUsuario.js';
import cadastroTREM from './routers/trens/registrar_trem.js';
import deletarTREM from "./routers/trens/deletar_trem.js";
import dotenv from 'dotenv';

dotenv.config();


const app = express();


app.use(cors());
const server = createServer(app);
const { wss } = setupWebSocket(server);


app.use(express.json());

// Rotas de Usuários;
app.use('/api', usuariosRoutes);
app.use('/api', deletarUsuariosRoutes);
app.use('/api', logarUsuario);


// Rotas de Trens (essas são rotas de API não rotas que envolvam trilhos dos trens);
app.use('/api', cadastroTREM);
app.use('/api', deletarTREM);
app.use('/api', );
app.use('/api', );


// Rotas para cadastrar sensores;
app.use('/api', );




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

const PORT = process.env.PORT || 3000;

// server;listen(PORT);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});