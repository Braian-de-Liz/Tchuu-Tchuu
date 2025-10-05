const registrar = document.getElementById("registrar");

async function validar_e_conectar(e) {
    e.preventDefault();

    const tipo_sensor = document.getElementById("TipoSensor").value;
    const marca_sensor = document.getElementById("marca_sensor").value;
    const data = document.getElementById("Data_cadast").value

    if (!tipo_sensor || !marca_sensor || !data) {
        alert("preencha os dados");
        return false;
    }


    const [ano, mes, dia] = data.split('-').map(Number);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        alert("Data inválida.");
        return false;
    }

    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 2025) {
        alert("Data inválida.");
        return false;
    }

    class sensor {
        constructor(tipo_sensor, marca_sensor, data) {
            this.tipo_sensor = tipo_sensor;
                this.marca_sensor = marca_sensor;
                this.data = data
        }
    }

    const sensor_novo = new sensor(tipo_sensor, marca_sensor, data);

    try {

        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/sensores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(sensor_novo)
        });

        const data = await resposta.json();

        if (resposta.ok) {
            alert('sensor cadastrado com sucesso!');
            window.location.href = '../Public/pagMonitora.html';
        }
        else {
            alert('Erro: ' + data);
        }
    }

    catch (error) {
        console.error('Erro na conexão:', error);
        alert('Falha ao conectar ao servidor.');
    }

}


registrar.addEventListener("click", validar_e_conectar);