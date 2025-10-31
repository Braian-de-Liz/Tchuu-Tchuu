function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


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


    if (!email_novo && !senha_novo) {
        alert("Preencha pelo menos um campo (email ou senha).");

        return;
    }

    if (!validateEmail(email_novo) || senha_novo.length < 8) {
        alert(" senha muito curta ou email inválido");
        return false;
    }

    if (!id_user) {
        alert("você não está logado, como passou pela a autêntificação?");
        window.location = '../index.html'
    }


    try {

        class pacote_de_alteracao {
            constructor(email, senha, id) {
                this.email = email;
                this.senha = senha;
                this.id = id
            }
        }

        const alteracao_empacotada = new pacote_de_alteracao(email_novo, senha_novo, id_user);

        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/usuario', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(alteracao_empacotada)
        });


        if (resposta.ok) {
            alert("Dados atualizados com sucesso!");

            if (email_novo) {
                localStorage.setItem('usuarioEmail', email_novo);
            }

            document.getElementById("alteracao").style.display = 'none';
            window.location.href = '../index.html';

        }
        else {
            const erro = await resposta.json();
            alert("Erro: " + erro.mensagem);
        }
    }


    catch (erro) {
        alert("Ocorreu um erro na alterações: " + erro);

    }
}


// variaveis para fazer botões 
const cancelar_alteracao = document.getElementById("cancelar_alteracao");

function cancelar_alteracaoa() {
    const alteracao = document.getElementById("alteracao");
    if (alteracao) {
        alteracao.style.display = 'none';
    }
    document.getElementById("email_novo").value = '';
    document.getElementById("senha_novo").value = '';
}

botaoAltera.addEventListener("click", alterar_envia);

if (cancelar_alteracao) {
    cancelar_alteracao.addEventListener("click", cancelar_alteracaoa);
} else {
    console.error("Elemento com ID 'cancelar_alteracao' não encontrado no HTML.");
}



botaoAltera.addEventListener("click", alterar_envia);
