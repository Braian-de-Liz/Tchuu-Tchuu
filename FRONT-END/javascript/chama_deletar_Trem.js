const btn_delte = document.getElementById("deletar_certeza");

async function delete_trem() {

    const usuario_cpf = localStorage.getItem("cpf_user");
    const nome_trem = document.getElementById("nome_de_trem").value;


    class dados_delete_trem {
        constructor(usuario_cpf, nome_trem) {
            this.usuario_cpf = usuario_cpf,
            this.nome_trem = nome_trem
        }
    }

    try {
        const nova_request = new dados_delete_trem(usuario_cpf, nome_trem);

        const conexao = await fetch("https://tchuu-tchuu-server-chat.onrender.com/api/trem", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(nova_request)
        });

        if (conexao.ok) {
            alert("trem deletada com sucesso");
            console.log("funcionou");
        }

        const data = await conexao.text();

        alert('Erro: ' + data);



    }
    catch (erro) {
        alert("não foi possível deletar o trens" + erro);
        console.log("houve deleltação no banco de dados");
    }
}


btn_delte.addEventListener("click", delete_trem);