CREATE TABLE trens (
  id BIGSERIAL PRIMARY KEY,
  nome_trem VARCHAR(100) NOT NULL,
  numero INTEGER NOT NULL UNIQUE,
  fabricante VARCHAR(100) NOT NULL,  
  data_registro DATE NOT NULL,
  cpf_user CHAR(11) NOT NULL,
  FOREIGN KEY (cpf_user) REFERENCES usuarios(cpf) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS sensores (
    id_sensor SERIAL PRIMARY KEY,
    nome_sensor VARCHAR(255) NOT NULL,
    tipo_sensor VARCHAR(100), 
    localizacao VARCHAR(255), 
    ativo BOOLEAN DEFAULT TRUE,  ou não
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS dados_sensores (
    id_dado_sensor SERIAL PRIMARY KEY, 
    fk_id_sensor INTEGER NOT NULL,  
    fk_id_rota INTEGER NOT NULL,     
    carimbo_data_dado_sensor TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    valor_sensor VARCHAR(255) NOT NULL,
    FOREIGN KEY (fk_id_sensor) REFERENCES sensores(id_sensor),
    FOREIGN KEY (fk_id_rota) REFERENCES rotas(id_rota)
);