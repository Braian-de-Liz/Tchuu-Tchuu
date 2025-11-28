const registrar = document.getElementById("registrar");

async function validar_e_conectar(e) {
    e.preventDefault();

    const tipo_sensor = document.getElementById("TipoSensor").value;
    const nome_sensor = document.getElementById("nome_sensor").value;
    const nome_trem = document.getElementById("nome_trem").value;
    const data = document.getElementById("Data_cadast").value;
    const cpf = document.getElementById("CPF").value;

    if (!tipo_sensor || !nome_sensor || !nome_trem || !data || !cpf) {
        alert("Preencha todos os dados.");
        return false;
    }


    const [ano, mes, dia] = data.split('-').map(Number);
    if (isNaN(dia) || isNaN(mes) || isNaN(ano) || dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 2000) {
        alert("Data inválida.");
        return false;
    }
    if (cpf.length !== 11) {
        alert("CPF inválido, deve ter 11 dígitos.");
        return false;
    }


    class sensor {
        constructor(tipo_sensor, nome_sensor, nome_trem, data, cpf) {
            this.tipo_sensor = tipo_sensor;
            this.nome_trem = nome_trem;
            this.nome_sensor = nome_sensor;
            this.data = data;
            this.cpf = cpf;
        }
    }

    const sensor_novo = new sensor(tipo_sensor, nome_sensor, nome_trem, data, cpf);

    try {
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/sensores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sensor_novo)
        });

        let dadosResposta = {};
        try {
            dadosResposta = await resposta.json();
        } catch (e) {
            dadosResposta = { mensagem: resposta.statusText || "Resposta do servidor não pôde ser lida." };
        }

        if (resposta.ok) {
            alert('Sensor cadastrado com sucesso!');
            window.location.href = '../Public/pagMonitora.html';
        }

        else {

            const mensagemErro = dadosResposta.mensagem || "Erro desconhecido ao cadastrar sensor.";
            alert('Erro: ' + mensagemErro);
        }
    }

    catch (error) {
        console.error('Erro na conexão ou na execução do fetch:', error);
        alert('Falha ao conectar ao servidor. Verifique sua conexão ou status do Back-end.');
    }
}

registrar.addEventListener("click", validar_e_conectar);