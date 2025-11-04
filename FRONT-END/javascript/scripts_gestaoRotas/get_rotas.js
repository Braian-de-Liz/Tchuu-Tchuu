// FRONT-END/javascript/scripts_gestaoRotas/get_rotas.js

import { mapa, rotas, linhasRotas, criandoRota, rotaAtual } from './estado.js';
import { atualizarStatus } from './post_estacao.js'; // Importa função de atualizar status

// Função para carregar rotas da API
export async function carregarRotas() {
    try {
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/rotas');
        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }
        const dados = await resposta.json();
        rotas.splice(0, rotas.length, ...dados); // Atualiza a lista de rotas
        renderizarRotas();
        atualizarStatus("Rotas carregadas com sucesso");
    } catch (erro) {
        console.error('Erro ao carregar rotas:', erro);
        atualizarStatus("Erro ao carregar rotas");
    }
}

// Função para renderizar rotas no mapa e na lista
export function renderizarRotas() {
    // Limpar linhas de rotas existentes do mapa
    linhasRotas.forEach(line => mapa.removeLayer(line));
    linhasRotas.length = 0; // Limpa o array

    // Limpar lista de rotas (ex: no sidebar)
    const container = document.getElementById('routes-container');
    if (container) {
        container.innerHTML = '';
    }

    rotas.forEach(rota => {
        const coordenadas = rota.estacoes.map(estacao => [estacao.latitude, estacao.longitude]);

        if (coordenadas.length > 1) {
            const linha = L.polyline(coordenadas, {
                color: '#333',
                weight: 6,
                opacity: 0.8,
                dashArray: '10, 10'
            }).addTo(mapa);

            const linhaSombra = L.polyline(coordenadas, {
                color: '#e74c3c',
                weight: 8,
                opacity: 0.3
            }).addTo(mapa);

            linha.bindPopup(`
                <div>
                    <h3>${rota.nome}</h3>
                    <p>Distância: ${rota.distancia_km} km</p>
                    <p>Tempo estimado: ${rota.tempo_estimado_min} min</p>
                    <p>Estações: ${rota.estacoes.length}</p>
                    <button onclick="excluirRota(${rota.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir Rota</button>
                </div>
            `);

            linhasRotas.push(linha);
            linhasRotas.push(linhaSombra);

            // Adicionar à lista lateral (se existir)
            if (container) {
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

                itemRota.addEventListener('click', function() {
                    if (coordenadas.length > 0) {
                        mapa.fitBounds(coordenadas);
                    }
                });

                container.appendChild(itemRota);
            }
        }
    });
}