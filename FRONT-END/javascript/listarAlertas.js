// Arquivo: ../javascript/listarAlertas.js

document.addEventListener('DOMContentLoaded', () => {
    const listaOcorrenciasDiv = document.getElementById("listaOcorrenciasAlertas");
    
    const API_URL_OCORRENCIAS = 'https://tchuu-tchuu-server-chat.onrender.com/api/ocorrencias'; 

    async function buscarOcorrencias() {
        listaOcorrenciasDiv.innerHTML = '<p>Buscando alertas ativos...</p>';

        try {
            const resposta = await fetch(API_URL_OCORRENCIAS, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const dadosResposta = await resposta.json();
            
            if (resposta.ok) {
                return dadosResposta.ocorrencias; 
            } else {
                console.error("Erro ao buscar ocorrências:", dadosResposta.mensagem);
                return { erro: dadosResposta.mensagem || 'Erro desconhecido na API.' };
            }
        } catch (error) {
            console.error('Erro na conexão:', error);
            return { erro: 'Falha ao conectar ao servidor para buscar alertas.' };
        }
    }

    function renderizarOcorrencias(ocorrencias) {
        listaOcorrenciasDiv.innerHTML = ''; 

        if (ocorrencias.erro) {
            listaOcorrenciasDiv.innerHTML = `<p style="color: red;"> Erro ao carregar dados: ${ocorrencias.erro}</p>`;
            return;
        }

        if (!ocorrencias || ocorrencias.length === 0) {
            listaOcorrenciasDiv.innerHTML = '<p> Nenhuma ocorrência de alerta ATIVO registrada no momento.</p>';
            return;
        }

        let tabelaHTML = `
            <table class="tabela-alertas">
                <thead>
                    <tr>
                        <th>Sensor</th>
                        <th>Tipo de Evento</th>
                        <th>Valor Lido</th>
                        <th>Limite</th>
                        <th>Disparo</th>
                    </tr>
                </thead>
                <tbody>
        `;

        ocorrencias.forEach(oc => {
            const dataFormatada = new Date(oc.timestamp_disparo).toLocaleString('pt-BR');
            
            tabelaHTML += `
                <tr class="alerta-ativo">
                    <td>${oc.nome_sensor}</td>
                    <td><span style="color: #ef4444; font-weight: bold;">${oc.tipo_alerta}</span></td>
                    <td style="color: red; font-weight: bold;">${oc.valor_lido}</td>
                    <td>${oc.valor_limite}</td>
                    <td>${dataFormatada}</td>
                </tr>
            `;
        });

        tabelaHTML += `
                </tbody>
            </table>
        `;

        listaOcorrenciasDiv.innerHTML = tabelaHTML;
    }

    async function carregarAlertas() {
        const ocorrencias = await buscarOcorrencias();
        renderizarOcorrencias(ocorrencias);
    }

    carregarAlertas(); 

});