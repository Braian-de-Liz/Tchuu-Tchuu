// Arquivo: ../javascript/graficoSensores.js

// Instâncias globais para controlar os gráficos (destruir antes de atualizar)
let chartHistorico = null;
let chartTipos = null;
let chartStatus = null;

// URL do seu Back-end no Render
const API_BASE = 'https://tchuu-tchuu-server-chat.onrender.com/api';

// =========================================================
// 1. CARREGAR HISTÓRICO DO SENSOR (Gráfico de Linha Grande)
// =========================================================
async function carregarHistoricoSensor() {
    // Pega o ID digitado no input (ou usa 1 como padrão)
    const inputSensor = document.getElementById('input_id_sensor');
    const idSensor = inputSensor ? inputSensor.value : 1;
    
    try {
        // Busca os dados na sua API
        const response = await fetch(`${API_BASE}/historico/sensor/${idSensor}`);
        const json = await response.json();
        
        // Se der erro ou não tiver dados, apenas avisa no console
        if (json.status !== 'sucesso') {
            console.warn(`Sensor ${idSensor}:`, json.mensagem);
            return; 
        }

        const dados = json.dados;
        
        // Se o array estiver vazio, não desenha nada
        if (dados.length === 0) {
            alert("Nenhum dado encontrado para o Sensor " + idSensor);
            return;
        }

        // Prepara os dados para o Chart.js
        // Eixo X: Horário (formatado)
        const labels = dados.map(d => {
            const data = new Date(d.timestamp_leitura);
            return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        });
        
        // Eixo Y: Valores
        const valores = dados.map(d => parseFloat(d.valor));

        // Renderiza o Gráfico no Canvas 'chart-historico'
        const ctx = document.getElementById('chart-historico').getContext('2d');
        
        // Importante: Destrói o gráfico anterior para não sobrepor
        if (chartHistorico) chartHistorico.destroy();

        chartHistorico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Leituras do Sensor ID ${idSensor}`,
                    data: valores,
                    borderColor: '#4e73df', // Azul bonito
                    backgroundColor: 'rgba(78, 115, 223, 0.1)', // Fundo transparente
                    borderWidth: 3,
                    pointRadius: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#4e73df',
                    fill: true,
                    tension: 0.4 // Curva suave
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: { enabled: true }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: false, grid: { borderDash: [2] } } // Pontilhado
                }
            }
        });

    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
}


async function carregarEstatisticasAlertas() {
    const cpfUser = localStorage.getItem('usuario_cpf');
    if (!cpfUser) {
        console.warn("Usuário não logado. Gráficos de alerta não serão carregados.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/ocorrencias?cpf=${cpfUser}`);
        const json = await response.json();

        if (json.status !== 'sucesso') return;

        const ocorrencias = json.ocorrencias; 

        const listaUl = document.getElementById('lista-ultimos-alertas');
        if (listaUl) {
            listaUl.innerHTML = '';
            
            if (ocorrencias.length === 0) {
                listaUl.innerHTML = '<li>Sem alertas ativos.</li>';
            } else {
                ocorrencias.slice(0, 6).forEach(oc => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div style="display:flex; justify-content:space-between; width:100%;">
                            <span>${oc.tipo_alerta}</span>
                            <span class="tag red" style="font-size:0.8em;">${oc.valor_lido}</span>
                        </div>
                        <small style="color:#888; font-size:0.7em;">${oc.nome_sensor}</small>
                    `;
                    listaUl.appendChild(li);
                });
            }
        }


        const contagemTipos = {};
        ocorrencias.forEach(oc => {
            contagemTipos[oc.tipo_alerta] = (contagemTipos[oc.tipo_alerta] || 0) + 1;
        });

        const labelsTipos = Object.keys(contagemTipos);
        const dadosTipos = Object.values(contagemTipos);

        const ctxTipos = document.getElementById('chart-tipos-alertas').getContext('2d');
        if (chartTipos) chartTipos.destroy();

        chartTipos = new Chart(ctxTipos, {
            type: 'bar',
            data: {
                labels: labelsTipos,
                datasets: [{
                    label: 'Quantidade',
                    data: dadosTipos,
                    backgroundColor: ['#e74a3b', '#f6c23e', '#1cc88a', '#36b9cc'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { grid: { display: false } }
                }
            }
        });


        const ctxStatus = document.getElementById('chart-status-alertas').getContext('2d');
        if (chartStatus) chartStatus.destroy();

        chartStatus = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: labelsTipos,
                datasets: [{
                    data: dadosTipos,
                    backgroundColor: ['#e74a3b', '#f6c23e', '#1cc88a', '#36b9cc'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%', 
                plugins: { 
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
}


function atualizarDashboard() {
    carregarHistoricoSensor();
    carregarEstatisticasAlertas();
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(atualizarDashboard, 500);
});