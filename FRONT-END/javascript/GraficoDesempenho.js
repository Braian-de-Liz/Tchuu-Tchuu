let slideAtualGraficos = 0;
const totalSlidesGraficos = 3;

// Espera o DOM carregar antes de acessar elementos
document.addEventListener('DOMContentLoaded', () => {
    const containerSlides = document.getElementById('slides-graficos');

    // Função de navegação (definida dentro do DOMContentLoaded para garantir que containerSlides exista)
    window.moverSlideGraficos = function(direcao) {
        slideAtualGraficos += direcao;
        if (slideAtualGraficos < 0) slideAtualGraficos = totalSlidesGraficos - 1;
        if (slideAtualGraficos >= totalSlidesGraficos) slideAtualGraficos = 0;
        containerSlides.style.transform = `translateX(${-slideAtualGraficos * 100}%)`;
    };

    // Só inicializa os gráficos se Chart.js estiver disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado.');
        return;
    }

    // Gráfico 1: Barras
    new Chart(document.getElementById('chart1').getContext('2d'), {
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
            plugins: {
                title: { display: true, text: 'Eficiência Operacional por Trem' }
            }
        }
    });

    // Gráfico 2: Linha
    new Chart(document.getElementById('chart2').getContext('2d'), {
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
            plugins: {
                title: { display: true, text: 'Tempo Médio de Viagem Mensal' }
            }
        }
    });

    // Gráfico 3: Doughnut
    new Chart(document.getElementById('chart3').getContext('2d'), {
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
            plugins: {
                title: { display: true, text: 'Distribuição da Frota' }
            }
        }
    });
});