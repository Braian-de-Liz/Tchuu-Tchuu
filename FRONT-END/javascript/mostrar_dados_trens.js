// FRONT-END/javascript/mostrar_dados_trens.js

// Corrija o nome da função para incluir o 'l'
function adicionarEventoExpansivel(itemDiv) { // <-- Nome correto
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

async function mostrar_dados_trem() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você não está logado. NÃO SEI NEM COMO VOCÊ ENTROU");
        window.location.href = "../index.html";
        return;
    }

    try {
        // Correção: Remover espaços da URL
        const consulta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/Trem_mostrar', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Status da resposta:", consulta.status);

        const info = await consulta.json();
        console.log("Dados recebidos:", info);

        if (consulta.ok) {
            const trens = info.trens;
            const containerTrens = document.getElementById('Trens');
            if (containerTrens) {
                containerTrens.innerHTML = "";

                if (trens && trens.length > 0) {
                    trens.forEach(trem => {
                        const divItem = document.createElement("div");
                        divItem.className = 'item';

                        divItem.innerHTML = `
                            <div>
                                <span>🚆</span>
                                <span>${trem.nome_trem}</span>
                            </div>
                            <div class="menu-mini">≡</div>
                            <div class="conteudo-expansivel">
                                <ul>
                                    <li>Número do Trem: <strong>${trem.numero}</strong></li>
                                    <li>Fabricante: <strong>${trem.fabricante}</strong></li>
                                    <li>Data de Cadastro: <strong>${new Date(trem.data_registro).toLocaleDateString('pt-BR')}</strong></li>
                                </ul>
                            </div>
                        `;


                        adicionarEventoExpansivel(divItem); 
                        containerTrens.appendChild(divItem);
                    });
                } else {
                    containerTrens.innerHTML = '<p>Nenhum trem encontrado.</p>';
                }
            } else {
                console.error("Elemento com ID 'Trens' não encontrado no HTML.");
            }
        } else {
            alert('Erro: ' + info.mensagem);
            localStorage.removeItem('token');
            window.location.href = "../index.html";
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro na requisição ao servidor: " + erro);
    }
}

document.addEventListener("DOMContentLoaded", mostrar_dados_trem);