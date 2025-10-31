const rodape = document.querySelector('.fot');
const midia_grande = window.matchMedia('(min-width: 901px)');

function alternarRodape(e) {
  rodape.style.display = e.matches ? 'none' : 'flex';
}

alternarRodape(midia_grande);
midia_grande.addEventListener('change', alternarRodape);
