async function salvarEstacao(evento) {
    evento.preventDefault();

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
        else {
            alert('Erro: ' + data);
        }
    }
    catch (erro) {
        console.error("não foi efetuado com sucesso o cadastro");
        alert("não foi possível, erro interno do servidor  " + erro);
    }

}

export { salvarEstacao };