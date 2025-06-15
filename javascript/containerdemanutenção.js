document.querySelectorAll('.menu-mini').forEach(botao => {
  botao.addEventListener('click', function () {
    const item = this.closest('.item');
    const expansivel = item.querySelector('.conteudo-expansivel');


    document.querySelectorAll('.conteudo-expansivel').forEach(el => {
      if (el !== expansivel) {
        el.classList.remove('aberto');
      }
    });


    expansivel.classList.toggle('aberto');
  });
});