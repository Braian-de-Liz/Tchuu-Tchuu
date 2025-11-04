// FRONT-END/javascript/scripts_gestaoRotas/get_estacoes.js

import { mapa, estacoes, marcadoresEstacoes, modoEdicao, estacaoSelecionada, criandoRota, rotaAtual } from './estado.js';
import { atualizarStatus } from './post_estacao.js'; // Importa função de atualizar status

// Função para inicializar o mapa
export function inicializarMapa() {
    const centroLat = -14.2350;
    const centroLng = -51.9253;

    // Atribui o mapa à variável exportada (necessário que 'mapa' seja 'let' ou 'var' em estado.js)
    window.mapa = L.map('map').setView([centroLat, centroLng], 5);
    mapa = L.map('map').setView([centroLat, centroLng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Chama as funções para carregar os dados iniciais
    carregarEstacoes();
    carregarRotas();

    // Adiciona o evento de clique no mapa
    mapa.on('click', function(e) {
        if (modoEdicao && !marcadorTemporario && !criandoRota) {
            criarEstacaoTemporaria(e.latlng);
        }
    });
}

// Função para carregar estações da API
export async function carregarEstacoes() {
    try {
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/estacoes');
        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }
        const dados = await resposta.json();
        estacoes.splice(0, estacoes.length, ...dados); // Atualiza a lista de estações
        renderizarEstacoes();
        atualizarStatus("Estações carregadas com sucesso");
    } catch (erro) {
        console.error('Erro ao carregar estações:', erro);
        atualizarStatus("Erro ao carregar estações");
    }
}

// Função para renderizar estações no mapa e na lista
export function renderizarEstacoes() {
    // Limpar marcadores existentes do mapa
    marcadoresEstacoes.forEach(marker => mapa.removeLayer(marker));
    marcadoresEstacoes.length = 0; // Limpa o array

    // Limpar lista de estações (ex: no sidebar)
    const container = document.getElementById('stations-container');
    if (container) {
        container.innerHTML = '';
    }

    estacoes.forEach(estacao => {
        const marker = L.marker([estacao.latitude, estacao.longitude], {
            draggable: modoEdicao,
            icon: L.divIcon({
                className: 'station-marker',
                html: '<div style="background-color: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
                iconSize: [26, 26]
            })
        }).addTo(mapa);

        marker.bindPopup(`
            <div>
                <h3>${estacao.nome}</h3>
                <p>${estacao.endereco || 'Sem endereço'}</p>
                <button onclick="editarEstacao(${estacao.id})" class="btn" style="margin-top: 10px;">Editar</button>
            </div>
        `);

        if (modoEdicao) {
            marker.on('dragend', function(e) {
                const novaPos = e.target.getLatLng();
                // Chama a função para atualizar no servidor (precisa estar em outro arquivo ou ser global)
                // atualizarPosicaoEstacao(estacao.id, novaPos.lat, novaPos.lng);
            });
        }

        marker.on('click', function() {
            if (criandoRota) {
                adicionarEstacaoARota(estacao);
            } else if (modoEdicao) {
                selecionarEstacao(estacao.id);
            } else {
                mapa.setView([estacao.latitude, estacao.longitude], 10);
                marker.openPopup();
            }
        });

        marcadoresEstacoes.push(marker);

        // Adicionar à lista lateral (se existir)
        if (container) {
            const itemEstacao = document.createElement('div');
            itemEstacao.className = 'station-item';
            itemEstacao.innerHTML = `
                <strong>${estacao.nome}</strong>
                <div style="font-size: 12px; margin-top: 5px;">${estacao.endereco || ''}</div>
            `;
            itemEstacao.dataset.id = estacao.id;

            itemEstacao.addEventListener('click', function() {
                if (criandoRota) {
                    adicionarEstacaoARota(estacao);
                } else if (modoEdicao) {
                    selecionarEstacao(estacao.id);
                } else {
                    mapa.setView([estacao.latitude, estacao.longitude], 10);
                    marker.openPopup();
                }
            });

            container.appendChild(itemEstacao);
        }
    });
}