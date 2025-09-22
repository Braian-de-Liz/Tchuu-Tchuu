// src/server.js
import express from 'express';
import { createServer } from 'http';
import {cors} from 'cors';
import { setupWebSocket } from './modulos/chatServer.js';
import usuariosRoutes from './routers/usuario/registrarUsuarios.js';
// import deletarUsuariosRoutes from './routers/usuario/deletarUsuarios.js';

const app = express();


app.use(cors());
const server = createServer(app);
const { wss } = setupWebSocket(server);


app.use(express.json());

app.use('/api', usuariosRoutes); 
// app.use('/api', deletarUsuariosRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});