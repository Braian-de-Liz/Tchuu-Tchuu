// FRONT-END/javascript/scripts_gestaoRotas/get_estacoes.js

import { mapa, estacoes, marcadoresEstacoes, modoEdicao, estacaoSelecionada, criandoRota, rotaAtual } from './estado.js';
import { atualizarStatus } from './post_estacao.js'; // Importa função de atualizar status

// Supondo que 'mapa' seja uma variável exportada de 'estado.js' como 'let mapa = null;'
import { mapa } from './estado.js'; // Certifique-se de que 'mapa' é 'let', não 'const'

let mapaInstanciado = false; // Variável para controlar se o mapa já foi criado

export function inicializarMapa() {
    // 1. Verifica se o mapa já foi instanciado
    if (mapaInstanciado && mapa) {
        console.warn("O mapa já foi inicializado. Ignorando chamada duplicada.");
        // Opcional: Tentar destruir o mapa antigo e criar um novo
        // if (mapa.remove) mapa.remove(); // Destroi o mapa anterior
        // mapaInstanciado = false; // Reseta a flag
        return; // Sai da função se já foi inicializado
    }

    const centroLat = -14.2350;
    const centroLng = -51.9253;

    // 2. Cria o mapa e atribui à variável global
    // Atribui o mapa à variável exportada (necessário que 'mapa' seja 'let' em estado.js)
    window.mapa = L.map('map').setView([centroLat, centroLng], 5);
    mapa = L.map('map').setView([centroLat, centroLng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Marca como instanciado
    mapaInstanciado = true;

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

// ... (restante das funções como renderizarEstacoes, renderizarRotas, etc) ...