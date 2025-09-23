/* import mysql from 'mysql2/promise';

async function conectar() {
  const conexao = await mysql.createConnection({
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });
  console.log('Conectado ao banco');
  return conexao;
}

export { conectar };


// -------------------> SEPARAÇÃO DE OPÇÕES <----------------------


import { Client } from 'pg';

async function conectar() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  await client.connect();
  return client;
}

export { conectar }; */