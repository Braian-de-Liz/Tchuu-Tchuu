// src/server.js
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { wss } from './modulos/chatServer.js';
import usuariosRoutes from './routers/usuario/registrarUsuarios.js';
// import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js'; 



const app = express();
const server = createServer(app);

wss.attachServer(server);


app.use(express.json());

app.use('/api', usuariosRoutes); 
// app.use('/api', deletarUsuariosRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});