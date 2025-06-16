function mostrarConteudo(id) {
    // Oculta todos os conteúdos
    const todos = document.querySelectorAll('.conteudo');
    todos.forEach(el => el.style.display = 'none');

    // Mostra o conteúdo com o ID correspondente
    const alvo = document.getElementById(id);
    if (alvo) alvo.style.display = 'block';
}