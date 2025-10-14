const cpf_confirmacao = document.getElementById("cpf_confirmacao").value;
const id_busca = localStorage.getItem("usuarioId");

async function envia_deletacao() {

    if (!!cpf_confirmacao || cpf_confirmacao.length !== 11) {
        alert("CPF está inválido");
        return false;
    }
    try {

        class dados_de_autorizacao {

            constructor(cpf_confirmacao, id_busca) {
                this.cpf = cpf_confirmacao;
                this.id = id_busca
            }
        }

        const nova_deletacao = new dados_de_autorizacao(cpf_confirmacao, id_busca);

        const resposta = await fetch("https://tchuu-tchuu-server-chat.onrender.com/api/usuarios/:id,cpf", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(nova_deletacao)
        });
    }
    catch (erro) {
        alert("não funcionou achamos o erro" + erro);
        return false;
    }
}

addEventListener("click", envia_deletacao);