// FRONT-END/javascript/rotas_fetch.js

// Importa as funções que o script principal precisa
import { inicializarMapa } from './scripts_gestaoRotas/get_estacoes.js';
import { carregarEstacoes } from './scripts_gestaoRotas/get_estacoes.js';
import { carregarRotas } from './scripts_gestaoRotas/get_rotas.js';
import { salvarEstacao } from './scripts_gestaoRotas/post_estacao.js';
import { excluirEstacao, excluirRota } from './scripts_gestaoRotas/delete_estacao.js';
// ... outros imports que tu possa precisar ...

// Exemplo de inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página de gestão de rotas carregada.");

    // Inicializa o mapa e carrega os dados iniciais
    inicializarMapa();

    // Exemplo de listener para um botão de salvar estação (precisa ter o botão no HTML)
    const botaoSalvarEstacao = document.getElementById('btn-salvar-estacao');
    if (botaoSalvarEstacao) {
        botaoSalvarEstacao.addEventListener('click', function() {
            // Pega os dados do formulário (ex: nome, endereco, lat, lng)
            const nome = document.getElementById('station-name').value.trim();
            const endereco = document.getElementById('station-address').value.trim();
            const latitude = document.getElementById('station-lat').value.trim();
            const longitude = document.getElementById('station-lng').value.trim();

            // Validação simples
            if (!nome || !latitude || !longitude) {
                alert("Preencha pelo menos Nome, Latitude e Longitude.");
                return;
            }

            // Cria o objeto de dados
            const dadosEstacao = {
                nome: nome,
                endereco: endereco || null, // Pode ser nulo
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
                // id_usuario_criador: ... (você pode obter isso do localStorage ou de outro lugar)
            };

            // Chama a função para salvar
            salvarEstacao(dadosEstacao);
        });
    }

    // Exemplo de listener para um botão de deletar estação (precisa ter o botão no HTML)
    const botaoExcluirEstacao = document.getElementById('btn-excluir-estacao');
    if (botaoExcluirEstacao) {
        botaoExcluirEstacao.addEventListener('click', function() {
            // Pega o ID da estação a ser excluída (ex: de um campo escondido ou de um item selecionado)
            const idEstacao = document.getElementById('station-id').value; // Exemplo de onde pegar o ID

            if (idEstacao) {
                excluirEstacao(parseInt(idEstacao)); // Converte para número se for string
            } else {
                alert("Nenhuma estação selecionada para exclusão.");
            }
        });
    }

    // ... outros event listeners ...
});