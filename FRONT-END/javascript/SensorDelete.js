// FRONT-END\javascript\SensorDelete.js
const botao_abrir_form = document.getElementById("botao_pop_deletar");
const botao_confirmar = document.getElementById("btn_confirmar_delecao");
async function deletar_Sensor() {

    const cpf_user = localStorage.getItem("usuario_cpf");
    const nome_sensor = document.getElementById("nome_sensor").value.trim();
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("não pode estrar sem estar logada");
        alert("como que você estrou???, você nem tá logado???");
        window.location.href = '../index.html';
    }

    class dados_authDelete {
        constructor(cpf_user, nome_sensor) {
            this.cpf_user = cpf_user;
            this.nome_sensor = nome_sensor;
        }
    }

    try {
        const Req_Delete = new dados_authDelete(cpf_user, nome_sensor);

        const requisitar = await fetch("https://tchuu-tchuu-server-chat.onrender.com/api/sensores", {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Req_Delete)
        });

        const resposta = await requisitar.json()

        if (requisitar.ok) {
            console.log(`sensor ${nome_sensor} deletado com sucesso`);
            alert(`sensor ${nome_sensor} deletado com sucesso`);
            window.location.reload();
        }

    }
    catch (erro) {
        alert("erro no servidor" + erro);
        console.log("erro interno do tchuu-tchuu_server");
    }

}

botao_abrir_form.addEventListener("click", (e) => {
    e.preventDefault();

    const popupDeletarSensor = document.getElementById("popupDeletarSensor");

    popupDeletarSensor.style.display = 'flex';
});


botao_confirmar.addEventListener("click", deletar_Sensor);