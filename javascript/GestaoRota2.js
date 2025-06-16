
; function desenharGrafico() {
  if (window.myChart2) return; // Evita recriar o gráfico
  const ctx = document.getElementById('myChart2');
  if (!ctx) return;

  window.myChart2 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# de votos',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}