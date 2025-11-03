async function carregarEstacoes() {
    fetch('api.php?action=get_stations')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            estacoes = data;
            renderizarEstacoes();
            atualizarStatus("Estações carregadas com sucesso");
        })
        .catch(error => {
            console.error('Erro ao carregar estações:', error);
            atualizarStatus("Erro ao carregar estações");
        });
}

function criarEstacaoTemporaria(latlng) {
    marcadorTemporario = L.marker(latlng, {
        draggable: true,
        icon: L.divIcon({
            className: 'temp-marker',
            html: '<div style="background-color: #3498db; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white;"></div>',
            iconSize: [24, 24]
        })
    }).addTo(mapa);

    // Preencher coordenadas no formulário
    document.getElementById('station-lat').value = latlng.lat.toFixed(6);
    document.getElementById('station-lng').value = latlng.lng.toFixed(6);

    // Abrir modal para adicionar estação
    abrirModalEstacao();
}

function renderizarEstacoes() {
    // Limpar marcadores existentes
    marcadoresEstacoes.forEach(marker => mapa.removeLayer(marker));
    marcadoresEstacoes = [];

    // Limpar lista de estações
    const container = document.getElementById('stations-container');
    container.innerHTML = '';

    // Adicionar cada estação
    estacoes.forEach(estacao => {
        // Criar marcador no mapa
        const marker = L.marker([estacao.latitude, estacao.longitude], {
            draggable: modoEdicao,
            icon: L.divIcon({
                className: 'station-marker',
                html: '<div style="background-color: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
                iconSize: [26, 26]
            })
        }).addTo(mapa);

        // Adicionar popup com informações
        marker.bindPopup(`
                    <div>
                        <h3>${estacao.nome}</h3>
                        <p>${estacao.endereco || 'Sem endereço'}</p>
                        <button onclick="editarEstacao(${estacao.id})" class="btn" style="margin-top: 10px;">Editar</button>
                    </div>
                `);

        // Evento de arrastar (apenas no modo edição)
        if (modoEdicao) {
            marker.on('dragend', function (e) {
                const novaLat = e.target.getLatLng().lat;
                const novaLng = e.target.getLatLng().lng;
                atualizarPosicaoEstacao(estacao.id, novaLat, novaLng);
            });
        }

        // Evento de clique
        marker.on('click', function () {
            if (criandoRota) {
                adicionarEstacaoARota(estacao);
            } else if (modoEdicao) {
                selecionarEstacao(estacao.id);
            } else {
                mapa.setView([estacao.latitude, estacao.longitude], 10);
                marker.openPopup();
            }
        });

        marcadoresEstacoes.push(marker);

        // Adicionar à lista lateral
        const itemEstacao = document.createElement('div');
        itemEstacao.className = 'station-item';
        itemEstacao.innerHTML = `
                    <strong>${estacao.nome}</strong>
                    <div style="font-size: 12px; margin-top: 5px;">${estacao.endereco || ''}</div>
                `;
        itemEstacao.dataset.id = estacao.id;

        itemEstacao.addEventListener('click', function () {
            if (criandoRota) {
                adicionarEstacaoARota(estacao);
            } else if (modoEdicao) {
                selecionarEstacao(estacao.id);
            } else {
                mapa.setView([estacao.latitude, estacao.longitude], 10);
                marker.openPopup();
            }
        });

        container.appendChild(itemEstacao);
    });
}

export { carregarEstacoes };