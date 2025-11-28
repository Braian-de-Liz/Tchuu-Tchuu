// FRONT-END\javascript\SensorView.js
const btnVerSensores = document.getElementById("botao_pop_ver");
const popupVerSensores = document.getElementById("popupVerSensores");
const btnFecharPopup = document.getElementById("btn_fechar_ver_sensores");
const listaSensoresDiv = document.getElementById("listaSensores");

const API_URL = 'https://tchuu-tchuu-server-chat.onrender.com/api/sensores'; 

async function buscarSensores(cpf) {
    const urlComCPF = `${API_URL}?cpf=${cpf}`;
    
    try {
        const resposta = await fetch(urlComCPF, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const dadosResposta = await resposta.json();
        
        if (resposta.ok) {
            return dadosResposta.sensores; 
        } else {
            console.error("Erro ao buscar sensores:", dadosResposta.mensagem);
            return { erro: dadosResposta.mensagem };
        }
    } catch (error) {
        console.error('Erro na conexão:', error);
        return { erro: 'Falha ao conectar ao servidor para buscar os dados.' };
    }
}

function renderizarSensores(sensores) {
    listaSensoresDiv.innerHTML = ''; 

    if (sensores.erro) {
        listaSensoresDiv.innerHTML = `<p style="color: red;">Erro: ${sensores.erro}</p>`;
        return;
    }

    if (!sensores || sensores.length === 0) {
        listaSensoresDiv.innerHTML = '<p>Nenhum sensor cadastrado para este CPF.</p>';
        return;
    }

    let tabelaHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Trem</th>
                    <th>Data Reg.</th>
                </tr>
            </thead>
            <tbody>
    `;

    sensores.forEach(sensor => {
        const dataFormatada = sensor.data_registro ? new Date(sensor.data_registro).toLocaleDateString() : 'N/A';

        tabelaHTML += `
            <tr>
                <td>${sensor.id_sensor}</td>
                <td>${sensor.nome_sensor}</td>
                <td>${sensor.tipo_sensor}</td>
                <td>${sensor.nome_trem}</td>
                <td>${dataFormatada}</td>
            </tr>
        `;
    });

    tabelaHTML += `
            </tbody>
        </table>
    `;

    listaSensoresDiv.innerHTML = tabelaHTML;
}

async function handleVerSensores() {
    const cpf = localStorage.getItem('usuario_cpf'); 

    if (!cpf) {
        listaSensoresDiv.innerHTML = '<p style="color: red;">Erro: CPF do usuário não encontrado. Faça login novamente.</p>';
        popupVerSensores.style.display = 'block';
        return;
    }

    listaSensoresDiv.innerHTML = '<p>Carregando dados dos sensores...</p>';

    popupVerSensores.style.display = 'block'; 

    const sensores = await buscarSensores(cpf);
    renderizarSensores(sensores);
}


btnVerSensores.addEventListener('click', handleVerSensores);
btnFecharPopup.addEventListener('click', () => {
    popupVerSensores.style.display = 'none';
});