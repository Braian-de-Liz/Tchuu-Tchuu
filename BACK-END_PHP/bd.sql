CREATE DATABASE TCHUU_TCHUU_BANCO;

CREATE TABLE usuarios(
    pk_usuario INT PRIMARY KEY AUTO_INCREMENT, 
    nome_usuario VARCHAR(50),
    email_usuario VARCHAR(50),
    idade_usuario INT NOT NULL,
    senha_usuario VARCHAR(20)
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