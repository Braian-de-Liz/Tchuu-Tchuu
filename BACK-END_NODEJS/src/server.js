// src/server.js
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { setupWebSocket } from './modulos/chatServer.js';
import usuariosRoutes from './routers/usuario/registrarUsuarios.js';
import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js';
import logarUsuario from './routers/usuario/loginUsuario.js';

const app = express();


app.use(cors());
const server = createServer(app);
const { wss } = setupWebSocket(server);


app.use(express.json());

app.use('/api', usuariosRoutes);
app.use('/api', deletarUsuariosRoutes);
app.use('/api', logarUsuario);


// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );
// app.use('/api', );

app.get('/acordar', (req, res) => {
    const now = new Date().toISOString();
    res.json({ status: 'funcionando', server: 'Tchuu-Tchuu', timestamp: now });
});

const PORT = process.env.PORT || 3000;


server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});