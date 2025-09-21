// src/server.js
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { servidorWebSocket } from './modulos/chatServer.js';
import usuariosRoutes from './routes/resgistrarUsuarios.js';

const app = express();
const server = createServer(app);

servidorWebSocket.attachServer(server);


app.use(express.json());

app.use('/api', usuariosRoutes); 

// Inicia o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});