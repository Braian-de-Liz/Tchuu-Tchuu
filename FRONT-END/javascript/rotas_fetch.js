 // Variáveis globais
        let map;
        let stations = [];
        let routes = [];
        let stationMarkers = [];
        let routeLines = [];
        let editMode = false;
        let selectedStation = null;
        let tempMarker = null;
        let creatingRoute = false;
        let currentRoute = [];
        let currentRouteLine = null;
        
        // Inicialização do mapa
        function initMap() {
            // Coordenadas do centro do Brasil
            const centerLat = -14.2350;
            const centerLng = -51.9253;
            
            // Criar o mapa
            map = L.map('map').setView([centerLat, centerLng], 5);
            
            // Adicionar camada do mapa
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Carregar dados do servidor
            loadStations();
            loadRoutes();
            
            // Evento de clique no mapa
            map.on('click', function(e) {
                if (editMode && !tempMarker && !creatingRoute) {
                    createTempStation(e.latlng);
                }
            });
        }
        
        // Carregar estações do servidor
        function loadStations() {
            fetch('api.php?action=get_stations')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro na resposta do servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    stations = data;
                    renderStations();
                    updateStatus("Estações carregadas com sucesso");
                })
                .catch(error => {
                    console.error('Erro ao carregar estações:', error);
                    updateStatus("Erro ao carregar estações");
                });
        }
        
        // Carregar rotas do servidor
        function loadRoutes() {
            fetch('api.php?action=get_routes')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro na resposta do servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    routes = data;
                    renderRoutes();
                    updateStatus("Rotas carregadas com sucesso");
                })
                .catch(error => {
                    console.error('Erro ao carregar rotas:', error);
                    updateStatus("Erro ao carregar rotas");
                });
        }
        
        // Criar estação temporária no mapa
        function createTempStation(latlng) {
            tempMarker = L.marker(latlng, {
                draggable: true,
                icon: L.divIcon({
                    className: 'temp-marker',
                    html: '<div style="background-color: #3498db; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white;"></div>',
                    iconSize: [24, 24]
                })
            }).addTo(map);
            
            // Preencher coordenadas no formulário
            document.getElementById('station-lat').value = latlng.lat.toFixed(6);
            document.getElementById('station-lng').value = latlng.lng.toFixed(6);
            
            // Abrir modal para adicionar estação
            openStationModal();
        }
        
        // Renderizar estações no mapa e na lista
        function renderStations() {
            // Limpar marcadores existentes
            stationMarkers.forEach(marker => map.removeLayer(marker));
            stationMarkers = [];
            
            // Limpar lista de estações
            const container = document.getElementById('stations-container');
            container.innerHTML = '';
            
            // Adicionar cada estação
            stations.forEach(station => {
                // Criar marcador no mapa
                const marker = L.marker([station.latitude, station.longitude], {
                    draggable: editMode,
                    icon: L.divIcon({
                        className: 'station-marker',
                        html: '<div style="background-color: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
                        iconSize: [26, 26]
                    })
                }).addTo(map);
                
                // Adicionar popup com informações
                marker.bindPopup(`
                    <div>
                        <h3>${station.nome}</h3>
                        <p>${station.endereco || 'Sem endereço'}</p>
                        <button onclick="editStation(${station.id})" class="btn" style="margin-top: 10px;">Editar</button>
                    </div>
                `);
                
                // Evento de arrastar (apenas no modo edição)
                if (editMode) {
                    marker.on('dragend', function(e) {
                        const newLat = e.target.getLatLng().lat;
                        const newLng = e.target.getLatLng().lng;
                        updateStationPosition(station.id, newLat, newLng);
                    });
                }
                
                // Evento de clique
                marker.on('click', function() {
                    if (creatingRoute) {
                        addStationToRoute(station);
                    } else if (editMode) {
                        selectStation(station.id);
                    } else {
                        map.setView([station.latitude, station.longitude], 10);
                        marker.openPopup();
                    }
                });
                
                stationMarkers.push(marker);
                
                // Adicionar à lista lateral
                const stationItem = document.createElement('div');
                stationItem.className = 'station-item';
                stationItem.innerHTML = `
                    <strong>${station.nome}</strong>
                    <div style="font-size: 12px; margin-top: 5px;">${station.endereco || ''}</div>
                `;
                stationItem.dataset.id = station.id;
                
                stationItem.addEventListener('click', function() {
                    if (creatingRoute) {
                        addStationToRoute(station);
                    } else if (editMode) {
                        selectStation(station.id);
                    } else {
                        map.setView([station.latitude, station.longitude], 10);
                        marker.openPopup();
                    }
                });
                
                container.appendChild(stationItem);
            });
        }
        
        // Renderizar rotas no mapa
        function renderRoutes() {
            // Limpar rotas existentes
            routeLines.forEach(line => map.removeLayer(line));
            routeLines = [];
            
            // Limpar lista de rotas
            const container = document.getElementById('routes-container');
            container.innerHTML = '';
            
            // Adicionar cada rota
            routes.forEach(route => {
                // Obter coordenadas das estações da rota
                const coordinates = [];
                route.estacoes.forEach(estacao => {
                    coordinates.push([estacao.latitude, estacao.longitude]);
                });
                
                if (coordinates.length > 1) {
                    // Criar linha da rota com estilo de trilho
                    const line = L.polyline(coordinates, {
                        color: '#333',
                        weight: 6,
                        opacity: 0.8,
                        dashArray: '10, 10'
                    }).addTo(map);
                    
                    // Linha de sombra para efeito de trilho
                    const shadowLine = L.polyline(coordinates, {
                        color: '#e74c3c',
                        weight: 8,
                        opacity: 0.3
                    }).addTo(map);
                    
                    // Adicionar popup com informações
                    line.bindPopup(`
                        <div>
                            <h3>${route.nome}</h3>
                            <p>Distância: ${route.distancia_km} km</p>
                            <p>Tempo estimado: ${route.tempo_estimado_min} min</p>
                            <p>Estações: ${route.estacoes.length}</p>
                            <button onclick="deleteRoute(${route.id})" class="btn btn-danger" style="margin-top: 10px;">Excluir Rota</button>
                        </div>
                    `);
                    
                    routeLines.push(line);
                    routeLines.push(shadowLine);
                    
                    // Adicionar à lista lateral
                    const routeItem = document.createElement('div');
                    routeItem.className = 'route-item';
                    routeItem.innerHTML = `
                        <strong>${route.nome}</strong>
                        <div style="font-size: 12px; margin-top: 5px;">
                            Distância: ${route.distancia_km} km | 
                            Tempo: ${Math.floor(route.tempo_estimado_min / 60)}h ${route.tempo_estimado_min % 60}min
                        </div>
                        <div style="font-size: 11px; margin-top: 3px;">
                            ${route.estacoes.length} estações
                        </div>
                    `;
                    
                    routeItem.addEventListener('click', function() {
                        if (coordinates.length > 0) {
                            map.fitBounds(coordinates);
                        }
                    });
                    
                    container.appendChild(routeItem);
                }
            });
        }
        
        // Alternar modo de edição
        function toggleEditMode() {
            editMode = !editMode;
            
            const indicator = document.getElementById('mode-indicator');
            const btn = document.getElementById('btn-edit-mode');
            
            if (editMode) {
                indicator.textContent = 'Modo Edição';
                indicator.style.backgroundColor = '#e74c3c';
                btn.innerHTML = '<i class="fas fa-eye"></i> Visualizar';
                updateStatus("Modo edição ativado - Você pode mover estações");
            } else {
                indicator.textContent = 'Modo Visualização';
                indicator.style.backgroundColor = '#f39c12';
                btn.innerHTML = '<i class="fas fa-edit"></i> Editar';
                updateStatus("Modo visualização ativado");
            }
            
            renderStations();
        }
        
        // Iniciar criação de rota
        function startRouteCreation() {
            creatingRoute = true;
            currentRoute = [];
            
            document.getElementById('route-creator').style.display = 'block';
            updateStatus("Criando nova rota - Clique nas estações para adicioná-las à rota");
            map.getContainer().style.cursor = 'crosshair';
        }
        
        // Finalizar criação de rota
        function finishRouteCreation() {
            const routeName = document.getElementById('route-name').value || `Rota ${routes.length + 1}`;
            
            if (currentRoute.length < 2) {
                alert('Uma rota precisa ter pelo menos duas estações');
                return;
            }
            
            // Preparar dados para envio
            const data = {
                nome: routeName,
                estacoes: JSON.stringify(currentRoute.map(station => station.id))
            };
            
            // Enviar para o servidor
            fetch('api.php?action=save_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    cancelRouteCreation();
                    loadRoutes();
                    updateStatus(`Rota "${routeName}" criada com sucesso`);
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
        function cancelRouteCreation() {
            creatingRoute = false;
            currentRoute = [];
            
            document.getElementById('route-creator').style.display = 'none';
            map.getContainer().style.cursor = '';
            
            if (currentRouteLine) {
                map.removeLayer(currentRouteLine);
                currentRouteLine = null;
            }
            
            updateStatus("Criação de rota cancelada");
        }
        
        // Adicionar estação à rota em criação
        function addStationToRoute(station) {
            if (currentRoute.some(s => s.id === station.id)) {
                updateStatus("Esta estação já está na rota");
                return;
            }
            
            currentRoute.push(station);
            updateRouteStationsList();
            updateTempRouteLine();
            updateStatus(`Estação "${station.nome}" adicionada à rota`);
        }
        
        // Atualizar lista de estações na rota em criação
        function updateRouteStationsList() {
            const container = document.getElementById('route-stations-list');
            container.innerHTML = '';
            
            currentRoute.forEach((station, index) => {
                const stationItem = document.createElement('div');
                stationItem.style.padding = '5px';
                stationItem.style.borderBottom = '1px solid #eee';
                stationItem.innerHTML = `${index + 1}. ${station.nome}`;
                container.appendChild(stationItem);
            });
        }
        
        // Atualizar linha temporária da rota em criação
        function updateTempRouteLine() {
            if (currentRouteLine) {
                map.removeLayer(currentRouteLine);
            }
            
            if (currentRoute.length > 1) {
                const coordinates = currentRoute.map(station => [station.latitude, station.longitude]);
                
                currentRouteLine = L.polyline(coordinates, {
                    color: '#3498db',
                    weight: 4,
                    opacity: 0.7,
                    dashArray: '5, 5'
                }).addTo(map);
            }
        }
        
        // Selecionar estação
        function selectStation(stationId) {
            document.querySelectorAll('.station-item').forEach(item => {
                item.classList.remove('active');
            });
            
            selectedStation = stationId;
            
            if (stationId) {
                const stationItem = document.querySelector(`.station-item[data-id="${stationId}"]`);
                if (stationItem) {
                    stationItem.classList.add('active');
                }
            }
        }
        
        // Abrir modal de estação
        function openStationModal(stationId = null) {
            const modal = document.getElementById('station-modal');
            const title = document.getElementById('modal-title');
            const form = document.getElementById('station-form');
            const deleteBtn = document.getElementById('btn-delete-station');
            
            if (stationId) {
                title.innerHTML = '<i class="fas fa-train-station"></i> Editar Estação';
                const station = stations.find(s => s.id == stationId);
                
                if (station) {
                    document.getElementById('station-id').value = station.id;
                    document.getElementById('station-name').value = station.nome;
                    document.getElementById('station-address').value = station.endereco || '';
                    document.getElementById('station-lat').value = station.latitude;
                    document.getElementById('station-lng').value = station.longitude;
                }
                
                deleteBtn.style.display = 'inline-block';
            } else {
                title.innerHTML = '<i class="fas fa-train-station"></i> Adicionar Estação';
                form.reset();
                document.getElementById('station-id').value = '';
                deleteBtn.style.display = 'none';
                
                if (!document.getElementById('station-lat').value) {
                    const center = map.getCenter();
                    document.getElementById('station-lat').value = center.lat.toFixed(6);
                    document.getElementById('station-lng').value = center.lng.toFixed(6);
                }
            }
            
            modal.style.display = 'flex';
        }
        
        // Editar estação
        function editStation(stationId) {
            openStationModal(stationId);
        }
        
        // Fechar modais
        function closeModals() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            
            if (tempMarker) {
                map.removeLayer(tempMarker);
                tempMarker = null;
            }
        }
        
        // Salvar estação
        function saveStation(event) {
            event.preventDefault();
            
            const data = {
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
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    closeModals();
                    loadStations();
                    updateStatus(`Estação "${document.getElementById('station-name').value}" salva com sucesso`);
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
        function deleteStation() {
            const stationId = document.getElementById('station-id').value;
            
            if (!stationId || !confirm('Tem certeza que deseja excluir esta estação?')) {
                return;
            }
            
            const data = {
                id: stationId
            };
            
            fetch('api.php?action=delete_station', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    closeModals();
                    loadStations();
                    updateStatus("Estação excluída com sucesso");
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
        function deleteRoute(routeId) {
            if (!confirm('Tem certeza que deseja excluir esta rota?')) {
                return;
            }
            
            const data = {
                id: routeId
            };
            
            fetch('api.php?action=delete_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    loadRoutes();
                    updateStatus("Rota excluída com sucesso");
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
        function updateStationPosition(stationId, lat, lng) {
            const data = {
                id: stationId,
                latitude: lat,
                longitude: lng
            };
            
            fetch('api.php?action=update_station_position', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const station = stations.find(s => s.id == stationId);
                    if (station) {
                        updateStatus(`Posição da estação "${station.nome}" atualizada`);
                    }
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        }
        
        // Atualizar mensagem de status
        function updateStatus(message) {
            document.getElementById('status-message').textContent = message;
        }
        
        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar mapa
            initMap();
            
            // Botões
            document.getElementById('btn-add-station').addEventListener('click', function() {
                openStationModal();
            });
            
            document.getElementById('btn-start-route').addEventListener('click', startRouteCreation);
            document.getElementById('btn-finish-route').addEventListener('click', finishRouteCreation);
            document.getElementById('btn-cancel-route').addEventListener('click', cancelRouteCreation);
            
            document.getElementById('btn-edit-mode').addEventListener('click', toggleEditMode);
            
            document.getElementById('btn-save').addEventListener('click', function() {
                // Recarregar dados do servidor
                loadStations();
                loadRoutes();
                updateStatus("Dados atualizados do servidor");
            });
            
            // Fechar modais
            document.querySelectorAll('.close').forEach(closeBtn => {
                closeBtn.addEventListener('click', closeModals);
            });
            
            // Formulários
            document.getElementById('station-form').addEventListener('submit', saveStation);
            document.getElementById('btn-delete-station').addEventListener('click', deleteStation);
            
            // Fechar modal ao clicar fora
            window.addEventListener('click', function(event) {
                if (event.target.classList.contains('modal')) {
                    closeModals();
                }
            });
        });