const nome_campo = document.getElementById("nome_mostrar");
const data_nasc_campo = document.getElementById("data_nasc_mostrar");
const email_campo = document.getElementById("email_mostrar");
const telefone_campo = document.getElementById("telefone_mostrar");
const cpf_campo = document.getElementById("cpf_mostrar");


async function carregar_dados() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("você não está logad, essa página não sabe que você existe, VOLTANDOO...");
        window.location.href = "../index.html";
        return;
    }


    try {
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/usuario_get', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const info = await resposta.json();


        if (resposta.ok) {

            nome_campo.textContent = info.usuario.nome || 'Carregando...';
            data_nasc_campo.textContent = info.usuario.data_nasc || 'Carregando...';
            email_campo.textContent = info.usuario.email || 'Carregando...';
            telefone_campo.textContent = info.usuario.telefone || 'Carregando...';
            cpf_campo.textContent = info.usuario.cpf || 'Carregando...';

        }
         else {
            alert('Erro: ' + info.mensagem);
            localStorage.removeItem('token');
            window.location.href = "../index.html";
        }
    }
    catch (erro) {
        alert(`erro ${erro}, aguarde o servidor`);
    }


}

document.addEventListener("DOMContentLoaded", carregar_dados);