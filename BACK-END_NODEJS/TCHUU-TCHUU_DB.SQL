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
  criado_em TIMESTAMP DEFAULT 
);

--
--
--
CREATE TABLE IF NOT EXISTS sensores (
  id_sensor SERIAL PRIMARY KEY,
  nome_sensor VARCHAR(255) NOT NULL,
  tipo_sensor VARCHAR(100),
  localizacao VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  ou não data_registro TIMESTAMP DEFAULT 
);

--
--
--
CREATE TABLE IF NOT EXISTS dados_sensores (
  id_dado_sensor SERIAL PRIMARY KEY,
  fk_id_sensor INTEGER NOT NULL,
  fk_id_rota INTEGER NOT NULL,
  carimbo_data_dado_sensor TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valor_sensor VARCHAR(255) NOT NULL,
  FOREIGN KEY (fk_id_sensor) REFERENCES sensores(id_sensor),
  FOREIGN KEY (fk_id_rota) REFERENCES rotas(id_rota)
);

--
--
--
CREATE TABLE estacoes(
  id BIGSERIAL PRIMARY KEY nome VARCHAR(100) UNIQUE NOT NULL,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  data_criacao TIMESTAMP,
  DEFAULT 'CURRENT_TIMESTAMP' id_usuario_criador BIGINT
);

CONSTRAINT fk_estacoes_usuario FOREIGN KEY (id_usuario_criador) REFERENCES public.usuarios (id) ON DELETECASCADE.CONSTRAINT estacoes_nome_key UNIQUE (nome) CONSTRAINT estacoes_pkey PRIMARY KEY (id) UNIQUE INDEX estacoes_nome_key … USING BTREE (nome) UNIQUE INDEX estacoes_pkey … USING BTREE (id) INDEX idx_estacoes_nome … USING BTREE (nome) --
--
--
CREATE TABLE rotas (
  id BIGSERIAL PRIMARY KEY nome VARCHAR(100),
  UNIQUE NOT NULL descricao TEXT distancia_km NUMERIC(8, 2),
  tempo_estimado_min INTEGER data_criacao,
  TIMESTAMP DEFAULT 'CURRENT_TIMESTAMP'
);

CONSTRAINT rotas_nome_key UNIQUE (nome),
CONSTRAINT rotas_pkey PRIMARY KEY (id),
INDEX idx_rotas_nome … USING BTREE (nome),
UNIQUE INDEX rotas_nome_key … USING BTREE (nome) UNIQUE,
INDEX rotas_pkey … USING BTREE (id) CREATE TABLE IF NOT EXISTS rota_estacoes (
  id BIGSERIAL PRIMARY KEY,
  id_trem BIGINT NOT NULL,
  descricao_problema TEXT NOT NULL,
  data_abertura DATE NOT NULL DEFAULT CURRENT_DATE,
  data_inicio DATE,
  data_previsao_conclusao DATE,
  data_conclusao DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  custo_estimado DECIMAL(10, 2),
  custo_real DECIMAL(10, 2),
  tecnico_responsavel VARCHAR(100),
  id_usuario_abertura BIGINT NOT NULL,
  id_usuario_conclusao BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
--
ALTER TABLE
  manutencoes
ADD
  CONSTRAINT fk_manutencao_trem FOREIGN KEY (id_trem) REFERENCES trens(id) ON DELETE CASCADE;

ALTER TABLE
  manutencoes
ADD
  CONSTRAINT fk_manutencao_usuario_abertura FOREIGN KEY (id_usuario_abertura) REFERENCES usuarios(id) ON DELETE CASCADE;

ALTER TABLE
  manutencoes
ADD
  CONSTRAINT fk_manutencao_usuario_conclusao FOREIGN KEY (id_usuario_conclusao) REFERENCES usuarios(id) ON DELETE
SET
  NULL;

CREATE INDEX IF NOT EXISTS idx_manutencoes_id_trem ON manutencoes(id_trem);

CREATE INDEX IF NOT EXISTS idx_manutencoes_status ON manutencoes(status);

CREATE INDEX IF NOT EXISTS idx_manutencoes_data_abertura ON manutencoes(data_abertura);

CREATE INDEX IF NOT EXISTS idx_manutencoes_id_usuario_abertura ON manutencoes(id_usuario_abertura);

CREATE TABLE IF NOT EXISTS chamados_manutencao (
  id BIGSERIAL PRIMARY KEY,
  id_trem BIGINT NOT NULL,
  descricao_problema TEXT NOT NULL,
  descricao_detalhada TEXT,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_conclusao DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  cpf_usuario_abertura CHAR(11) NOT NULL,
  FOREIGN KEY (id_trem) REFERENCES trens(id) ON DELETE CASCADE,
  FOREIGN KEY (cpf_usuario_abertura) REFERENCES usuarios(cpf) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chamados_manutencao_id_trem ON chamados_manutencao(id_trem);

CREATE INDEX IF NOT EXISTS idx_chamados_manutencao_status ON chamados_manutencao(status);

CREATE INDEX IF NOT EXISTS idx_chamados_manutencao_data_inicio ON chamados_manutencao(data_inicio);

CREATE INDEX IF NOT EXISTS idx_chamados_manutencao_cpf_usuario ON chamados_manutencao(cpf_usuario_abertura);





CREATE TABLE IF NOT EXISTS leituras_sensores (
    id BIGSERIAL PRIMARY KEY,
    id_trem BIGINT NOT NULL, 
    tipo_sensor VARCHAR(50) NOT NULL, 
    valor TEXT NOT NULL,
    timestamp_leitura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_trem) REFERENCES trens(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leituras_sensores_id_trem ON leituras_sensores(id_trem);
CREATE INDEX IF NOT EXISTS idx_leituras_sensores_tipo_sensor ON leituras_sensores(tipo_sensor);
CREATE INDEX IF NOT EXISTS idx_leituras_sensores_timestamp ON leituras_sensores(timestamp_leitura);