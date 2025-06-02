function mostrarconteudo(id) {
    const secoes = document.querySelectorAll('.conteudo');
    secoes.forEach(secao => {
        secao.style.display = 'none';
    });

    const secaoAtiva = document.getElementById(id);
    if (secaoAtiva) {
        secaoAtiva.style.display = 'block'
    }

}