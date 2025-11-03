async function salvarEstacao(evento) {
    evento.preventDefault();

    /*     const dados = {
            id: document.getElementById('station-id').value,
            nome: document.getElementById('station-name').value,
            endereco: document.getElementById('station-address').value,
            latitude: document.getElementById('station-lat').value,
            longitude: document.getElementById('station-lng').value
        };
    
        fetch('api.php?action=save_station', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    fecharModais();
                    carregarEstacoes();
                    atualizarStatus(`Estação "${document.getElementById('station-name').value}" salva com sucesso`);
                } else {
                    alert('Erro ao salvar estação: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao salvar estação: ' + error.message);
            });
    } */
    const nome = document.getElementById('station-name').value;
    const endereco = document.getElementById('station-address').value;
    const latitude = document.getElementById('station-lat').value;
    const longitude = document.getElementById('station-lng').value;
    const cidade = document.getElementById('station-city').value;
    const estado = document.getElementById('station-state').value;

    class estacao {
        constructor(nome, endereco, latitude, longitude, cidade, estado) {
            this.nome = nome;
            this.endereco = endereco;
            this.latitude = latitude;
            this.longitude = latitude;
            this.cidade = cidade;
            this.estado = estado;
        }
    }

    try {
        const novaEstacao = new estacao(nome, endereco, latitude, longitude, cidade, estado);
        const enviar = await fetch("https://tchuu-tchuu-server-chat.onrender.com/api/estacoes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(novaEstacao)
        });

        if (enviar.ok) {
            alert("Estação cadastrada com Sucesso !!");
            
        }
    }
    catch () {

    }

}

export { salvarEstacao };