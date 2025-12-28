// BACK-END_NODEJS/src/routers/trens_manutencao/obter_manutencao.ts
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { autenticarJWT } from '../../hooks/autenticar_id_jwt.js'; 


interface UserPayload {
    id: number;
}


async function obterCPFFromToken(app: any, idUsuario: number): Promise<string> {
    const cpfResult = await app.pg.query('SELECT cpf FROM usuarios WHERE id = $1', [idUsuario]);

    if (cpfResult.rowCount === 0) {
        throw new Error(`Usuário com ID ${idUsuario} do token não encontrado.`); 
    }

    return cpfResult.rows[0].cpf;
}

const schema_obterManutencao = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id_chamado: { type: 'integer' },
                        id_trem: { type: 'integer' },
                        descricao_problema: { type: 'string' },
                        descricao_detalhada: { type: 'string', nullable: true },
                        nome_trem: { type: 'string' },
                        status: { type: 'string' },
                        data_inicio: { type: 'string' },
                        data_conclusao: { type: 'string', nullable: true },
                        numero: { type: 'string' },
                        fabricante: { type: 'string' }
                    }
                }
            },
            404: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
                }
            },
            500: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' }
                }
            }
        }
    }
};

// No app.get, utilize: { preHandler: [autenticarJWT], ...schema_obterManutencao }

const obterChamadosManutencao: FastifyPluginAsync = async (app, options) => {

    
    app.get("/manutencao", { preHandler: [autenticarJWT], ...schema_obterManutencao }, async (request, reply) => { 
        
        console.log("Iniciando rota GET /manutencao (Autenticada)");

        const idUsuarioLogado = (request.user as UserPayload).id; 
        
        try {
            console.log(`Buscando CPF para o ID: ${idUsuarioLogado}`);
            const cpfUsuarioLogado = await obterCPFFromToken(app, idUsuarioLogado);

            const query = `
                SELECT 
                    cm.id AS id_chamado,
                    cm.id_trem,
                    cm.descricao_problema,
                    cm.descricao_detalhada,
                    cm.nome_trem, -- Usando o campo que você adicionou!
                    cm.status,
                    cm.data_inicio,
                    cm.data_conclusao,
                    t.numero,
                    t.fabricante
                FROM chamados_manutencao cm
                JOIN trens t ON cm.id_trem = t.id
                WHERE cm.cpf_usuario_abertura = $1 
                ORDER BY cm.data_inicio DESC;
            `;
            const params = [cpfUsuarioLogado]; 

            const resultado = await app.pg.query(query, params);
            
            console.log(`Chamados de manutenção retornados para o CPF ${cpfUsuarioLogado}: ${resultado.rowCount} registros.`);
            
            return resultado.rows; 

        } catch (erro: any) {
            if (erro.message.includes("não encontrado")) {
                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'Usuário logado não encontrado ou inválido.'
                });
            }
            console.error('Erro ao obter chamados de manutenção:', erro);
            return reply.status(500).send({ 
                status: 'erro',
                mensagem: 'Erro interno do servidor ao obter os chamados de manutenção.'
            });
        }
    });
}

export default obterChamadosManutencao;