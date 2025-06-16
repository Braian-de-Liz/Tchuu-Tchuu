function mostrarConteudo(id) {
      const todos = document.querySelectorAll('.conteudo');
      todos.forEach(el => el.style.display = 'none');
      const alvo = document.getElementById(id);
      if (alvo) alvo.style.display = 'block';

      // Se for o painel de análise, renderiza o gráfico
      if (id === 'painel-analise') desenharGrafico();
    }