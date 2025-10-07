export function estaLogado() {
    return !!localStorage.getItem('token');
}

export function getUsuarioLogado() {

    return {
        id: localStorage.getItem('usuarioId'),
        email: localStorage.getItem('usuarioEmail'),
        nome: localStorage.getItem('usuarioNome'),
        registroFun: localStorage.getItem('registroFun')
    }
}

export function sair() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioId');
  localStorage.removeItem('usuarioEmail');
  localStorage.removeItem('usuarioNome');
  localStorage.removeItem('registroFun');

  window.location.href = './index.html';
}

export function protegerRota() {
  if (!estaLogado()) {
    window.location.href = '../index.html';
    return false;
  }
  return true;
}