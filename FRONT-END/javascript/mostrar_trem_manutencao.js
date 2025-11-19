function adicionarEventoExpansivel(itemDiv) {
    const botao = itemDiv.querySelector('.menu-mini');
    if (botao) {
        botao.addEventListener('click', function () {
            const item = this.closest('.item');
            const expansivel = item.querySelector('.conteudo-expansivel');

            document.querySelectorAll('.conteudo-expansivel').forEach(el => {
                if (el !== expansivel) {
                    el.classList.remove('aberto');
                }
            });

            expansivel.classList.toggle('aberto');
        });
    }
}

async function getTrens() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você não está logado. Faça login novamente.");
        window.location.href = "../index.html";
        return;
    }

    try {
        
        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/manutencao', { 
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        console.log("Status da resposta (manutenção):", resposta.status);

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ mensagem: resposta.statusText }));
            throw new Error(erro.mensagem || resposta.statusText);
        }

        const dados = await resposta.json();
        console.log("Dados recebidos (manutenção):", dados); 
        const containerTrensManutencao = document.getElementById('trens_manutencao');
        if (!containerTrensManutencao) {
            console.error("Elemento com ID 'trens_manutencao' não encontrado no HTML.");
            return;
        }

        containerTrensManutencao.innerHTML = '';

        if (dados && dados.length > 0) {
            dados.forEach(chamado => {
                
                const divItem = document.createElement("div");
                divItem.className = 'item';


                let statusTexto = "Desconhecido";
                switch (chamado.status) {
                    case 'pendente':
                        statusTexto = "Pendente";
                        break;
                    case 'em_andamento':
                        statusTexto = "Em Andamento";
                        break;
                    case 'concluida':
                        statusTexto = "Concluída";
                        break;
                    case 'cancelada':
                        statusTexto = "Cancelada";
                        break;
                    default:
                        statusTexto = chamado.status;
                }

                divItem.innerHTML = `
                    <div>
                        <span>🔧</span> <!-- Ícone para manutenção -->
                        <span>${chamado.nome_trem || 'Trem Desconhecido'} - ${statusTexto}</span>
                    </div>
                    <div class="menu-mini">≡</div>
                    <div class="conteudo-expansivel">
                        <ul>
                            <li>ID do Chamado: <strong>${chamado.id_chamado}</strong></li>
                            <li>Problema: <strong>${chamado.descricao_problema}</strong></li>
                            <li>Detalhes: <strong>${chamado.descricao_detalhada || 'Sem detalhes'}</strong></li>
                            <li>Status: <strong>${statusTexto}</strong></li>
                            <li>Data de Abertura: <strong>${new Date(chamado.data_inicio).toLocaleDateString('pt-BR')}</strong></li>
                            <li>Data de Conclusão: <strong>${chamado.data_conclusao ? new Date(chamado.data_conclusao).toLocaleDateString('pt-BR') : 'Pendente'}</strong></li>
                            <li>Trem Número: <strong>${chamado.numero}</strong></li>
                            <li>Fabricante: <strong>${chamado.fabricante}</strong></li>
                            <!-- Talvez adicione um botão para excluir o chamado -->
                            <!-- <button onclick="excluirChamado(${chamado.id_chamado})" class="btn btn-danger">Excluir Chamado</button> -->
                        </ul>
                    </div>
                `;

                adicionarEventoExpansivel(divItem);

                containerTrensManutencao.appendChild(divItem);
            });
        } else {
            containerTrensManutencao.innerHTML = '<p>Nenhum chamado de manutenção encontrado.</p>';
        }

    } catch (erro) {
        console.error("Erro na requisição para obter trens em manutenção:", erro);
        alert("Erro ao carregar chamados de manutenção: " + erro.message);

        const container = document.getElementById('trens_manutencao');
        if (container) {
            container.innerHTML = '<p>Erro ao carregar chamados de manutenção.</p>';
        }
    }
}

document.addEventListener("DOMContentLoaded", getTrens);