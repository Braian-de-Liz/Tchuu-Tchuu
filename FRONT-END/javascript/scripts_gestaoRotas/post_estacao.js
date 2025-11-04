// FRONT-END/javascript/scripts_gestaoRotas/post_estacao.js

import { mapa, marcadorTemporario, criandoRota, rotaAtual, linhaRotaAtual } from './estado.js';
import { carregarEstacoes } from './get_estacoes.js'; // Importa função para recarregar estações
// import { abrirModalEstacao, fecharModalEstacao } from './algum_modal.js'; // Se tu tiver

// Função para criar um marcador temporário no mapa
export function criarEstacaoTemporaria(latlng) {
    if (marcadorTemporario) {
        mapa.removeLayer(marcadorTemporario);
    }

    marcadorTemporario = L.marker(latlng, {
        draggable: true,
        icon: L.divIcon({
            className: 'temp-marker',
            html: '<div style="background-color: #3498db; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white;"></div>',
            iconSize: [24, 24]
        })
    }).addTo(mapa);

    // Preenche os campos de latitude e longitude no formulário (ex: no modal)
    document.getElementById('station-lat').value = latlng.lat.toFixed(6);
    document.getElementById('station-lng').value = latlng.lng.toFixed(6);

    // Supondo que tu tenha funções para abrir o modal
    // abrirModalEstacao();
}

// Função para salvar uma nova estação via API
export async function salvarEstacao(dadosEstacao) {
    // Validação
    if (!dadosEstacao.nome || !dadosEstacao.latitude || !dadosEstacao.longitude) {
        atualizarStatus("Dados incompletos para salvar estação.");
        return;
    }

    try {
        // CORREÇÃO: Removido espaços no final da URL
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/estacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Se for necessário enviar token
            },
            body: JSON.stringify(dadosEstacao)
        });

        if (resposta.ok) {
            const resultado = await resposta.json();
            atualizarStatus(`Estação "${dadosEstacao.nome}" salva com sucesso! ID: ${resultado.id}`);
            // Opcional: Atualizar a lista de estações após salvar
            carregarEstacoes(); // Chama a função importada para recarregar
            // fecharModalEstacao(); // Se tu tiver uma função pra isso
        } else {
            const erro = await resposta.json();
            atualizarStatus(`Erro ao salvar estação: ${erro.mensagem}`);
        }
    } catch (erro) {
        console.error("Erro na requisição para salvar estação:", erro);
        atualizarStatus("Erro de rede ou servidor ao salvar estação.");
    }
}

// Função para atualizar status na interface (ex: um elemento com id 'status-message')
export function atualizarStatus(mensagem) {
    const elementoStatus = document.getElementById('status-message'); // Ou o ID correto do teu elemento de status
    if (elementoStatus) {
        elementoStatus.textContent = mensagem;
    }
}
