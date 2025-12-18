// variaveis para a função de GET
const nome_campo = document.getElementById("nome_mostrar");
const data_nasc_campo = document.getElementById("data_nasc_mostrar");
const email_campo = document.getElementById("email_mostrar");
const cpf_campo = document.getElementById("cpf_mostrar");
const nomeUser = document.getElementById("nomeUser");

async function carregar_dados() {
    const token = localStorage.getItem('token');
    console.log("Token encontrado no localStorage:", token); 

    if (!token) {
        alert("você não está logado, essa página não sabe que você existe, VOLTANDOO...");
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

        console.log("Status da resposta:", resposta.status); 

        const info = await resposta.json();
        console.log("Dados recebidos:", info); 

        if (resposta.ok) {
            const usuario = info.usuario;

            nome_campo.textContent = usuario.nome || 'Carregando...';
            data_nasc_campo.textContent = usuario.data_nasc ? new Date(usuario.data_nasc).toLocaleDateString('pt-BR') : 'Carregando...';
            email_campo.textContent = usuario.email || 'Carregando...';
            cpf_campo.textContent = usuario.cpf || 'Carregando...';

            nomeUser.textContent = usuario.nome || 'Usuário';

            localStorage.setItem('usuarioNome', usuario.nome || 'Usuário');

        } else {
            alert('Erro: ' + info.mensagem);
            localStorage.removeItem('token');
            window.location.href = "../index.html";
        }
    }
    catch (erro) {
        console.error("Erro na requisição:", erro); 
        alert(`Erro na requisição: ${erro}. Aguarde o servidor.`);
        window.location.href = "../index.html";
    }
}








document.addEventListener("DOMContentLoaded", carregar_dados);

