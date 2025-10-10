const alterarDados = document.getElementById('Alterar');

alterarDados.addEventListener('click', () => {
    const alteracao = document.getElementById("alteracao");
    alteracao.style.display = 'flex';

});

const botaoAltera = document.getElementById("botaoAltera");


async function alterar_envia(e) {
    e.preventDefault();

    const email_novo = document.getElementById("email_novo").value;
    const senha_novo = document.getElementById("senha_novo").value;
    const id_user = localStorage.getItem("usuarioId");

    try {
        resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/usuario:cpf', {
            method: "PATH",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(email_novo, senha_novo, id_user)

        });
    }

    catch (erro) {
        alert("o elias não deixou você alterar");

    }
}

botaoAltera.addEventListener("click", alterar_envia);