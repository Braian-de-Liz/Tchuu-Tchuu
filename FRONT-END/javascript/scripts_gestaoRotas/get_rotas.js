async function carregarRotas() {
    fetch('api.php?action=get_routes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            rotas = data;
            renderizarRotas();
            atualizarStatus("Rotas carregadas com sucesso");
        })
        .catch(error => {
            console.error('Erro ao carregar rotas:', error);
            atualizarStatus("Erro ao carregar rotas");
        });
}

function renderizarRotas() {
    // Limpar rotas existentes
    linhasRotas.forEach(line => mapa.removeLayer(line));
    linhasRotas = [];

    // Limpar lista de rotas
    const container = document.getElementById('routes-container');
    container.innerHTML = '';

    // Adicionar cada rota
    rotas.forEach(rota => {
        // Obter coordenadas das estações da rota
        const coordenadas = [];
        rota.estacoes.forEach(estacao => {
            coordenadas.push([estacao.latitude, estacao.longitude]);
        });

        if (coordenadas.length > 1) {
            // Criar linha da rota com estilo de trilho
            const linha = L.polyline(coordenadas, {
                color: '#333',
                weight: 6,
                opacity: 0.8,
                dashArray: '10, 10'
            }).addTo(mapa);

            // Linha de sombra para efeito de trilho
            const linhaSombra = L.polyline(coordenadas, {
                color: '#e74c3c',
                weight: 8,
                opacity: 0.3
            }).addTo(mapa);

            // Adicionar popup com informações
            linha.bindPopup(`
                        <div>
                            <h3>${rota.nome}</h3>
                            <p>Distância: ${rota.distancia_km} km</p>
                            <p>Tempo estimado: ${rota.tempo_estimado_min} min</p>
                            <p>Estações: ${rota.estacoes.length}</p>
                            <button onclick="excluirRota(${rota.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir Rota</button>
                        </div>
                    `);

            linhasRotas.push(linha);
            linhasRotas.push(linhaSombra);

            // Adicionar à lista lateral
            const itemRota = document.createElement('div');
            itemRota.className = 'route-item';
            itemRota.innerHTML = `
                        <strong>${rota.nome}</strong>
                        <div style="font-size: 12px; margin-top: 5px;">
                            Distância: ${rota.distancia_km} km | 
                            Tempo: ${Math.floor(rota.tempo_estimado_min / 60)}h ${rota.tempo_estimado_min % 60}min
                        </div>
                        <div style="font-size: 11px; margin-top: 3px;">
                            ${rota.estacoes.length} estações
                        </div>
                    `;

            itemRota.addEventListener('click', function () {
                if (coordenadas.length > 0) {
                    mapa.fitBounds(coordenadas);
                }
            });

            container.appendChild(itemRota);
        }
    });
}


export { carregarRotas };