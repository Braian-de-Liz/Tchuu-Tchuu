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

let rotaSelecionadaId = null; 

const API_BASE_URL = 'https://tchuu-tchuu-server-chat.onrender.com/api';


function atualizarStatus(mensagem) {
    const elementoStatus = document.getElementById('status-message');
    if (elementoStatus) {
        elementoStatus.textContent = mensagem;
    }
}

function fecharModais() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    if (marcadorTemporario) {
        mapa.removeLayer(marcadorTemporario);
        marcadorTemporario = null;
    }
}

function inicializarMapa() {
    const centroLat = -14.2350;
    const centroLng = -51.9253;
    mapa = L.map('map').setView([centroLat, centroLng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    carregarEstacoes();
    carregarRotas();

    mapa.on('click', function (e) {
        if (modoEdicao && !marcadorTemporario && !criandoRota) {
            criarEstacaoTemporaria(e.latlng);
        }
    });
}


async function carregarEstacoes() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token não encontrado.");
        atualizarStatus("Erro: Você não está logado.");
        window.location.href = "../index.html";
        return;
    }
    try {
        const resposta = await fetch(`${API_BASE_URL}/estacoes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!resposta.ok) {
            throw new Error(`Erro na API de estações: ${resposta.status} - ${resposta.statusText}`);
        }
        const data = await resposta.json();
        estacoes = data;
        renderizarEstacoes();
        atualizarStatus("Estações carregadas com sucesso");
    } catch (error) {
        console.error('Erro ao carregar estações:', error);
        atualizarStatus("Erro ao carregar estações do servidor.");
    }
}

async function carregarRotas() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token não encontrado.");
        window.location.href = "../index.html";
        return;
    }
    try {
        const resposta = await fetch(`${API_BASE_URL}/rotas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!resposta.ok) {
            throw new Error(`Erro na API de rotas: ${resposta.status} - ${resposta.statusText}`);
        }
        const data = await resposta.json();
        rotas = data;
        renderizarRotas();
        selecionarRota(null, ''); 
        atualizarStatus("Rotas carregadas com sucesso");
    } catch (error) {
        console.error('Erro ao carregar rotas:', error);
        atualizarStatus("Erro ao carregar rotas do servidor.");
    }
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

    document.getElementById('station-lat').value = latlng.lat.toFixed(6);
    document.getElementById('station-lng').value = latlng.lng.toFixed(6);

    abrirModalEstacao();
}

function renderizarEstacoes() {
    marcadoresEstacoes.forEach(marker => mapa.removeLayer(marker));
    marcadoresEstacoes = [];

    const container = document.getElementById('stations-container');
    if (container) {
        container.innerHTML = '';
    }

    estacoes.forEach(estacao => {
        const marker = L.marker([estacao.latitude, estacao.longitude], {
            draggable: modoEdicao,
            icon: L.divIcon({
                className: 'station-marker',
                html: '<div style="background-color: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
                iconSize: [26, 26]
            })
        }).addTo(mapa);

        marker.bindPopup(`
            <div>
                <h3>${estacao.nome}</h3>
                <p>${estacao.endereco || 'Sem endereço'}</p>
                <button onclick="editarEstacao(${estacao.id})" class="btn" style="margin-top: 10px;">Editar</button>
            </div>
        `);

        if (modoEdicao) {
            marker.on('dragend', function (e) {
                const novaLat = e.target.getLatLng().lat;
                const novaLng = e.target.getLatLng().lng;
                atualizarPosicaoEstacao(estacao.id, novaLat, novaLng);
            });
        }

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

        if (container) {
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
                    const marcador = marcadoresEstacoes.find(m => 
                        m.getLatLng().lat === estacao.latitude && 
                        m.getLatLng().lng === estacao.longitude
                    );
                    if (marcador) marcador.openPopup();
                }
            });

            container.appendChild(itemEstacao);
        }
    });
}

function renderizarRotas() {
    linhasRotas.forEach(line => mapa.removeLayer(line));
    linhasRotas = [];

    const container = document.getElementById('routes-container');
    if (container) {
        container.innerHTML = '';
    }

    rotas.forEach(rota => {
        const coordenadas = [];
        const idsEstacoes = rota.estacoes; 

        idsEstacoes.forEach(estacaoOuId => {
            let estacao;
            if (typeof estacaoOuId === 'number') {
                estacao = estacoes.find(e => e.id === estacaoOuId);
            } else if (estacaoOuId && estacaoOuId.latitude !== undefined) {
                estacao = estacaoOuId; 
            }

            if (estacao) {
                coordenadas.push([estacao.latitude, estacao.longitude]);
            }
        });

        if (coordenadas.length > 1) {
            const linha = L.polyline(coordenadas, {
                color: '#333',
                weight: 6,
                opacity: 0.8,
                dashArray: '10, 10'
            }).addTo(mapa);

            const linhaSombra = L.polyline(coordenadas, {
                color: '#e74c3c',
                weight: 8,
                opacity: 0.3
            }).addTo(mapa);

            linha.bindPopup(`
                <div style="text-align: center;">
                    <h3>${rota.nome}</h3>
                    <p>Distância: ${rota.distancia_km} km</p>
                    <p>Tempo estimado: ${rota.tempo_estimado_min} min</p>
                    <p>Estações: ${coordenadas.length}</p>
                    <p style="font-size: 11px; margin-top: 10px;">Clique na linha para ver as ações na barra lateral.</p>
                </div>
            `);
            
            linha.on('click', function (e) {
                selecionarRota(rota.id, rota.nome);
            });
            linhaSombra.on('click', function (e) {
                selecionarRota(rota.id, rota.nome);
            });

            linhasRotas.push(linha);
            linhasRotas.push(linhaSombra);

            if (container) {
                const itemRota = document.createElement('div');
                itemRota.className = 'route-item';
                itemRota.innerHTML = `
                    <strong>${rota.nome}</strong>
                    <div style="font-size: 12px; margin-top: 5px;">
                        Distância: ${rota.distancia_km} km | 
                        Tempo: ${Math.floor(rota.tempo_estimado_min / 60)}h ${rota.tempo_estimado_min % 60}min
                    </div>
                    <div style="font-size: 11px; margin-top: 3px;">
                        ${coordenadas.length} estações
                    </div>
                `;

                itemRota.addEventListener('click', function () {
                    selecionarRota(rota.id, rota.nome); 
                    if (coordenadas.length > 0) {
                        mapa.fitBounds(coordenadas);
                    }
                });

                container.appendChild(itemRota);
            }
        }
    });
}

function selecionarRota(id, nome) {
    const container = document.getElementById('route-actions-container');
    const nomeElement = document.getElementById('selected-route-name');
    
    if (!id || rotaSelecionadaId === id) {
        rotaSelecionadaId = null;
        container.style.display = 'none';
        nomeElement.textContent = '-- Selecione uma rota --';
        atualizarStatus("Nenhuma rota selecionada.");
        return;
    }

    rotaSelecionadaId = id;
    
    nomeElement.textContent = nome;
    container.style.display = 'block';
    atualizarStatus(`Rota "${nome}" selecionada. Use os botões abaixo para editar ou excluir.`);
}

function alternarModoEdicao() {
    if (criandoRota) {
        cancelarCriacaoRota();
    }
    
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


function iniciarCriacaoRota() {
    selecionarRota(null, ''); 
    
    criandoRota = true;
    rotaAtual = [];
    document.getElementById('route-id').value = ''; 
    document.getElementById('route-creator').style.display = 'flex';
    document.getElementById('route-stations-list').innerHTML = 'Nenhuma estação adicionada.';
    document.getElementById('route-name').value = '';
    document.getElementById('route-description').value = '';
    document.getElementById('btn-finish-route').innerHTML = '<i class="fas fa-check"></i> Finalizar Rota';

    atualizarStatus("Criando nova rota - Clique nas estações para adicioná-las à rota");
    mapa.getContainer().style.cursor = 'crosshair';
}

function editarRota(idRota) {
    const rotaParaEdicao = rotas.find(r => r.id == idRota);

    if (!rotaParaEdicao) {
        atualizarStatus("ERRO: Rota não encontrada para edição.");
        return;
    }

    iniciarCriacaoRota(); 
    

    document.getElementById('route-id').value = idRota;

    
    document.getElementById('route-name').value = rotaParaEdicao.nome;
    document.getElementById('route-description').value = rotaParaEdicao.descricao;

    rotaAtual = rotaParaEdicao.estacoes
        .map(estacaoOuId => {
            if (typeof estacaoOuId === 'number') {
                return estacoes.find(e => e.id === estacaoOuId);
            }
            return estacaoOuId;
        })
        .filter(e => e); 
    
    atualizarListaEstacoesRota();
    atualizarLinhaRotaTemporaria();

    document.getElementById('btn-finish-route').innerHTML = '<i class="fas fa-save"></i> Salvar Edição';
    
    atualizarStatus(`Editando a rota "${rotaParaEdicao.nome}". Clique nas estações para mudar o percurso.`);
}
async function finalizarCriacaoRota() {
    const idRota = document.getElementById('route-id').value;

    const nomeRota = document.getElementById('route-name').value || `Rota ${rotas.length + 1}`;
    const descricaoRota = document.getElementById('route-description').value;

    if (rotaAtual.length < 2) {
        console.error('Uma rota precisa ter pelo menos duas estações');
        atualizarStatus('ERRO: Uma rota precisa ter pelo menos duas estações');
        return;
    }

    const idsEstacoes = rotaAtual.map(estacao => Number(estacao.id));

    const dados = {
        nome: nomeRota,
        descricao: descricaoRota,
        estacoes: idsEstacoes
    };

    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Você não está logado. Faça login novamente.");
        window.location.href = "../index.html";
        return;
    }

    const metodoHttp = idRota ? 'PATCH' : 'POST';
    const url = idRota ? `${API_BASE_URL}/rotas/${idRota}` : `${API_BASE_URL}/rotas`;
    
    console.log(`[ROTA SAVE] Método: ${metodoHttp} | URL: ${url} | Dados:`, dados);

    try {
        const resposta = await fetch(url, {
            method: metodoHttp,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ mensagem: 'Erro desconhecido.' }));
            const mensagemErro = erro.mensagem || `Erro na resposta do servidor: ${resposta.status}`;
            alert(`Falha ao salvar rota: ${mensagemErro}`);
            throw new Error(mensagemErro);
        }

        const resultado = await resposta.json();

        if (resultado.status === 'sucesso') {
            cancelarCriacaoRota();
            carregarRotas();
            atualizarStatus(`Rota "${nomeRota}" ${idRota ? 'atualizada' : 'criada'} com sucesso`);
        } else {
            alert(`Erro ao salvar rota: ${resultado.mensagem}`);
            console.error('Erro ao salvar rota:', resultado.mensagem);
            atualizarStatus('ERRO: Erro ao salvar rota: ' + resultado.mensagem);
        }

    } catch (error) {
        console.error('Erro na requisição fetch:', error);
        atualizarStatus('ERRO: Falha na comunicação com o servidor. ' + error.message);
    }
}

function cancelarCriacaoRota() {
    criandoRota = false;
    rotaAtual = [];
    document.getElementById('route-id').value = ''; 
    document.getElementById('route-creator').style.display = 'none';
    mapa.getContainer().style.cursor = '';
    document.getElementById('btn-finish-route').innerHTML = '<i class="fas fa-check"></i> Finalizar Rota';

    if (linhaRotaAtual) {
        mapa.removeLayer(linhaRotaAtual);
        linhaRotaAtual = null;
    }

    atualizarStatus("Criação de rota cancelada");
}

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

function atualizarListaEstacoesRota() {
    const container = document.getElementById('route-stations-list');
    if (container) {
        container.innerHTML = '';

        rotaAtual.forEach((estacao, index) => {
            const itemEstacao = document.createElement('div');
            itemEstacao.style.padding = '5px';
            itemEstacao.style.borderBottom = '1px solid #eee';
            itemEstacao.innerHTML = `${index + 1}. ${estacao.nome}`;
            container.appendChild(itemEstacao);
        });
    }
}
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

async function excluirRota(idRota) {
    console.warn('Ação de exclusão iniciada para a rota ID:', idRota);

    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Você não está logado. Faça login novamente.");
        window.location.href = "../index.html";
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir a rota ID ${idRota}?`)) {
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/rotas/${idRota}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`[ROTA DELETE] Resposta: ${resposta.status}`);

        if (resposta.ok) {
            
            const resultado = await resposta.json().catch(() => ({ status: 'sucesso' }));

            if (resultado.status === 'sucesso') {
                carregarRotas();
                selecionarRota(null, ''); 
                atualizarStatus("Rota excluída com sucesso");
            } else {
                console.error('Erro ao excluir rota: ' + resultado.mensagem);
                atualizarStatus('ERRO: Erro ao excluir rota: ' + resultado.mensagem);
            }
        } else {
            const erro = await resposta.json().catch(() => ({ mensagem: 'Erro desconhecido.' }));
            const mensagemErro = erro.mensagem || `Erro na resposta do servidor: ${resposta.status}`;
            alert(`Falha ao excluir rota: ${mensagemErro}`);
            throw new Error(mensagemErro);
        }
    } catch (error) {
        console.error('Erro:', error);
        atualizarStatus('ERRO: Erro ao excluir rota: ' + error.message);
    }
}

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
            document.getElementById('station-city').value = estacao.cidade || '';
            document.getElementById('station-state').value = estacao.estado || '';
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

function editarEstacao(idEstacao) {
    abrirModalEstacao(idEstacao);
}

async function salvarEstacao(evento) {
    evento.preventDefault();

    const dados = {
        id: document.getElementById('station-id').value,
        nome: document.getElementById('station-name').value,
        endereco: document.getElementById('station-address').value,
        latitude: parseFloat(document.getElementById('station-lat').value),
        longitude: parseFloat(document.getElementById('station-lng').value),
        cidade: document.getElementById('station-city').value,
        estado: document.getElementById('station-state').value
    };

    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Você não está logado. Faça login novamente.");
        window.location.href = "../index.html";
        return;
    }

    try {
        const metodoHttp = dados.id ? 'PATCH' : 'POST';
        const url = dados.id
            ? `${API_BASE_URL}/estacoes/${dados.id}` 
            : `${API_BASE_URL}/estacoes`; 
        
        const resposta = await fetch(url, {
            method: metodoHttp,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ mensagem: 'Erro desconhecido.' }));
            const mensagemErro = erro.mensagem || `Erro na resposta do servidor: ${resposta.status}`;
            alert(`Falha ao salvar estação: ${mensagemErro}`);
            throw new Error(mensagemErro);
        }

        const resultado = await resposta.json();

        if (resultado.status === 'sucesso') {
            fecharModais();
            carregarEstacoes();
            carregarRotas(); 
            atualizarStatus(`Estação "${document.getElementById('station-name').value}" salva com sucesso`);
        } else {
            alert(`Erro ao salvar: ${resultado.mensagem}`);
            console.error('Erro ao salvar estação:', resultado.mensagem);
            atualizarStatus('ERRO: Erro ao salvar estação: ' + resultado.mensagem);
        }

    } catch (error) {
        console.error('Erro:', error);
        atualizarStatus('ERRO: Falha na comunicação com o servidor. ' + error.message);
    }
}

async function excluirEstacao() {
    const idEstacao = document.getElementById('station-id').value;

    if (!idEstacao) return;
    
    console.warn('Ação de exclusão iniciada para a estação ID:', idEstacao);

    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Você não está logado. Faça login novamente.");
        window.location.href = "../index.html";
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir a estação ID ${idEstacao}?`)) {
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/estacoes/${idEstacao}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ mensagem: 'Erro desconhecido.' }));
            const mensagemErro = erro.mensagem || `Erro na resposta do servidor: ${resposta.status}`;
            alert(`Falha na Exclusão: ${mensagemErro}`); 
            throw new Error(mensagemErro);
        }

        const resultado = await resposta.json();

        if (resultado.status === 'sucesso') {
            fecharModais();
            carregarEstacoes();
            carregarRotas(); 
            atualizarStatus("Estação excluída com sucesso");
        } else {
            console.error('Erro ao excluir estação:', resultado.mensagem);
            atualizarStatus('ERRO: Erro ao excluir estação: ' + resultado.mensagem);
        }

    } catch (error) {
        console.error('Erro:', error);
        atualizarStatus('ERRO: Erro ao excluir estação: ' + error.message);
    }
}
async function atualizarPosicaoEstacao(idEstacao, lat, lng) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Você não está logado. Faça login novamente.");
        window.location.href = "../index.html";
        return;
    }

    const dados = {
        latitude: lat,
        longitude: lng
    };

    try {
        const resposta = await fetch(`${API_BASE_URL}/estacoes/${idEstacao}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ mensagem: 'Erro desconhecido.' }));
            const mensagemErro = erro.mensagem || `Erro na resposta do servidor: ${resposta.status}`;
            alert(`Falha ao atualizar posição da estação: ${mensagemErro}`);
            throw new Error(mensagemErro);
        }

        const resultado = await resposta.json();

        if (resultado.status === 'sucesso') {
            const estacao = estacoes.find(s => s.id == idEstacao);
            if (estacao) {
                estacao.latitude = lat;
                estacao.longitude = lng;
                atualizarStatus(`Posição da estação "${estacao.nome}" atualizada`);
                carregarRotas(); 
            }
        } else {
            console.error('Erro ao atualizar posição:', resultado.mensagem);
            atualizarStatus('ERRO: Erro ao atualizar posição: ' + resultado.mensagem);
        }

    } catch (error) {
        console.error('Erro:', error);
        atualizarStatus('ERRO: Erro ao atualizar posição: ' + error.message);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    inicializarMapa();

    document.getElementById('btn-add-station').addEventListener('click', function () {
        abrirModalEstacao();
    });

    document.getElementById('btn-start-route').addEventListener('click', iniciarCriacaoRota);
    document.getElementById('btn-finish-route').addEventListener('click', finalizarCriacaoRota);
    document.getElementById('btn-cancel-route').addEventListener('click', cancelarCriacaoRota);
    document.getElementById('btn-edit-mode').addEventListener('click', alternarModoEdicao);
    document.getElementById('btn-save').addEventListener('click', function () {
        carregarEstacoes();
        carregarRotas();
        atualizarStatus("Dados atualizados do servidor");
    });
    
    document.getElementById('btn-fixed-edit-route').addEventListener('click', function() {
        if (rotaSelecionadaId) {
            editarRota(rotaSelecionadaId);
            selecionarRota(null, ''); 
        } else {
            atualizarStatus('Selecione uma rota primeiro!');
        }
    });
    document.getElementById('btn-fixed-delete-route').addEventListener('click', function() {
        if (rotaSelecionadaId) {
            excluirRota(rotaSelecionadaId);
        } else {
            atualizarStatus('Selecione uma rota primeiro!');
        }
    });

    document.querySelectorAll('.close').forEach(botaoFechar => {
        botaoFechar.addEventListener('click', fecharModais);
    });
    document.getElementById('station-form').addEventListener('submit', salvarEstacao);
    document.getElementById('btn-delete-station').addEventListener('click', excluirEstacao);
    window.addEventListener('click', function (evento) {
        if (evento.target.classList.contains('modal')) {
            fecharModais();
        }
    });
    window.editarEstacao = editarEstacao;
    window.excluirEstacao = excluirEstacao;

});