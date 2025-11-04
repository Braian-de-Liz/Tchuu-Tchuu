// FRONT-END/javascript/scripts_gestaoRotas/delete_estacao.js

import { estacoes, rotas, marcadoresEstacoes, linhasRotas } from './estado.js'; 
import { carregarEstacoes } from './get_estacoes.js';
import { carregarRotas } from './get_rotas.js';       
import { atualizarStatus } from './post_estacao.js';  

export async function excluirEstacao(idEstacao) {
    if (!confirm(`Tem certeza que deseja excluir a estação com ID ${idEstacao}?`)) {
        return; 
    }

    try {
        // Corrigido: URL da API Node.js
        const resposta = await fetch(`https://tchuu-tchuu-server-chat.onrender.com/api/estacao/${idEstacao}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (resposta.ok) {
            atualizarStatus(`Estação com ID ${idEstacao} excluída com sucesso.`);
            carregarEstacoes(); // Recarrega a lista de estações do servidor
            // Opcional: Remover o marcador do mapa localmente também
            // const indice = estacoes.findIndex(est => est.id === idEstacao);
            // if (indice !== -1) {
            //     const estacaoRemovida = estacoes.splice(indice, 1)[0];
            //     // Encontrar e remover o marcador correspondente no mapa
            //     const marcadorIndex = marcadoresEstacoes.findIndex(m => m.options.stationId === idEstacao); // Supondo que tu tenha setado stationId ao criar o marker
            //     if (marcadorIndex !== -1) {
            //         const marcador = marcadoresEstacoes.splice(marcadorIndex, 1)[0];
            //         mapa.removeLayer(marcador);
            //     }
            // }
        } else {
            const erro = await resposta.json();
            atualizarStatus(`Erro ao excluir estação: ${erro.mensagem}`);
        }
    } catch (erro) {
        console.error("Erro na requisição para excluir estação:", erro);
        atualizarStatus("Erro de rede ou servidor ao excluir estação.");
    }
}

// Função para excluir uma rota via API
export async function excluirRota(idRota) {
    if (!confirm(`Tem certeza que deseja excluir a rota com ID ${idRota}?`)) {
        return; // Sai se o usuário cancelar
    }

    try {
        // Corrigido: URL da API Node.js
        const resposta = await fetch(`https://tchuu-tchuu-server-chat.onrender.com/api/rota/${idRota}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Se a rota de delete no back-end exigir autenticação
            }
        });

        if (resposta.ok) {
            atualizarStatus(`Rota com ID ${idRota} excluída com sucesso.`);
            carregarRotas(); // Recarrega a lista de rotas do servidor
        } else {
            const erro = await resposta.json();
            atualizarStatus(`Erro ao excluir rota: ${erro.mensagem}`);
        }
    } catch (erro) {
        console.error("Erro na requisição para excluir rota:", erro);
        atualizarStatus("Erro de rede ou servidor ao excluir rota.");
    }
}