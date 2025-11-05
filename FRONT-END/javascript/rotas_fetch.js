// Variáveis globais
let mapa;
let estacoes = [];
let rotas = [];
let marcadoresEstacoes = [];
let linhasRotas = [];
let modoEdicao = false;
let estacaoSelecionada = null;
let marcadorTemporario = null;
let criandoRota = false;
let rotaAtual = [];
let linhaRotaAtual = null;

// Inicialização do mapa
function inicializarMapa() {
    // Coordenadas do centro do Brasil
    const centroLat = -14.2350;
    const centroLng = -51.9253;

    // Criar o mapa
    mapa = L.map('map').setView([centroLat, centroLng], 5);

    // Adicionar camada do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Carregar dados do servidor
    carregarEstacoes();
    carregarRotas();

    // Evento de clique no mapa
    mapa.on('click', function (e) {
        if (modoEdicao && !marcadorTemporario && !criandoRota) {
            criarEstacaoTemporaria(e.latlng);
        }
    });
}

// Carregar estações do servidor
function carregarEstacoes() {
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

// Carregar rotas do servidor
function carregarRotas() {



    /*             fetch('api.php?action=get_routes')
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
                    }); */
}

// Criar estação temporária no mapa
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

// Renderizar estações no mapa e na lista
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

// Renderizar rotas no mapa
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

// Alternar modo de edição
function alternarModoEdicao() {
    modoEdicao = !modoEdicao;

    const indicador = document.getElementById('mode-indicator');
    const botao = document.getElementById('btn-edit-mode');

    if (modoEdicao) {
        indicador.textContent = 'Modo Edição';
        indicador.style.backgroundColor = '#e74c3c';
        botao.innerHTML = '<i class="fas fa-eye"></i> Visualizar';
        atualizarStatus("Modo edição ativado - Você pode mover estações");
    } else {
        indicador.textContent = 'Modo Visualização';
        indicador.style.backgroundColor = '#f39c12';
        botao.innerHTML = '<i class="fas fa-edit"></i> Editar';
        atualizarStatus("Modo visualização ativado");
    }

    renderizarEstacoes();
}

// Iniciar criação de rota
function iniciarCriacaoRota() {
    criandoRota = true;
    rotaAtual = [];

    document.getElementById('route-creator').style.display = 'block';
    atualizarStatus("Criando nova rota - Clique nas estações para adicioná-las à rota");
    mapa.getContainer().style.cursor = 'crosshair';
}

// Finalizar criação de rota
function finalizarCriacaoRota() {
    const nomeRota = document.getElementById('route-name').value || `Rota ${rotas.length + 1}`;

    if (rotaAtual.length < 2) {
        alert('Uma rota precisa ter pelo menos duas estações');
        return;
    }

    // Preparar dados para envio
    const dados = {
        nome: nomeRota,
        estacoes: JSON.stringify(rotaAtual.map(estacao => estacao.id))
    };

    // Enviar para o servidor
    fetch('api.php?action=save_route', {
        method: 'POST',
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
                cancelarCriacaoRota();
                carregarRotas();
                atualizarStatus(`Rota "${nomeRota}" criada com sucesso`);
            } else {
                alert('Erro ao salvar rota: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao salvar rota: ' + error.message);
        });
}

// Cancelar criação de rota
function cancelarCriacaoRota() {
    criandoRota = false;
    rotaAtual = [];

    document.getElementById('route-creator').style.display = 'none';
    mapa.getContainer().style.cursor = '';

    if (linhaRotaAtual) {
        mapa.removeLayer(linhaRotaAtual);
        linhaRotaAtual = null;
    }

    atualizarStatus("Criação de rota cancelada");
}

// Adicionar estação à rota em criação
function adicionarEstacaoARota(estacao) {
    if (rotaAtual.some(s => s.id === estacao.id)) {
        atualizarStatus("Esta estação já está na rota");
        return;
    }

    rotaAtual.push(estacao);
    atualizarListaEstacoesRota();
    atualizarLinhaRotaTemporaria();
    atualizarStatus(`Estação "${estacao.nome}" adicionada à rota`);
}

// Atualizar lista de estações na rota em criação
function atualizarListaEstacoesRota() {
    const container = document.getElementById('route-stations-list');
    container.innerHTML = '';

    rotaAtual.forEach((estacao, index) => {
        const itemEstacao = document.createElement('div');
        itemEstacao.style.padding = '5px';
        itemEstacao.style.borderBottom = '1px solid #eee';
        itemEstacao.innerHTML = `${index + 1}. ${estacao.nome}`;
        container.appendChild(itemEstacao);
    });
}

// Atualizar linha temporária da rota em criação
function atualizarLinhaRotaTemporaria() {
    if (linhaRotaAtual) {
        mapa.removeLayer(linhaRotaAtual);
    }

    if (rotaAtual.length > 1) {
        const coordenadas = rotaAtual.map(estacao => [estacao.latitude, estacao.longitude]);

        linhaRotaAtual = L.polyline(coordenadas, {
            color: '#3498db',
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 5'
        }).addTo(mapa);
    }
}

// Selecionar estação
function selecionarEstacao(idEstacao) {
    document.querySelectorAll('.station-item').forEach(item => {
        item.classList.remove('active');
    });

    estacaoSelecionada = idEstacao;

    if (idEstacao) {
        const itemEstacao = document.querySelector(`.station-item[data-id="${idEstacao}"]`);
        if (itemEstacao) {
            itemEstacao.classList.add('active');
        }
    }
}

// Abrir modal de estação
function abrirModalEstacao(idEstacao = null) {
    const modal = document.getElementById('station-modal');
    const titulo = document.getElementById('modal-title');
    const formulario = document.getElementById('station-form');
    const botaoExcluir = document.getElementById('btn-delete-station');

    if (idEstacao) {
        titulo.innerHTML = '<i class="fas fa-train-station"></i> Editar Estação';
        const estacao = estacoes.find(s => s.id == idEstacao);

        if (estacao) {
            document.getElementById('station-id').value = estacao.id;
            document.getElementById('station-name').value = estacao.nome;
            document.getElementById('station-address').value = estacao.endereco || '';
            document.getElementById('station-lat').value = estacao.latitude;
            document.getElementById('station-lng').value = estacao.longitude;
        }

        botaoExcluir.style.display = 'inline-block';
    } else {
        titulo.innerHTML = '<i class="fas fa-train-station"></i> Adicionar Estação';
        formulario.reset();
        document.getElementById('station-id').value = '';
        botaoExcluir.style.display = 'none';

        if (!document.getElementById('station-lat').value) {
            const centro = mapa.getCenter();
            document.getElementById('station-lat').value = centro.lat.toFixed(6);
            document.getElementById('station-lng').value = centro.lng.toFixed(6);
        }
    }

    modal.style.display = 'flex';
}

// Editar estação
function editarEstacao(idEstacao) {
    abrirModalEstacao(idEstacao);
}

// Fechar modais
function fecharModais() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    if (marcadorTemporario) {
        mapa.removeLayer(marcadorTemporario);
        marcadorTemporario = null;
    }
}

// Salvar estação
function salvarEstacao(evento) {
    evento.preventDefault();

    const dados = {
        id: document.getElementById('station-id').value,
        nome: document.getElementById('station-name').value,
        endereco: document.getElementById('station-address').value,
        latitude: document.getElementById('station-lat').value,
        longitude: document.getElementById('station-lng').value
    };

    fetch('api.php?action=save_station', {
        method: 'POST',
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
                atualizarStatus(`Estação "${document.getElementById('station-name').value}" salva com sucesso`);
            } else {
                alert('Erro ao salvar estação: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao salvar estação: ' + error.message);
        });
}

// Excluir estação
function excluirEstacao() {
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

// Excluir rota
function excluirRota(idRota) {
    if (!confirm('Tem certeza que deseja excluir esta rota?')) {
        return;
    }

    const dados = {
        id: idRota
    };

    fetch('api.php?action=delete_route', {
        method: 'POST',
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
                carregarRotas();
                atualizarStatus("Rota excluída com sucesso");
            } else {
                alert('Erro ao excluir rota: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir rota: ' + error.message);
        });
}

// Atualizar posição da estação
function atualizarPosicaoEstacao(idEstacao, lat, lng) {
    const dados = {
        id: idEstacao,
        latitude: lat,
        longitude: lng
    };

    fetch('api.php?action=update_station_position', {
        method: 'POST',
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
                const estacao = estacoes.find(s => s.id == idEstacao);
                if (estacao) {
                    atualizarStatus(`Posição da estação "${estacao.nome}" atualizada`);
                }
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Atualizar mensagem de status
function atualizarStatus(mensagem) {
    document.getElementById('status-message').textContent = mensagem;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar mapa
    inicializarMapa();

    // Botões
    document.getElementById('btn-add-station').addEventListener('click', function () {
        abrirModalEstacao();
    });

    document.getElementById('btn-start-route').addEventListener('click', iniciarCriacaoRota);
    document.getElementById('btn-finish-route').addEventListener('click', finalizarCriacaoRota);
    document.getElementById('btn-cancel-route').addEventListener('click', cancelarCriacaoRota);

    document.getElementById('btn-edit-mode').addEventListener('click', alternarModoEdicao);

    document.getElementById('btn-save').addEventListener('click', function () {
        // Recarregar dados do servidor
        carregarEstacoes();
        carregarRotas();
        atualizarStatus("Dados atualizados do servidor");
    });

    // Fechar modais
    document.querySelectorAll('.close').forEach(botaoFechar => {
        botaoFechar.addEventListener('click', fecharModais);
    });

    // Formulários
    document.getElementById('station-form').addEventListener('submit', salvarEstacao);
    document.getElementById('btn-delete-station').addEventListener('click', excluirEstacao);

    // Fechar modal ao clicar fora
    window.addEventListener('click', function (evento) {
        if (evento.target.classList.contains('modal')) {
            fecharModais();
        }
    });
});