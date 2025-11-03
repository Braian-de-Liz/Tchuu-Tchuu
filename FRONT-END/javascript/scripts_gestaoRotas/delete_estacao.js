async function excluirEstacao() {
    const idEstacao = document.getElementById('station-id').value;
    const id = localStorage.getItem("usuario_id");

    if (!idEstacao || !confirm('Tem certeza que deseja excluir esta estação?')) {
        return;
    }

    const dados = {
        id_estacao: idEstacao,
        id_usuario: id
    };

    fetch('https://tchuu-tchuu-server-chat.onrender.com/api/estacoes', {
        method: 'DELETE',
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
                atualizarStatus("Estação excluída com sucesso");
            } else {
                alert('Erro ao excluir estação: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir estação: ' + error.message);
        });
}

export {excluirEstacao};