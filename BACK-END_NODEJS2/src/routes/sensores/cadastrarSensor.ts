// BACK-END_NODEJS2\src\routes\sensores\cadastrarSensor.ts
import { FastifyPluginAsync, RouteShorthandOptions } from "fastify";


interface cadastroSensor {
    nome_sensor: string;
    tipo_sensor: string;
    nome_trem: string;
    data: string;
    cpf: string;
}


const schema_cadastrarSensor: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['nome_sensor', 'tipo_sensor', 'nome_trem', 'data', 'cpf'],
            properties: {
                nome_sensor: { type: 'string', description: 'Nome único para identificar o sensor (Ex: Motor_Temp_1).'},
                tipo_sensor: { type: 'string', description: 'Tipo de medição do sensor'},
                nome_trem: { type: 'string', description: 'Nome do trem ao qual este sensor está associado.'},
                data: { type: 'string', format: 'date-time', description: 'Data de instalação ou registro do sensor.'},
                cpf: { type: 'string', pattern: '^\\d{11}$', description: 'CPF do usuário que está registrando o sensor.'}
            },
            additionalProperties: false
        },
    }
}
const cadastrarSensor_req: FastifyPluginAsync = async (app, optios) => {

    app.post<{ Body: cadastroSensor }>("/sensores", schema_cadastrarSensor, async (request, reply) => {
        console.log("Iniciaçizando Rota Post de sensores");
        const { nome_sensor, tipo_sensor, nome_trem, data, cpf } = request.body;

        const cpfTRUE: string = cpf.replace(/[^\d]/g, '');


        try {
            const procurar_trem = await app.pg.query("SELECT id FROM trens WHERE nome_trem = $1 AND cpf_user = $2", [nome_trem, cpfTRUE]);

            if (procurar_trem.rowCount === 0) {
                console.error("Trem não encontrado ou usuário não tem permissão.");

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: `Trem '${nome_trem}' não encontrado ou você não tem permissão para cadastrar sensores nele.`
                });
            }

            const id_trem_encontrado = procurar_trem.rows[0].id;


            const existente = await app.pg.query(
                "SELECT id_sensor FROM sensores WHERE nome_sensor = $1 AND cpf_user = $2 AND id_trem = $3",
                [nome_sensor, cpfTRUE, id_trem_encontrado]
            );

            if (existente.rows.length !== 0) {
                console.error("sensor já existente para este trem e usuário");

                return reply.status(404).send({
                    status: 'erro',
                    mensagem: `Um sensor com o nome '${nome_sensor}' já está cadastrado neste trem (${nome_trem}).`
                });
            }

            await app.pg.query(
                "INSERT INTO sensores (nome_sensor, tipo_sensor, id_trem, data_registro, cpf_user) VALUES ($1, $2, $3, $4, $5)",
                [nome_sensor, tipo_sensor, id_trem_encontrado, data, cpfTRUE]
            );

            return reply.status(201).send({
                status: 'sucesso',
                mensagem: `Sensor '${nome_sensor}' cadastrado com sucesso e ligado ao trem '${nome_trem}'!`
            })
        }
        catch (erro) {
            console.error("Erro ao cadastrar", erro);

            reply.status(500).send({
                status: 'erro',
                mensagem: "Erro interno do servidor ao tentar ligar sensor ao trem."
            });
        }
    });
}

export default cadastrarSensor_req;