CREATE DATABASE TCHUU_TCHUU_BANCO;

CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf CHAR(11) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  registro_fun VARCHAR(20),
  data_nasc DATE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trens(
  pk_trem INT PRIMARY KEY AUTO_INCREMENT,
  nome_trem VARCHAR(50),
  fabricante VARCHAR(50),
  data_registro DATE,
  fk_usuario INT NOT NULL,
  FOREIGN KEY (fk_usuario) REFERENCES usuarios(pk_usuario)
);

CREATE TABLE trens_manutencao(
  problema VARCHAR(100) NOT NULL,
  data_manutencao DATE NOT NULL,
  tipo_problema VARCHAR(50) NOT NULL, 
  fk_trem INT NOT NULL,  
  FOREIGN KEY (fk_trem) REFERENCES trens(pk_trem)
);