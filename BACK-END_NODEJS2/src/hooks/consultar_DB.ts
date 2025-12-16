import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';


const consulta_DB: FastifyPluginAsync = async (app, optios) => {

    async function consultar(sql: string, dados: []) {

        try {

            app.pg.query(sql, dados);

            return
        }
        catch(erro){
            
        }



    }
}


export default fp(consulta_DB);