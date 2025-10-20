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


/* 
import mysql from 'mysql2/promise'; 

async function conectar() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || localhost,
    port: process.env.DB_PORT || 3306, 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'Saep_simulado',
  });



  return connection; 
}

export { conectar }; */
