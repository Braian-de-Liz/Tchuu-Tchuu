// BACK-END_NODEJS2\src\hooks\autenticar_id_jwt.ts
import { FastifyReply, FastifyRequest } from 'fastify';


async function autenticarJWT(request: FastifyRequest, reply: FastifyReply) {

    try {
        await (request as any).jwtVerify();
    }
    catch (erro) {
        return reply.status(401).send({
            status: 'erro',
            mensagem: 'Não autorizado. Token inválido ou ausente.'
        });
    }
}

export { autenticarJWT }