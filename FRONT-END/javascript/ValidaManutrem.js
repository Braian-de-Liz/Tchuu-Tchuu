// FRONT-END/javascript/ValidaManutrem.js 
async function ValidaManutrem(event) {

    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const numero_de_Trem = document.getElementById('numero_de_Trem').value.trim();
    const ProblemaTrem = document.getElementById('ProblemaTrem').value.trim();
    const tremDescri = document.getElementById('tremDescri').value.trim(); 
    const cpf_user = localStorage.getItem("usuario_cpf");

    if (!nomeTrem || !numero_de_Trem || !ProblemaTrem || !tremDescri || !cpf_user) {
        alert('PREENCHA OS CAMPOS, NÃO PODE TER NENHUM VAZIO');
        return false;
    }

    if (isNaN(numero_de_Trem) || Number(numero_de_Trem) <= 0) {
        alert('O campo deve ser preenchido com números acima de 0');
        return false;
    }




    if (ProblemaTrem === '') {
        alert('O trem deve ter algum problema');
        return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você não está logado. Faça login novamente.");
        window.location.href = '../index.html'; 
        return false;
    }

    try {
        class dados_para_enviar_trem {
            constructor(nome_trem, numero_trem, descricao_problema, descricao_detalhada, cpf_user) {
                this.nome_trem = nome_trem;
                this.numero_trem = numero_trem; 
                this.descricao_problema = descricao_problema;
                this.descricao_detalhada = descricao_detalhada;
                this.cpf_user = cpf_user;
            }
        }

        const dadosEmpacotados = new dados_para_enviar_trem(nomeTrem, numero_de_Trem, ProblemaTrem, tremDescri, cpf_user);

        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/manutencao', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosEmpacotados) 
        });

        
        if (resposta.ok) {
            const resultado = await resposta.json();
            console.log("Chamado de manutenção registrado com sucesso! ID:", resultado.id);
            alert('Seu Trem poderá ir para manutenção. Iremos arrumar o/os ' + ProblemaTrem);

            
            document.getElementById('manutencao-form').reset(); 

            window.location.href = '../Public/pagMonitora.html';
            return true;
        } else {
            
            const erro = await resposta.json().catch(() => ({ mensagem: resposta.statusText })); 
            console.error("Erro ao registrar chamado de manutenção:", erro.mensagem || resposta.statusText);
            alert("Erro ao registrar chamado: " + (erro.mensagem || resposta.statusText));
            return false;
        }

    } catch (erro) {
        
        console.error("Erro na requisição para registrar manutenção:", erro);
        alert("Erro de rede ou servidor ao tentar registrar o chamado de manutenção.");
        return false;
    }
}