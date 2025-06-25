window.onload = () => {
  document.querySelectorAll('.header,.info-principal, .horarios, .alertas, .informacoeslinha').forEach((el, i) => {
    setTimeout(() => el.classList.add('aparecerScroll'), 150 * i);
  });
};