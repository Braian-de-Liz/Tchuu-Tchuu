<?php 

//impede cache
header('Content-Tpe: text/plain; charset=utf-8');

//Lê o corpo da requisição (JSON enviado pelo JS)
$json = file_get_contents('php://input');

//Decodifica o JSON para array associativo
$data= json_decode($json, true);

//Verifica se houver erro na decodificação

if(json_last_error() !== JSON_ERROR_NONE) {
    echo "Erro: JSON inválido";
    exit; 
}



?>