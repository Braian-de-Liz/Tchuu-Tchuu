// src/databases/conectar_banco.js
import { Client } from 'pg';


async function conectar() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });
  
  await client.connect();
  return client;
}

export { conectar };


