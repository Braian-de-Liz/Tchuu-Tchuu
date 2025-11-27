// FRONT-END\javascript\Atualizar_Sensor.js
const popup_path = document.getElementById("popupAtualizarSensor");
const botao_ativa = document.getElementById("botao_pop_update");
const btn_enviar_atualizacao = document.getElementById("btn_enviar_atualizacao");
const botao_cancelar = document.getElementById("btn_cancelar_atualizacao");
const token = localStorage.getItem("token");

if (!token) {
    alert("você não está logado, retire-se");
    console.error("o usuário está logado, sem ter logado");

    window.location.href = '../index.html';
}
async function atualizar_sensor() {
    const nome_original = document.getElementById("nome_original").value;
    const novo_nome = document.getElementById("novo_nome").value;
    const TipoSensor_novo = document.getElementById("TipoSensor_novo").value;
    const cpf_user = localStorage.getItem("usuario_cpf");

    if (!nome_original || !novo_nome || !TipoSensor_novo) {
        alert("dados não preenchidos");
        console.error("dados não preenchidos, impossível realizar o fetch");

        return false;
    }

    if (!cpf_user) {
        alert("você não está logado, retire-se");
        console.error("o usuário está logado, sem ter logado");

        window.location.href = '../index.html';
    }

    class atualizar_sensor {
        constructor(nome_original, novo_nome, TipoSensor_novo, cpf_user) {
            this.nome_sensor = nome_original;
            this.nome_novo = novo_nome;
            this.TipoSensor_novo = TipoSensor_novo;
            this.cpf_user = cpf_user;
        }
    }

    try {

        const dados_da_req = new atualizar_sensor(nome_original, novo_nome, TipoSensor_novo, cpf_user);

        const requisiçao = await fetch("https://tchuu-tchuu-server-chat.onrender.com/api/sensores", {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados_da_req)
        });

        const resposta = await requisiçao.json()

        if (requisiçao.ok) {
            console.log(`sensor ${nome_sensor} deletado com sucesso`);
            alert(`sensor ${nome_sensor} deletado com sucesso`);

            alert(resposta);
            window.location.reload();
        }
        else {
            console.error("algum erro encontrado, impossiblitou a ação de deletar");
            alert("algo deu errado, e seu sensor o deletar");
        }


    }
    catch (error) {
        alert("erro do servidor, algo está atrapalhando a conexão" + error);
        console.error("tudo deu errado quero que se exploda" + error)
    }

}


botao_ativa.addEventListener("click", (e) => {
    e.preventDefault();
    if (popup_path) popup_path.style.display = 'flex';
    if (overlay) overlay.style.display = 'block';
});

botao_cancelar.addEventListener("click", (e) => {
    e.preventDefault();
    if (popup_path) popup_path.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
})

btn_enviar_atualizacao.addEventListener("click", atualizar_sensor);