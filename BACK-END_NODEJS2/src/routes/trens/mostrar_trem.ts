// src/routes/trens/mostrar_trens.ts
import { FastifyPluginAsync } from "fastify";
import { autenticarJWT } from '../../hooks/autenticar_id_jwt.js';


const Mostrar_trens: FastifyPluginAsync = async (app, options) => {

    app.get("/trens", { preHandler: [autenticarJWT] }, async (request, reply) => {

        const usuarioId: string = (request.user as { id: string }).id;

        try {
            const resultado = await app.pg.query(
                `
                SELECT t.id, t.nome_trem, t.numero, t.fabricante, t.data_registro, t.created_at
                FROM trens t
                JOIN usuarios u ON t.cpf_user = u.cpf
                WHERE u.id = $1
                `,
                [usuarioId]
            );

            if (resultado.rows.length === 0) {
                console.error(`Nenhum trem encontrado para o usuário ID: ${usuarioId}`);

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Nenhum trem encontrado para este usuário.'
                });
            }

            reply.send({
                status: 'sucesso',
                mensagem: "Trens encontrados",
                trens: resultado.rows
            });
            console.log(`Trens encontrados e enviados para o usuário ID: ${usuarioId}`);
        }
        catch (erro) {
            console.error('Erro ao buscar trens do usuário:', erro);

            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor.'
            });
        }
    });
}

export default Mostrar_trens;