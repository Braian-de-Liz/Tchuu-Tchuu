// FRONT-END/javascript/scripts_gestaoRotas/estado.js

// Estados do mapa e dados
export let mapa = null;
export let estacoes = [];
export let rotas = [];
export let marcadoresEstacoes = [];
export let linhasRotas = [];

// Estados da interface
export let modoEdicao = false;
export let criandoRota = false;
export let rotaAtual = [];

// Elementos interativos
export let estacaoSelecionada = null;
export let marcadorTemporario = null;
export let linhaRotaAtual = null;