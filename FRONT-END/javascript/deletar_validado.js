// const cpf_confirmacao = document.getElementById("cpf_confirmacao").value;
const id_busca = localStorage.getItem("usuarioId");

const botao_form_delete = document.getElementById("delete");
const hyper_confirmar = document.getElementById("hyper_confirmar");

const cancelar_btn = document.getElementById("cancelar_delete");


async function envia_deletacao() {
    
    const cpf_confirmacao = document.getElementById("cpf_confirmacao").value;
    if (!cpf_confirmacao || cpf_confirmacao.length != 11) {
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



botao_form_delete.addEventListener("click", () => {
    const confirmar_deletacao = document.getElementById("confirmar_deletacao");

    confirmar_deletacao.style.display = 'flex';
    
});


function cancelar_delete() {
    const confirmar_deletacao = document.getElementById("confirmar_deletacao");

    confirmar_deletacao.style.display = 'none';
}



hyper_confirmar.addEventListener("click", envia_deletacao);
cancelar_btn.addEventListener("click", cancelar_delete);