// FRONT-END/javascript/scripts_gestaoRotas/get_rotas.js

import { mapa, rotas, linhasRotas, criandoRota, rotaAtual } from './estado.js';
import { atualizarStatus } from './post_estacao.js'; // Importa função de atualizar status
// Importa a função excluirRota se estiver em outro arquivo
// import { excluirRota } from './delete_estacao.js';

// Função para carregar rotas da API
export async function carregarRotas() {
    try {
        // CORREÇÃO: Removido espaços no final da URL
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/rotas');
        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }
        const dados = await resposta.json();
        rotas.splice(0, rotas.length, ...dados); // Atualiza a lista de rotas
        renderizarRotas(); // Chama a função para renderizar no mapa e na lista
        atualizarStatus("Rotas carregadas com sucesso");
    } catch (erro) {
        console.error('Erro ao carregar rotas:', erro);
        atualizarStatus("Erro ao carregar rotas");
    }
}

// Função para renderizar rotas no mapa e na lista lateral
export function renderizarRotas() {
    // Limpar linhas de rotas existentes do mapa
    linhasRotas.forEach(line => mapa.removeLayer(line));
    linhasRotas.length = 0; // Limpa o array

    // Limpar lista de rotas (ex: no sidebar)
    const containerLista = document.getElementById('routes-container'); // Renomeado para evitar confusão
    if (containerLista) {
        containerLista.innerHTML = '';
    }

    rotas.forEach(rota => {
        const coordenadas = rota.estacoes.map(estacao => [estacao.latitude, estacao.longitude]);

        if (coordenadas.length > 1) {
            // Criar linha da rota com estilo de trilho
            const linha = L.polyline(coordenadas, {
                color: '#333',
                weight: 6,
                opacity: 0.8,
                dashArray: '10, 10'
            }).addTo(mapa);

            // Linha de sombra para efeito de trilho
            const linhaSombra = L.polyline(coordenadas, {
                color: '#e74c3c',
                weight: 8,
                opacity: 0.3
            }).addTo(mapa);

            // Popup do polilinha
            const popupContent = `
                <div>
                    <h3>${rota.nome}</h3>
                    <p>Distância: ${rota.distancia_km} km</p>
                    <p>Tempo estimado: ${rota.tempo_estimado_min} min</p>
                    <p>Estações: ${rota.estacoes.length}</p>
                    <!-- Supondo que tu tenha uma função excluirRota em outro lugar -->
                    <!-- <button onclick="excluirRota(${rota.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir Rota</button> -->
                </div>
            `;
            linha.bindPopup(popupContent);

            // Adiciona as linhas (principal e sombra) ao array de controle
            linhasRotas.push(linha);
            linhasRotas.push(linhaSombra);

            // Adicionar à lista lateral (se existir)
            if (containerLista) { // Verifica se o container da lista existe
                const itemRota = document.createElement('div');
                itemRota.className = 'route-item';
                itemRota.innerHTML = `
                    <strong>${rota.nome}</strong>
                    <div style="font-size: 12px; margin-top: 5px;">
                        Distância: ${rota.distancia_km} km |
                        Tempo: ${Math.floor(rota.tempo_estimado_min / 60)}h ${rota.tempo_estimado_min % 60}min
                    </div>
                    <div style="font-size: 11px; margin-top: 3px;">
                        ${rota.estacoes.length} estações
                    </div>
                `;

                // CORREÇÃO: Armazenar as coordenadas da rota específica no elemento
                itemRota.dataset.coords = JSON.stringify(coordenadas);

                itemRota.addEventListener('click', function() {
                    // CORREÇÃO: Ler as coordenadas do dataset do elemento clicado
                    const coordsStr = this.getAttribute('data-coords');
                    if (coordsStr) {
                        const coords = JSON.parse(coordsStr);
                        if (coords.length > 0) {
                            mapa.fitBounds(coords);
                        }
                    }
                });

                containerLista.appendChild(itemRota); // Adiciona o item à lista
            }
        }
    });
}
