<?php
header('Content-Type: application/json');
require_once '../../databases/conectar_banco.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Método não permitido. Use POST.'
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$nome = $input['nome'] ?? null;
$cpf = $input['cpf'] ?? null;
$email = $input['email'] ?? null;
$senha = $input['senha'] ?? null;
$RegistroFun = $input['RegistroFun'] ?? null;
$dataNasc = $input['dataNasc'] ?? null;

if (!$nome || !$cpf || !$email || !$senha || !$RegistroFun || !$dataNasc) {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Preencha todos os campos'
    ]);
    exit;
}

$cpfTRUE = preg_replace('/\D/', '', $cpf);

if (strlen($cpfTRUE) !== 11) {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'CPF inválido.'
    ]);
    exit;
}

$dataNascDate = date_create($dataNasc);
if (!$dataNascDate) {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Data de nascimento inválida.'
    ]);
    exit;
}
$dataFormatada = $dataNascDate->format('Y-m-d');

try {
    $db = conectar(); 

    $stmt = $db->prepare("SELECT cpf, email FROM usuarios WHERE cpf = :cpf OR email = :email");
    $stmt->execute(['cpf' => $cpfTRUE, 'email' => $email]);
    $existente = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existente) {
        $campo = ($existente['cpf'] === $cpfTRUE) ? 'CPF' : 'e-mail';
        http_response_code(409);
        echo json_encode([
            'status' => 'erro',
            'mensagem' => "$campo já cadastrado."
        ]);
        exit;
    }

    $senha_segura = password_hash($senha, PASSWORD_BCRYPT, ['cost' => 10]);

    $stmt = $db->prepare("
        INSERT INTO usuarios (nome, cpf, email, senha, registro_fun, data_nasc)
        VALUES (:nome, :cpf, :email, :senha, :registro_fun, :data_nasc)
    ");

    $stmt->execute([
        'nome' => $nome,
        'cpf' => $cpfTRUE,
        'email' => $email,
        'senha' => $senha_segura,
        'registro_fun' => $RegistroFun,
        'data_nasc' => $dataFormatada
    ]);

    http_response_code(201);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Usuário cadastrado com sucesso!'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro interno do servidor',
        'detalhe' => $e->getMessage() 
    ]);
}
