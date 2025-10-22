import { Router } from "express";
import jwt from "jsonwebtoken";
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();

router.get("/Trem_mostrar", async (req, res) => {

    // const { cpf_user } = req.body;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token não fornecido.'
        });
    }



    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);





        let db;
        const usuarioId = decoded.id;
        try {
            db = await conectar();

            const buscar = await db.query(`
                    SELECT t.id, t.nome_trem, t.numero, t.fabricante, t.data_registro, t.created_at
                    FROM trens t
                    JOIN usuarios u ON t.cpf_user = u.cpf
                    WHERE u.id = $1
                `, [usuarioId]);


            res.json({
                status: "sucesso",
                mensagem: "Trens encontrados"
            })
        }

        catch (erro) {
            console.error("falha ao conectar");
            return res.status(500).json({
                status: 'falha',
                mensagem: "servidor não conseguio encontrar no Banco de Dados"
            });
        }

        finally {
            db.end();
            console.log("conexão com o banco de dados foi fechada");
        }

    }
    catch (erro) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

});

export default router;