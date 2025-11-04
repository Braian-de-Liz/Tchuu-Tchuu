// FRONT-END/javascript/scripts_gestaoRotas/get_estacoes.js

import { mapa, estacoes, marcadoresEstacoes, modoEdicao, criandoRota, rotaAtual } from './estado.js';
import { atualizarStatus } from './post_estacao.js'; // Importa função de atualizar status


export function inicializarMapa() {
    const centroLat = -14.2350;
    const centroLng = -51.9253;


    mapa = L.map('map').setView([centroLat, centroLng], 5); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    
    carregarEstacoes();
    carregarRotas();

    
    mapa.on('click', function(e) {
        if (modoEdicao) {

            console.warn("Modo de edição ativado. Implemente a função criarEstacaoTemporaria.");
        }
    });
}

export async function carregarEstacoes() {
    try {
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/estacoes');
        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }
        const dados = await resposta.json();
        estacoes.splice(0, estacoes.length, ...dados); 
        renderizarEstacoes(); 
        atualizarStatus("Estações carregadas com sucesso");
    } catch (erro) {
        console.error('Erro ao carregar estações:', erro);
        atualizarStatus("Erro ao carregar estações");
    }
}

export function renderizarEstacoes() {
    marcadoresEstacoes.forEach(marker => mapa.removeLayer(marker));
    marcadoresEstacoes.length = 0; 

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

        const popupContent = `
            <div>
                <h3>${estacao.nome}</h3>
                <p>${estacao.endereco || 'Sem endereço'}</p>
                <!-- Supondo que tu tenha uma função editarEstacao em outro lugar -->
                <!-- <button onclick="editarEstacao(${estacao.id})" class="btn" style="margin-top: 10px;">Editar</button> -->
            </div>
        `;
        marker.bindPopup(popupContent);

        if (modoEdicao) {
            marker.on('dragend', function(e) {
                const novaPos = e.target.getLatLng();

                console.log(`Estação ${estacao.nome} movida para: ${novaPos.lat}, ${novaPos.lng}`);
            });
        }

        marker.on('click', function() {
            if (criandoRota) {
                console.log("Adicionando estação à rota (implementar adicionarEstacaoARota):", estacao);
            } else if (modoEdicao) {
                console.log("Selecionando estação (implementar selecionarEstacao):", estacao.id);
            } else {
                mapa.setView([estacao.latitude, estacao.longitude], 10);
                marker.openPopup(); 
            }
        });

        marcadoresEstacoes.push(marker); 

        if (container) { // Verifica se o container existe antes de tentar usá-lo
            const itemEstacao = document.createElement('div');
            itemEstacao.className = 'station-item';
            itemEstacao.innerHTML = `
                <strong>${estacao.nome}</strong>
                <div style="font-size: 12px; margin-top: 5px;">${estacao.endereco || ''}</div>
            `;
            itemEstacao.dataset.id = estacao.id; // Armazena o ID da estação no elemento

            // Evento de clique no item da lista
            itemEstacao.addEventListener('click', function() {
                if (criandoRota) {
                    // adicionarEstacaoARota(estacao); // ❌ Função não definida ainda
                    console.log("Adicionando estação à rota (via lista):", estacao);
                } else if (modoEdicao) {
                    // selecionarEstacao(estacao.id); // ❌ Função não definida ainda
                    console.log("Selecionando estação (via lista):", estacao.id);
                } else {
                    // Centraliza o mapa na estação e abre o popup do marcador correspondente
                    mapa.setView([estacao.latitude, estacao.longitude], 10);
                    marker.openPopup(); // Abre o popup do marcador associado a esta estação
                }
            });

            container.appendChild(itemEstacao); // Adiciona o item à lista
        }
    });
}

// Função para carregar rotas da API (vamos manter aqui também por enquanto)
// (Vai ser revisada no próximo item)
