const batteryData = {
    labels: ['20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'],
    datasets: [{
        label: 'Bateria (%)',
        data: [20, 30, 40, 50, 60, 70, 80, 90],
        borderColor: '#2c3e50',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: '#2c3e50',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2c3e50'
    }]
};

const batteryConfig = {
    type: 'line',
    data: batteryData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
};

// Configuração do gráfico de Consumo de Dados
const dataUsageData = {
    labels: ['Nov 23', '24', '25', '26', '27', '28', '29', '30'],
    datasets: [{
        label: 'Consumo de Dados',
        data: [80, 180, 350, 450, 600, 650, 700, 800],
        borderColor: '#3498db',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3498db'
    }]
};

const dataUsageConfig = {
    type: 'line',
    data: dataUsageData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value + 'MB';
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
};

// Renderizar os gráficos
const batteryChart = new Chart(
    document.getElementById('batteryChart'),
    batteryConfig
);

const dataUsageChart = new Chart(
    document.getElementById('dataUsageChart'),
    dataUsageConfig
);