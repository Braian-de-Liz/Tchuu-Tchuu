// FRONT-END/javascript/SensorDelete.js

async function carregarIdsSensores(selectId) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">Carregando...</option>';

    const token = localStorage.getItem('token');
    const cpf_user = localStorage.getItem('usuario_cpf');
    
    const baseUrl = "https://tchuu-tchuu-server-chat.onrender.com/api/sensores";
    const url_fetch = new URL(baseUrl);
    url_fetch.searchParams.append("cpf_user", cpf_user);

    try {
        const conexao = await fetch(url_fetch.toString(), {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (conexao.ok) {
            const sensores = await conexao.json();
            selectElement.innerHTML = '<option value="">-- Selecione o ID do Sensor --</option>';
            
            const uniqueSensorIds = new Set(sensores.map(s => s.id_sensor));

            uniqueSensorIds.forEach(id => {
                selectElement.innerHTML += `<option value="${id}">${id}</option>`;
            });

            if (uniqueSensorIds.size === 0) {
                 selectElement.innerHTML = '<option value="">Nenhum sensor encontrado.</option>';
            }

        } else {
            selectElement.innerHTML = '<option value="">Erro ao carregar IDs.</option>';
        }
    } catch (error) {
        selectElement.innerHTML = '<option value="">Erro de conexão.</option>';
    }
}


async function confirmarDelecao() {
    const idSensor = document.getElementById("selectSensorDeletar").value;
    const cpf_user = localStorage.getItem("usuario_cpf"); 
    const token = localStorage.getItem('token'); 

    if (!idSensor) {
        alert("Selecione o ID do sensor que deseja deletar.");
        return;
    }
    
    if (!confirm(`Tem certeza que deseja DELETAR o sensor ID: ${idSensor}? Todos os dados associados serão perdidos.`)) {
        return;
    }

    try {
        const baseUrl = "https://tchuu-tchuu-server-chat.onrender.com/api/sensores";
        const url_delete = new URL(baseUrl);
        
        url_delete.searchParams.append("cpf_user", cpf_user);
        url_delete.searchParams.append("id_sensor", idSensor);

        const conexao = await fetch(url_delete.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        
        if (conexao.ok) {
            alert(`Sensor "${idSensor}" deletado com sucesso!`);
            window.location.reload(); 
        } else {
            const data = await conexao.json().catch(() => ({ mensagem: 'Erro desconhecido.' }));
            alert(`Erro ao deletar o sensor: ${data.mensagem || conexao.statusText}`);
        }

    } catch (erro) {
        alert("Não foi possível conectar ao servidor para deletar: " + erro.message);
        console.error("Erro na requisição DELETE:", erro);
    }
}

window.carregarIdsSensores = carregarIdsSensores;
window.confirmarDelecao = confirmarDelecao;