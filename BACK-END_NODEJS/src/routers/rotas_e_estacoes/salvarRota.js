// BACK-END_NODEJS\src\routers\rotas_e_estacoes\salvarRota.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();


function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    
    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
}

router.post('/rotas', async (req, res) => {
    const { nome, descricao, estacoes: idsEstacoes } = req.body;
    
    if (!nome || !idsEstacoes || !Array.isArray(idsEstacoes) || idsEstacoes.length < 2) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Dados incompletos: nome da rota e pelo menos duas estações são obrigatórios.'
        });
    }

    for (const id of idsEstacoes) {
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'IDs das estações devem ser números inteiros positivos válidos.'
            });
        }
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token de autenticação não fornecido.'
        });
    }

    let idUsuarioLogado;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const idDoToken = decoded.id; 
        
        if (typeof idDoToken === 'string') {
            idUsuarioLogado = parseInt(idDoToken, 10);
        } else {
            idUsuarioLogado = idDoToken;
        }

        if (isNaN(idUsuarioLogado) || !idUsuarioLogado) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Token inválido: ID do usuário não é um número válido.'
            });
        }
        // ----------------------------------------------------

    } catch (erroToken) {
        console.error('Erro ao verificar token JWT:', erroToken);
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    let db;
    try {
        db = await conectar();
        await db.query('BEGIN'); 

        const placeholders = idsEstacoes.map((_, i) => `$${i + 1}`).join(', ');
        
        const queryCoords = `
            SELECT id, latitude, longitude
            FROM estacoes
            WHERE id = ANY(ARRAY[${placeholders}])
        `;
        const resultadoCoords = await db.query(queryCoords, idsEstacoes);

        if (resultadoCoords.rows.length !== idsEstacoes.length) {
            await db.query('ROLLBACK');
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Alguma das estações fornecidas não foi encontrada.'
            });
        }
        
        const coordsMap = resultadoCoords.rows.reduce((map, estacao) => {
            map[estacao.id] = estacao;
            return map;
        }, {});
        
        const estacoesOrdenadas = idsEstacoes.map(id => {
            const estacao = coordsMap[id];
            return {
                id: estacao.id,
                latitude: parseFloat(estacao.latitude),
                longitude: parseFloat(estacao.longitude)
            };
        });

        let distanciaTotalKm = 0;
        for (let i = 0; i < estacoesOrdenadas.length - 1; i++) {
            const estacao1 = estacoesOrdenadas[i];
            const estacao2 = estacoesOrdenadas[i + 1];
            
            distanciaTotalKm += calcularDistancia(
                estacao1.latitude, estacao1.longitude,
                estacao2.latitude, estacao2.longitude
            );
        }

        const velocidadeMediaKmh = 60;

        const distanciaFormatada = parseFloat(distanciaTotalKm.toFixed(2)); 
        const tempoEstimadoHoras = distanciaFormatada / velocidadeMediaKmh;
        const tempoEstimadoMinutos = Math.round(tempoEstimadoHoras * 60);

        if (isNaN(distanciaFormatada) || isNaN(tempoEstimadoMinutos)) {
            await db.query('ROLLBACK');
            console.error('Erro de Cálculo: Distância ou Tempo resultou em NaN.', { distanciaTotalKm, distanciaFormatada, tempoEstimadoMinutos });
             return res.status(400).json({
                 status: 'erro',
                 mensagem: 'Erro de cálculo. Verifique se as coordenadas das estações são válidas (latitude/longitude).'
             });
        }

        const queryInsertRota = `
            INSERT INTO rotas (nome, descricao, distancia_km, tempo_estimado_min, id_usuario_criador)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;

        const paramsRota = [nome, descricao || null, distanciaFormatada, tempoEstimadoMinutos, idUsuarioLogado];
        const resultadoRota = await db.query(queryInsertRota, paramsRota);
        const idNovaRota = resultadoRota.rows[0].id;

        const queryInsertAssoc = 'INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES ($1, $2, $3)';

        for (let i = 0; i < idsEstacoes.length; i++) {
            await db.query(queryInsertAssoc, [idNovaRota, idsEstacoes[i], i]); 
        }

        await db.query('COMMIT');

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Rota criada com sucesso!',
            id: idNovaRota
        });

        console.log(`Rota "${nome}" (ID: ${idNovaRota}) criada com sucesso pelo usuário (ID: ${idUsuarioLogado}). Distância: ${distanciaFormatada} km.`);

    } catch (erro) {
        console.error('ERRO CRÍTICO (POST /rotas) -- Detalhe do erro:', erro);
        if (db) {
            try {
                await db.query('ROLLBACK'); 
            } catch (rollbackError) {
                console.error('Erro durante ROLLBACK:', rollbackError);
            }
        }
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor ao salvar a rota.' 
        });
    } finally {
        if (db) {
            await db.end();
        }
    }
});

export default router;

/* 
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { conectar } from '../../databases/conectar_banco.js';

const router = Router();


function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    
    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
}

router.post('/rotas', async (req, res) => {
    const { nome, descricao, estacoes: idsEstacoes } = req.body;
    
    if (!nome || !idsEstacoes || !Array.isArray(idsEstacoes) || idsEstacoes.length < 2) {
        return res.status(400).json({
            status: 'erro',
            mensagem: 'Dados incompletos: nome da rota e pelo menos duas estações são obrigatórios.'
        });
    }

    for (const id of idsEstacoes) {
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'IDs das estações devem ser números inteiros positivos válidos.'
            });
        }
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token de autenticação não fornecido.'
        });
    }

    let idUsuarioLogado;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        idUsuarioLogado = decoded.id;

        if (!idUsuarioLogado) {
            return res.status(401).json({
                status: 'erro',
                mensagem: 'Token inválido: ID do usuário não encontrado no payload.'
            });
        }

    } catch (erroToken) {
        console.error('Erro ao verificar token JWT:', erroToken);
        return res.status(401).json({
            status: 'erro',
            mensagem: 'Token inválido ou expirado.'
        });
    }

    let db;
    try {
        db = await conectar();
        await db.query('BEGIN'); 

        const placeholders = idsEstacoes.map((_, i) => `$${i + 1}`).join(', ');
        
        const queryCoords = `
            SELECT id, latitude, longitude
            FROM estacoes
            WHERE id = ANY(ARRAY[${placeholders}])
        `;
        const resultadoCoords = await db.query(queryCoords, idsEstacoes);

        if (resultadoCoords.rows.length !== idsEstacoes.length) {
            await db.query('ROLLBACK');
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Alguma das estações fornecidas não foi encontrada.'
            });
        }
        
        const coordsMap = resultadoCoords.rows.reduce((map, estacao) => {
            map[estacao.id] = estacao;
            return map;
        }, {});
        
        const estacoesOrdenadas = idsEstacoes.map(id => {
            const estacao = coordsMap[id];
            return {
                id: estacao.id,
                // CRÍTICO: Garantir que latitude e longitude são strings válidas antes de parseFloat
                latitude: parseFloat(estacao.latitude),
                longitude: parseFloat(estacao.longitude)
            };
        });

        let distanciaTotalKm = 0;
        for (let i = 0; i < estacoesOrdenadas.length - 1; i++) {
            const estacao1 = estacoesOrdenadas[i];
            const estacao2 = estacoesOrdenadas[i + 1];
            
            distanciaTotalKm += calcularDistancia(
                estacao1.latitude, estacao1.longitude,
                estacao2.latitude, estacao2.longitude
            );
        }

        const velocidadeMediaKmh = 60;
        // Se distanciaTotalKm for NaN, a rota falhará.
        const distanciaFormatada = parseFloat(distanciaTotalKm.toFixed(2)); 
        const tempoEstimadoHoras = distanciaFormatada / velocidadeMediaKmh;
        const tempoEstimadoMinutos = Math.round(tempoEstimadoHoras * 60);

        // --- INÍCIO DA CORREÇÃO/VERIFICAÇÃO DE NaN ---
        if (isNaN(distanciaFormatada) || isNaN(tempoEstimadoMinutos)) {
            await db.query('ROLLBACK');
            console.error('Erro de Cálculo: Distância ou Tempo resultou em NaN.', { distanciaTotalKm, distanciaFormatada, tempoEstimadoMinutos });
             return res.status(400).json({
                 status: 'erro',
                 mensagem: 'Erro de cálculo. Verifique se as coordenadas das estações são válidas (latitude/longitude).'
             });
        }
        // --- FIM DA CORREÇÃO/VERIFICAÇÃO DE NaN ---

        const queryInsertRota = `
            INSERT INTO rotas (nome, descricao, distancia_km, tempo_estimado_min, id_usuario_criador)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;

        const paramsRota = [nome, descricao || null, distanciaFormatada, tempoEstimadoMinutos, idUsuarioLogado];
        const resultadoRota = await db.query(queryInsertRota, paramsRota);
        const idNovaRota = resultadoRota.rows[0].id;

        const queryInsertAssoc = 'INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES ($1, $2, $3)';

        for (let i = 0; i < idsEstacoes.length; i++) {
            await db.query(queryInsertAssoc, [idNovaRota, idsEstacoes[i], i]); 
        }

        await db.query('COMMIT');

        res.status(201).json({
            status: 'sucesso',
            mensagem: 'Rota criada com sucesso!',
            id: idNovaRota
        });

        console.log(`Rota "${nome}" (ID: ${idNovaRota}) criada com sucesso pelo usuário (ID: ${idUsuarioLogado}). Distância: ${distanciaFormatada} km.`);

    } catch (erro) {
        // --- MELHORIA CRÍTICA DO LOG PARA DEBUGAR NO RENDER ---
        console.error('ERRO CRÍTICO (POST /rotas) -- Detalhe do erro:', erro);
        // --------------------------------------------------------
        if (db) {
            try {
                await db.query('ROLLBACK'); 
            } catch (rollbackError) {
                // Loga se o rollback falhar, mas continua enviando o 500
                console.error('Erro durante ROLLBACK:', rollbackError);
            }
        }
        res.status(500).json({
            status: 'erro',
            // A mensagem de erro genérica permanece para o cliente
            mensagem: 'Erro interno do servidor ao salvar a rota.' 
        });
    } finally {
        if (db) {
            // Garante que a conexão seja fechada
            await db.end();
        }
    }
});

export default router;
 */