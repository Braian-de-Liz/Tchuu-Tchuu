function abrirPopup() {
  document.getElementById('popup').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}

function fecharPopup() {
  document.getElementById('popup').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

function enviarChamado() {
  const pagina = document.getElementById("pagina").value;
  const tipoProblema = document.getElementById("tipoProblema").value;
  const data = document.getElementById("data").value;
  const descricao = document.getElementById("descricao").value;

  if (!pagina || !tipoProblema || !data || !descricao) {
    alert("Preencha todos os campos!");
    return;
  }

  alert("Problema relatado com sucesso!");
  fecharPopup();
}