// Seleciona os elementos necessários
const menuIcon = document.querySelector('.menu-icon');
const menuLateral = document.querySelector('.menu-lateral');
const overlay = document.querySelector('.menu-overlay');

// Alternar menu e overlay ao clicar no ícone ☰
menuIcon.addEventListener('click', () => {
  menuLateral.classList.toggle('aberto');
  overlay.classList.toggle('visivel');
});

// Fechar menu ao clicar fora (overlay)
overlay.addEventListener('click', () => {
  menuLateral.classList.remove('aberto');
  overlay.classList.remove('visivel');
});

// Fechar menu ao apertar ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    menuLateral.classList.remove('aberto');
    overlay.classList.remove('visivel');
  }
});

// 🔹 Exibir ou esconder o ícone do menu em telas maiores
const midia_pequena = window.matchMedia('(max-width: 900px)');

function alternarVisibilidadeIcone(e) {
  if (e.matches) {
    menuIcon.style.display = 'inline-block';
  } else {
    menuIcon.style.display = 'none';
    // Se for desktop e menu estiver aberto, fecha automaticamente
    menuLateral.classList.remove('aberto');
    overlay.classList.remove('visivel');
  }
}

alternarVisibilidadeIcone(midia_pequena);
midia_pequena.addEventListener('change', alternarVisibilidadeIcone);
