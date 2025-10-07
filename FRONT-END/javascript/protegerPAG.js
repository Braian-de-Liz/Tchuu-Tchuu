import { protegerRota } from '../javascript/autenticacao.js';
import { getUsuarioLogado } from '../javascript/autenticacao.js';
import { estaLogado } from '../javascript/autenticacao.js';

protegerRota();
getUsuarioLogado();
estaLogado();