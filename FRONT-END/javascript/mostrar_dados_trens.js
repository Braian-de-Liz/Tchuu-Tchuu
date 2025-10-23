async function mostrar_dados_trem() {

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você não está logado. NÃO SEI NEM COMO VOCÊ ENTROU");
        window.location.href = "../index.html";
        return;
    }

    try {

        const consulta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/Trem_mostrar', {

            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Status da resposta:", resposta.status);

        const info = await resposta.json();
        console.log("Dados recebidos:", info);

        if (resposta.ok) {

            const trens = info.trens;

            const containerTrens = document.getElementById('Trens');

            if (containerTrens) {
                containerTrens.innerHTML = "";


                if (trens && trens.length > 0) {

                    trens.forEach(trem => {
                        const divItem = document.createElement("div");
                        divItem.className = 'item';

                        divItem.innerHTML = `
                            <div style="display: flex; align-items: center;">
                                <span style="font-size: 1.5em;">🚆</span>
                                <span>${trem.nome_trem}</span> <!-- Nome do Trem -->
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

                        containerTrens.appendChild(divItem);
                    });
                }
                else {
                    containerTrens.innerHTML = '<p>Nenhum trem encontrado.</p>';
                }
            }
            else {
                console.error("Elemento com ID 'container-trens' não encontrado no HTML.");
            }



        } else {

            alert('Erro: ' + info.mensagem);
            localStorage.removeItem('token');
            window.location.href = "../index.html";
        }
    }


    catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro na requisição ao servidor: " + erro);
    }


};

document.addEventListener("DOMContentLoaded", mostrar_dados_trem);