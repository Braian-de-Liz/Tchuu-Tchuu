// FRONT-END/javascript/mostrar_dados_sensores.js
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


async function mostrar_dados_sensores() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "../index.html";
        return;
    }

    try {
        const consulta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/Sensores_mostrar', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Status da resposta:", consulta.status);

        const info = await consulta.json();
        console.log("Dados de sensores recebidos:", info);

        if (consulta.ok) {
            const sensores = info.sensores;
            const containerSensores = document.getElementById('Sensores'); 

            if (containerSensores) {
                containerSensores.innerHTML = "";

                if (sensores && sensores.length > 0) {
                    sensores.forEach(sensor => {
                        const divItem = document.createElement("div");
                        divItem.className = 'item';

                        divItem.innerHTML = `
                            <div>
                                <span>📡</span> 
                                <span>${sensor.tipo}</span>
                            </div>
                            <div class="menu-mini">≡</div>
                            <div class="conteudo-expansivel">
                                <ul>
                                    <li>ID do Sensor: <strong>${sensor.id_sensor}</strong></li>
                                    <li>Trem Associado: <strong>${sensor.nome_trem || 'N/A'}</strong></li>
                                    <li>Unidade de Medida: <strong>${sensor.unidade_medida || 'N/A'}</strong></li>
                                    <li>Data de Cadastro: <strong>${new Date(sensor.data_registro).toLocaleDateString('pt-BR')}</strong></li>
                                </ul>
                            </div>
                        `;

                        adicionarEventoExpansivel(divItem); 
                        containerSensores.appendChild(divItem);
                    });
                } else {
                    containerSensores.innerHTML = '<p>Nenhum sensor encontrado.</p>';
                }
            } else {
                console.error("Elemento com ID 'Sensores' não encontrado no HTML.");
            }
        } else {
            alert('Erro ao buscar sensores: ' + info.mensagem);
            localStorage.removeItem('token');
            window.location.href = "../index.html";
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro na requisição ao servidor: " + erro);
    }
}

document.addEventListener("DOMContentLoaded", mostrar_dados_sensores);