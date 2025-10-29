<?php
// api.php - Backend para gerenciar estações e rotas

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'trem';
$username = 'root';
$password = 'root';

// Criar conexão MySQLi
$mysqli = new mysqli($host, $username, $password, $dbname);

// Verificar conexão
if ($mysqli->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $mysqli->connect_error]);
    exit;
}

// Obter ação da requisição
$action = $_GET['action'] ?? '';

// Para requisições POST, obter os dados do corpo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        // Se não for JSON, tenta usar POST normal
        $input = $_POST;
    }
} else {
    $input = $_GET;
}

switch ($action) {
    case 'get_stations':
        getStations($mysqli);
        break;
        
    case 'get_routes':
        getRoutes($mysqli);
        break;
        
    case 'save_station':
        saveStation($mysqli, $input);
        break;
        
    case 'delete_station':
        deleteStation($mysqli, $input);
        break;
        
    case 'save_route':
        saveRoute($mysqli, $input);
        break;
        
    case 'delete_route':
        deleteRoute($mysqli, $input);
        break;
        
    case 'update_station_position':
        updateStationPosition($mysqli, $input);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Ação não reconhecida']);
        break;
}

// Função para obter estações
function getStations($mysqli) {
    try {
        $result = $mysqli->query("SELECT * FROM estacoes ORDER BY nome");
        if ($result) {
            $stations = [];
            while ($row = $result->fetch_assoc()) {
                $stations[] = $row;
            }
            echo json_encode($stations);
        } else {
            throw new Exception($mysqli->error);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao obter estações: ' . $e->getMessage()]);
    }
}

// Função para obter rotas com suas estações
function getRoutes($mysqli) {
    try {
        // Primeiro, obtemos as rotas
        $result = $mysqli->query("SELECT * FROM rotas ORDER BY nome");
        if (!$result) {
            throw new Exception($mysqli->error);
        }
        
        $routes = [];
        while ($row = $result->fetch_assoc()) {
            $routes[] = $row;
        }
        
        // Para cada rota, obtemos suas estações em ordem
        foreach ($routes as &$route) {
            $stmt = $mysqli->prepare("
                SELECT e.* 
                FROM estacoes e 
                JOIN rota_estacoes re ON e.id = re.id_estacao 
                WHERE re.id_rota = ? 
                ORDER BY re.ordem
            ");
            $stmt->bind_param("i", $route['id']);
            $stmt->execute();
            $resultEstacoes = $stmt->get_result();
            
            $route['estacoes'] = [];
            while ($estacao = $resultEstacoes->fetch_assoc()) {
                $route['estacoes'][] = $estacao;
            }
            $stmt->close();
        }
        
        echo json_encode($routes);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao obter rotas: ' . $e->getMessage()]);
    }
}

// Função para salvar estação
function saveStation($mysqli, $input) {
    try {
        $id = $input['id'] ?? null;
        $nome = $input['nome'] ?? '';
        $endereco = $input['endereco'] ?? '';
        $latitude = $input['latitude'] ?? 0;
        $longitude = $input['longitude'] ?? 0;
        
        if (empty($nome) || empty($latitude) || empty($longitude)) {
            echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
            return;
        }
        
        if ($id) {
            // Atualizar estação existente
            $stmt = $mysqli->prepare("
                UPDATE estacoes 
                SET nome = ?, endereco = ?, latitude = ?, longitude = ? 
                WHERE id = ?
            ");
            $stmt->bind_param("ssddi", $nome, $endereco, $latitude, $longitude, $id);
        } else {
            // Inserir nova estação
            $stmt = $mysqli->prepare("
                INSERT INTO estacoes (nome, endereco, latitude, longitude) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->bind_param("ssdd", $nome, $endereco, $latitude, $longitude);
        }
        
        if ($stmt->execute()) {
            $newId = $id ?: $mysqli->insert_id;
            echo json_encode(['success' => true, 'id' => $newId]);
        } else {
            throw new Exception($stmt->error);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar estação: ' . $e->getMessage()]);
    }
}

// Função para excluir estação
function deleteStation($mysqli, $input) {
    try {
        $id = $input['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID não fornecido']);
            return;
        }
        
        // Verificar se a estação está sendo usada em alguma rota
        $stmt = $mysqli->prepare("
            SELECT COUNT(*) as count 
            FROM rota_estacoes 
            WHERE id_estacao = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        if ($row['count'] > 0) {
            echo json_encode(['success' => false, 'message' => 'Não é possível excluir a estação pois ela está sendo usada em uma ou mais rotas']);
            return;
        }
        
        // Excluir estação
        $stmt = $mysqli->prepare("DELETE FROM estacoes WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception($stmt->error);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir estação: ' . $e->getMessage()]);
    }
}

// Função para salvar rota
function saveRoute($mysqli, $input) {
    try {
        $nome = $input['nome'] ?? '';
        $estacoes_json = $input['estacoes'] ?? '[]';
        
        // Decodificar o JSON das estações
        $estacoes = json_decode($estacoes_json, true);
        
        if (empty($nome) || !is_array($estacoes) || count($estacoes) < 2) {
            echo json_encode(['success' => false, 'message' => 'Dados incompletos: nome e pelo menos duas estações são obrigatórios']);
            return;
        }
        
        // Calcular distância total
        $distancia_total = 0;
        $stmt = $mysqli->prepare("SELECT latitude, longitude FROM estacoes WHERE id = ?");
        
        for ($i = 0; $i < count($estacoes) - 1; $i++) {
            $stmt->bind_param("i", $estacoes[$i]);
            $stmt->execute();
            $estacao1 = $stmt->get_result()->fetch_assoc();
            
            $stmt->bind_param("i", $estacoes[$i + 1]);
            $stmt->execute();
            $estacao2 = $stmt->get_result()->fetch_assoc();
            
            if ($estacao1 && $estacao2) {
                // Fórmula de Haversine para calcular distância
                $lat1 = deg2rad($estacao1['latitude']);
                $lon1 = deg2rad($estacao1['longitude']);
                $lat2 = deg2rad($estacao2['latitude']);
                $lon2 = deg2rad($estacao2['longitude']);
                
                $dlat = $lat2 - $lat1;
                $dlon = $lon2 - $lon1;
                
                $a = sin($dlat/2) * sin($dlat/2) + cos($lat1) * cos($lat2) * sin($dlon/2) * sin($dlon/2);
                $c = 2 * atan2(sqrt($a), sqrt(1-$a));
                $distancia = 6371 * $c; // Raio da Terra em km
                
                $distancia_total += $distancia;
            }
        }
        $stmt->close();
        
        // Calcular tempo estimado (60 km/h em média)
        $tempo_estimado = round(($distancia_total / 60) * 60);
        
        $mysqli->begin_transaction();
        
        // Inserir rota
        $stmt = $mysqli->prepare("INSERT INTO rotas (nome, distancia_km, tempo_estimado_min) VALUES (?, ?, ?)");
        $stmt->bind_param("sdi", $nome, round($distancia_total, 2), $tempo_estimado);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        $id_rota = $mysqli->insert_id;
        $stmt->close();
        
        // Inserir estações da rota
        $stmt = $mysqli->prepare("INSERT INTO rota_estacoes (id_rota, id_estacao, ordem) VALUES (?, ?, ?)");
        
        foreach ($estacoes as $index => $id_estacao) {
            $stmt->bind_param("iii", $id_rota, $id_estacao, $index);
            if (!$stmt->execute()) {
                throw new Exception($stmt->error);
            }
        }
        
        $stmt->close();
        $mysqli->commit();
        
        echo json_encode(['success' => true, 'id' => $id_rota]);
    } catch (Exception $e) {
        $mysqli->rollback();
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar rota: ' . $e->getMessage()]);
    }
}

// Função para excluir rota
function deleteRoute($mysqli, $input) {
    try {
        $id = $input['id'] ?? null;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID não fornecido']);
            return;
        }
        
        // Excluir rota (as rota_estacoes serão excluídas em cascade)
        $stmt = $mysqli->prepare("DELETE FROM rotas WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception($stmt->error);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir rota: ' . $e->getMessage()]);
    }
}

// Função para atualizar posição da estação
function updateStationPosition($mysqli, $input) {
    try {
        $id = $input['id'] ?? null;
        $latitude = $input['latitude'] ?? 0;
        $longitude = $input['longitude'] ?? 0;
        
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID não fornecido']);
            return;
        }
        
        $stmt = $mysqli->prepare("UPDATE estacoes SET latitude = ?, longitude = ? WHERE id = ?");
        $stmt->bind_param("ddi", $latitude, $longitude, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception($stmt->error);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar posição: ' . $e->getMessage()]);
    }
}

// Fechar conexão
$mysqli->close();
?>