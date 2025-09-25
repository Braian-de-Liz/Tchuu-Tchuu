// src/databases/conectar_banco.js
import { Client } from 'pg';

/* async function conectar() {
    const client = new Client({
        host: 'ep-cold-tooth-adchk7yu-pooler.c-2.us-east-1.aws.neon.tech',
        port: 5432,
        user: 'neondb_owner',
        password: 'npg_r0Yi2UftQKbG',
        database: 'neondb',
        ssl: { rejectUnauthorized: true }
    });

    await client.connect();
    return client;
}

export { conectar };





import { Client } from 'pg'; */

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
