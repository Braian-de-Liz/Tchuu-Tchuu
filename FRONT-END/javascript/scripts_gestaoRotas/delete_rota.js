// FRONT-END/javascript/scripts_gestaoRotas/delete_estacao.js

import { estacoes, rotas, marcadoresEstacoes, linhasRotas } from './estado.js';
import { carregarEstacoes } from './get_estacoes.js'; // Importa função para recarregar estações
import { carregarRotas } from './get_rotas.js';       // Importa função para recarregar rotas
import { atualizarStatus } from './post_estacao.js';  // Importa função de atualizar status

// Função para excluir uma estação via API
export async function excluirEstacao(idEstacao) {
    if (!confirm(`Tem certeza que deseja excluir a estação com ID ${idEstacao}?`)) {
        return; // Sai se o usuário cancelar
    }

    try {
        const resposta = await fetch(`https://tchuu-tchuu-server-chat.onrender.com/api/estacao/${idEstacao}`, {
            method: 'DELETE',
            headers: {
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Se for necessário enviar token
            }
        });

        if (resposta.ok) {
            atualizarStatus(`Estação com ID ${idEstacao} excluída com sucesso.`);
            carregarEstacoes(); // Recarrega a lista de estações
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
        const resposta = await fetch(`https://tchuu-tchuu-server-chat.onrender.com/api/rota/${idRota}`, {
            method: 'DELETE',
            headers: {
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Se for necessário enviar token
            }
        });

        if (resposta.ok) {
            atualizarStatus(`Rota com ID ${idRota} excluída com sucesso.`);
            carregarRotas(); // Recarrega a lista de rotas
        } else {
            const erro = await resposta.json();
            atualizarStatus(`Erro ao excluir rota: ${erro.mensagem}`);
        }
    } catch (erro) {
        console.error("Erro na requisição para excluir rota:", erro);
        atualizarStatus("Erro de rede ou servidor ao excluir rota.");
    }
}