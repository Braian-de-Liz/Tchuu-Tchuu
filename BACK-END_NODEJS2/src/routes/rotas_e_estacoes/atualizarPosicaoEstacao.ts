// BACK-END_NODEJS2\src\routes\rotas_e_estacoes\atualizarPosicaoEstacao.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";
import { autenticarJWT } from "../../hooks/autenticar_id_jwt.js";

interface DecodedUser {
    id: string; 
}

interface UpdateEstacaoBody {
    nome?: string;
    endereco?: string;
    latitude?: string | number;
    longitude?: string | number;
    cidade?: string;
    estado?: string;
}

interface ParamsID {
    id: string;
}

const atualizarEstacaoOptions: RouteShorthandOptions = {
    preHandler: autenticarJWT,
}

const AtualizarEstacao: FastifyPluginAsync = async (app) => {

    app.patch<{ Params: ParamsID; Body: UpdateEstacaoBody }>("/estacoes/:id", atualizarEstacaoOptions, async (request, reply) => {
        const idEstacao = parseInt(request.params.id);
        const idUsuarioLogado = (request.user as DecodedUser).id;

        if (isNaN(idEstacao)) {
            return reply.status(400).send({ status: 'erro', mensagem: 'ID de estação inválido.' });
        }

        const { nome, endereco, latitude, longitude, cidade, estado } = request.body;

        const setClauses: string[] = [];
        const queryParams: any[] = [];
        let paramIndex = 1;

        if (nome !== undefined) {
            setClauses.push(`nome = $${paramIndex++}`);
            queryParams.push(nome);
        }
        if (endereco !== undefined) {
            setClauses.push(`endereco = $${paramIndex++}`);
            queryParams.push(endereco);
        }
        if (latitude !== undefined) {
            const lat = parseFloat(String(latitude));
            if (isNaN(lat)) return reply.status(400).send({ status: 'erro', mensagem: 'Latitude inválida.' });
            setClauses.push(`latitude = $${paramIndex++}`);
            queryParams.push(lat);
        }
        if (longitude !== undefined) {
            const lng = parseFloat(String(longitude));
            if (isNaN(lng)) return reply.status(400).send({ status: 'erro', mensagem: 'Longitude inválida.' });
            setClauses.push(`longitude = $${paramIndex++}`);
            queryParams.push(lng);
        }
        if (cidade !== undefined) {
            setClauses.push(`cidade = $${paramIndex++}`);
            queryParams.push(cidade);
        }
        if (estado !== undefined) {
            setClauses.push(`estado = $${paramIndex++}`);
            queryParams.push(estado);
        }

        if (setClauses.length === 0) {
            return reply.status(400).send({ status: 'erro', mensagem: 'Nenhum campo para atualizar fornecido.' });
        }

        setClauses.push(`data_atualizacao = NOW()`);
        
        const indexIdEstacao = paramIndex++;
        const indexIdUsuario = paramIndex;
        queryParams.push(idEstacao);
        queryParams.push(idUsuarioLogado);

        const queryUpdate = `
            UPDATE estacoes 
            SET ${setClauses.join(', ')} 
            WHERE id = $${indexIdEstacao} AND id_usuario_criador = $${indexIdUsuario}
        `;

        try {
            const resultado = await app.pg.query(queryUpdate, queryParams);

            if (resultado.rowCount === 0) {
                return reply.status(404).send({ 
                    status: 'erro', 
                    mensagem: 'Estação não encontrada ou você não tem permissão para editá-la.' 
                });
            }

            return reply.status(200).send({
                status: 'sucesso',
                mensagem: 'Estação atualizada com sucesso!',
                id: idEstacao
            });

        } catch (erro) {
            app.log.error(erro);
            return reply.status(500).send({
                status: 'erro',
                mensagem: 'Erro interno do servidor ao atualizar a estação.'
            });
        }
    });
}

export default AtualizarEstacao;