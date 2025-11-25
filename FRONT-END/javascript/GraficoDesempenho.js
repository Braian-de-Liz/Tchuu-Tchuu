document.addEventListener('DOMContentLoaded', () => {

    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado.');
        return;
    }

    // ============================================================
    // GRÁFICO 1 - Barras (Eficiência)
    // ============================================================
    new Chart(document.getElementById('chart-top').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Trem A', 'Trem B', 'Trem C', 'Trem D'],
            datasets: [{
                label: 'Eficiência (%)',
                data: [85, 92, 78, 88],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Eficiência Operacional por Trem' } }
        }
    });

    // ============================================================
    // GRÁFICO 2 - Linha (Tempo médio mensal)
    // ============================================================
    new Chart(document.getElementById('chart-line').getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [{
                label: 'Tempo Médio (min)',
                data: [42, 39, 45, 40, 38],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Tempo Médio de Viagem Mensal' } }
        }
    });

    // ============================================================
    // GRÁFICO 3 - Doughnut (Frota)
    // ============================================================
    new Chart(document.getElementById('chart-bars').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Operacional', 'Em Manutenção', 'Reserva'],
            datasets: [{
                data: [12, 3, 1],
                backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Distribuição da Frota' } }
        }
    });

    // ============================================================
    // GRÁFICO 4 - Pizza (Ocupação média)
    // ============================================================
    new Chart(document.getElementById('chart-pie').getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Baixa', 'Média', 'Alta'],
            datasets: [{
                data: [25, 50, 25],
                backgroundColor: ['#03A9F4', '#8BC34A', '#FF9800']
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Nível de Ocupação dos Trens' } }
        }
    });

    // ============================================================
    // GRÁFICO 5 - Barras Horizontais (Atrasos por linha)
    // ============================================================
    new Chart(document.getElementById('chart-hbar').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Linha 1', 'Linha 2', 'Linha 3', 'Linha 4'],
            datasets: [{
                label: 'Atrasos (min)',
                data: [12, 5, 18, 9],
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { title: { display: true, text: 'Atrasos por Linha' } }
        }
    });

    // ============================================================
    // GRÁFICO 6 - Multilinha (Comparação de desempenho)
    // ============================================================
    new Chart(document.getElementById('chart-multi-line').getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
            datasets: [
                {
                    label: 'Linha Norte',
                    data: [33, 30, 28, 26, 27],
                    borderColor: '#FF5722',
                    tension: 0.3
                },
                {
                    label: 'Linha Sul',
                    data: [40, 42, 39, 41, 38],
                    borderColor: '#3F51B5',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Comparação de Desempenho' } }
        }
    });

    // ============================================================
    // GRÁFICO 7 - DINÂMICO (atualização automática)
    // ============================================================
    const ctxDynamic = document.getElementById('chart-dynamic').getContext('2d');

    const dynamicChart = new Chart(ctxDynamic, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Velocidade Média (km/h)',
                data: [],
                borderColor: '#009688',
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Velocidade em Tempo Real (Simulada)' } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Atualização a cada 1 segundo
    setInterval(() => {
        const novoTempo = new Date().toLocaleTimeString().split(':')[2]; // segundos

        const novaVelocidade = 60 + Math.random() * 20 - 10; // variação +-10

        dynamicChart.data.labels.push(novoTempo);
        dynamicChart.data.datasets[0].data.push(novaVelocidade);

        if (dynamicChart.data.labels.length > 15) {
            dynamicChart.data.labels.shift();
            dynamicChart.data.datasets[0].data.shift();
        }

        dynamicChart.update();
    }, 1000);

});