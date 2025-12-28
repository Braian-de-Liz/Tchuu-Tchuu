import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";

interface req_tremManu {
    nomeTrem: string;
    numero_de_trem: string;
    descricao_problema: string;
    descricao_detalhada: string;
    cpf_user: string;
}

const schema_registrarManutencao: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['nomeTrem','numero_de_trem','descricao_problema','descricao_detalhada','cpf_user'],
            properties: {
                nomeTrem: { type: 'string', minLength: 1 },
                numero_de_trem: { type: 'string', minLength: 1 },
                descricao_problema: { type: 'string', minLength: 1 },
                descricao_detalhada: { type: 'string', minLength: 1 },
                cpf_user: { type: 'string', pattern: '^\\d{11}$' }
            },
            additionalProperties: false
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    mensagem: { type: 'string' },
                    id: { type: 'integer' }
                }
            },
            400: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    menssagem: { type: 'string' }
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
}


const enviarTrem_manu: FastifyPluginAsync = async (app, options) => {

    app.post<{ Body: req_tremManu }>("/manutencao", schema_registrarManutencao, async (request, reply) => {

        console.log("rota post da manutenção inciada");
        const { nomeTrem, numero_de_trem, descricao_problema, descricao_detalhada, cpf_user } = request.body;
        console.log("dados recebidos do body.request");

        const cpf_correto = cpf_user.replace(/[^\d]/g, '');

        try {
            console.log("procurando trem no banco de dados");
            const procurar_trem = await app.pg.query("SELECT id, nome_trem FROM trens WHERE nome_trem = $1 AND cpf_user = $2", [nomeTrem, cpf_correto]);


            if (procurar_trem.rowCount === 0) {
                console.error("Trem não encontrado no banco dade dados");

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: 'trem não encontrado ou não existente'
                });
            }

            const trem_defeituoso = procurar_trem.rows[0];
            console.log("Trem defeituoso encontrado:", trem_defeituoso);

            const query_insert_chamado: string = `
            INSERT INTO chamados_manutencao (id_trem, nome_trem, descricao_problema, descricao_detalhada, cpf_usuario_abertura)
            VALUES ($1, $2, $3, $4, $5) RETURNING id;`;

            const params_insert: (string | number | null)[] = [
                trem_defeituoso.id,
                trem_defeituoso.nome_trem,
                descricao_problema,
                descricao_detalhada || null,
                cpf_correto
            ];

            const resultado_insert = await app.pg.query(query_insert_chamado, params_insert);
            const idNovoChamado = resultado_insert.rows[0].id;

            console.log(`Chamado de manutenção criado para o trem ID ${trem_defeituoso.id} (${trem_defeituoso.nome_trem}) pelo usuário com CPF ${cpf_correto}.`);

            return reply.status(201).send({
                status: 'sucesso',
                mensagem: 'Chamado de manutenção registrado com sucesso!',
                id: idNovoChamado
            })


        }
        catch (erro: any) {
            console.error("Erro ao enviar para manutenção" + erro);

            if (erro.code === '23503') {

                return reply.status(400).send({
                    status: 'erro',
                    menssagem: 'Erro: Trem ou usuário não encontrado no banco de dados.'
                });
            }

            return reply.status(500).send({
                status: 'erro',
                mensagem: "Erro interno do servidor"
            })

        }
    })
}

export default enviarTrem_manu;