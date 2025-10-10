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
    const token = localStorage.getItem("token");


    if (!email_novo && !senha_novo) {
        alert("Preencha pelo menos um campo (email ou senha).");

        return;
    }

    try {
        resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/usuario:cpf', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(email_novo, senha_novo, id_user)
        });
    }

    catch (erro) {
        alert("o elias não deixou você alterar" + erro);

    }
}

botaoAltera.addEventListener("click", alterar_envia);