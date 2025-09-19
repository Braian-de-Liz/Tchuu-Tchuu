<?php
/* 

// 📄 salvar_usuario.php

// Impede cache
header('Content-Type: text/plain; charset=utf-8');

// Lê o corpo da requisição (JSON enviado pelo JS)
$json = file_get_contents('php://input');

// Decodifica o JSON para array associativo
$data = json_decode($json, true);

// Verifica se houve erro na decodificação
if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Erro: JSON inválido";
    exit;
}

// Extrai os dados (com fallback para evitar erros)
$nome = $data['nome'] ?? '';
$cpf = $data['cpf'] ?? '';
$registroFun = $data['RegistroFun'] ?? '';
$dataNasc = $data['dataNasc'] ?? '';
$email = $data['email'] ?? '';
$senha = $data['senha'] ?? '';

// Validação básica
if (empty($nome) || empty($email) || empty($cpf)) {
    echo "Erro: Nome, e-mail e CPF são obrigatórios.";
    exit;
}

// ⚠️ IMPORTANTE: Nunca salve senhas em texto puro!
// Use password_hash() para criptografar
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

// ✅ AQUI VOCÊ SALVA NO BANCO DE DADOS

Exemplo com MySQLi:

$conn = new mysqli("localhost", "seu_usuario", "sua_senha", "seu_banco");

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

$stmt = $conn->prepare("
    INSERT INTO usuarios (nome, cpf, registro_funcional, data_nascimento, email, senha)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("ssssss", $nome, $cpf, $registroFun, $dataNasc, $email, $senhaHash);

if ($stmt->execute()) {
    echo "Usuário cadastrado com sucesso! ID: " . $stmt->insert_id;
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conn->close();


// 👇 PARA TESTE: só exibe os dados recebidos
echo "Dados recebidos:\n";
echo "Nome: $nome\n";
echo "CPF: $cpf\n";
echo "Registro Funcional: $registroFun\n";
echo "Data Nasc: $dataNasc\n";
echo "E-mail: $email\n";
echo "Senha (hash): $senhaHash\n";
?>  

*/

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');




?> 