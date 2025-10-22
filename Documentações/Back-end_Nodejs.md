openapi: 3.0.0
info:
  title: API do Tchuu-Tchuu
  description: API RESTful para gerenciamento de trens, usuários e sensores do sistema Tchuu-Tchuu.
  version: 1.0.0
  contact:
    name: Equipe Tchuu-Tchuu
    email: contato@tchuu-tchuu.com # Substituir por um email real se existir

# --- Servidores ---
servers:
  - url: https://tchuu-tchuu-server-chat.onrender.com # URL do backend Node.js
    description: Servidor principal da API do Tchuu-Tchuu

# --- Caminhos (Endpoints) ---
paths:
  # --- Usuários ---
  /usuarios/registrar:
    post:
      summary: Registrar um novo usuário
      tags:
        - Usuários
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - senha
                - nome # Assumindo que nome é necessário
                - cpf # Assumindo que CPF é necessário
              properties:
                email:
                  type: string
                  format: email
                  example: "novo.usuario@email.com"
                senha:
                  type: string
                  format: password
                  example: "minhaSenha123"
                nome:
                  type: string
                  example: "João Silva"
                cpf:
                  type: string
                  pattern: "^\\d{11}$" # 11 dígitos numéricos
                  example: "12345678901"
                data_nasc: # Assumindo que pode ser opcional no registro
                  type: string
                  format: date
                  example: "1990-05-15"
      responses:
        '201':
          description: Usuário registrado com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Usuário registrado com sucesso!"
                  id:
                    type: integer
                    example: 123
        '400':
          $ref: '#/components/responses/Erro400'
        '500':
          $ref: '#/components/responses/Erro500'

  /usuarios/login:
    post:
      summary: Autenticar um usuário
      tags:
        - Usuários
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - senha
              properties:
                email:
                  type: string
                  format: email
                  example: "usuario.exemplo@email.com"
                senha:
                  type: string
                  format: password
                  example: "minhaSenha123"
      responses:
        '200':
          description: Login bem-sucedido. Retorna token JWT e dados do usuário.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Login realizado com sucesso!"
                  token:
                    type: string
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  usuario:
                    type: object
                    properties:
                      id:
                        type: integer
                        example: 123
                      nome:
                        type: string
                        example: "João Silva"
                      email:
                        type: string
                        format: email
                        example: "usuario.exemplo@email.com"
        '400':
          $ref: '#/components/responses/Erro400'
        '401':
          description: Credenciais inválidas.
          content:
            application/json:
              schema:
                type: object
                properties:
                  erro:
                    type: string
                    example: "Email ou senha incorretos."
        '500':
          $ref: '#/components/responses/Erro500'

  /usuarios/{id}:
    get:
      summary: Obter dados de um usuário específico
      tags:
        - Usuários
      parameters:
        - name: id
          in: path
          required: true
          description: ID do usuário
          schema:
            type: integer
      responses:
        '200':
          description: Dados do usuário retornados com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    example: 123
                  nome:
                    type: string
                    example: "João Silva"
                  email:
                    type: string
                    format: email
                    example: "usuario.exemplo@email.com"
                  cpf:
                    type: string
                    example: "12345678901"
                  data_nasc:
                    type: string
                    format: date
                    example: "1990-05-15"
        '404':
          description: Usuário não encontrado.
        '500':
          $ref: '#/components/responses/Erro500'
    put:
      summary: Atualizar dados de um usuário
      tags:
        - Usuários
      parameters:
        - name: id
          in: path
          required: true
          description: ID do usuário
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties: # Campos opcionais para atualização
                email:
                  type: string
                  format: email
                  example: "novo.email@email.com"
                senha:
                  type: string
                  format: password
                  example: "novaSenha456"
                nome:
                  type: string
                  example: "João da Silva"
      responses:
        '200':
          description: Usuário atualizado com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Usuário atualizado com sucesso!"
        '400':
          $ref: '#/components/responses/Erro400'
        '404':
          description: Usuário não encontrado.
        '500':
          $ref: '#/components/responses/Erro500'
    delete:
      summary: Deletar um usuário
      tags:
        - Usuários
      parameters:
        - name: id
          in: path
          required: true
          description: ID do usuário
          schema:
            type: integer
      responses:
        '200':
          description: Usuário deletado com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Usuário deletado com sucesso!"
        '404':
          description: Usuário não encontrado.
        '500':
          $ref: '#/components/responses/Erro500'

  # --- Trens ---
  /trens/registrar:
    post:
      summary: Registrar um novo trem
      tags:
        - Trens
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - id
                - nome
                - linha
                - velocidade
                - latitude
                - longitude
              properties:
                id:
                  type: integer
                  example: 1
                nome:
                  type: string
                  example: "Trem Expresso 01"
                linha:
                  type: string
                  example: "Linha 1 - Azul"
                velocidade:
                  type: number
                  format: float
                  example: 45.5
                latitude:
                  type: number
                  format: float
                  example: -23.5505
                longitude:
                  type: number
                  format: float
                  example: -46.6333
      responses:
        '201':
          description: Trem registrado com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Trem registrado com sucesso!"
        '400':
          $ref: '#/components/responses/Erro400'
        '500':
          $ref: '#/components/responses/Erro500'

  /trens/atualizar/{id}:
    put:
      summary: Atualizar dados de um trem existente
      tags:
        - Trens
      parameters:
        - name: id
          in: path
          required: true
          description: ID do trem
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                nome:
                  type: string
                  example: "Trem Expresso 01 Atualizado"
                linha:
                  type: string
                  example: "Linha 2 - Verde"
                velocidade:
                  type: number
                  format: float
                  example: 50.0
                latitude:
                  type: number
                  format: float
                  example: -23.5600
                longitude:
                  type: number
                  format: float
                  example: -46.6400
      responses:
        '200':
          description: Trem atualizado com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Trem atualizado com sucesso!"
        '400':
          $ref: '#/components/responses/Erro400'
        '404':
          description: Trem não encontrado.
        '500':
          $ref: '#/components/responses/Erro500'

  /trens/{id}:
    get:
      summary: Obter dados de um trem específico
      tags:
        - Trens
      parameters:
        - name: id
          in: path
          required: true
          description: ID do trem
          schema:
            type: integer
      responses:
        '200':
          description: Dados do trem retornados com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                    example: 1
                  nome:
                    type: string
                    example: "Trem Expresso 01"
                  linha:
                    type: string
                    example: "Linha 1 - Azul"
                  velocidade:
                    type: number
                    format: float
                    example: 45.5
                  latitude:
                    type: number
                    format: float
                    example: -23.5505
                  longitude:
                    type: number
                    format: float
                    example: -46.6333
        '404':
          description: Trem não encontrado.
        '500':
          $ref: '#/components/responses/Erro500'

    delete:
      summary: Deletar um trem
      tags:
        - Trens
      parameters:
        - name: id
          in: path
          required: true
          description: ID do trem
          schema:
            type: integer
      responses:
        '200':
          description: Trem deletado com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Trem deletado com sucesso!"
        '404':
          description: Trem não encontrado.
        '500':
          $ref: '#/components/responses/Erro500'

  # --- Sensores ---
  /sensores/cadastrar:
    post:
      summary: Cadastrar um novo sensor
      tags:
        - Sensores
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - id_trem
                - tipo
                - valor
              properties:
                id_trem:
                  type: integer
                  example: 1
                tipo:
                  type: string
                  example: "temperatura"
                valor:
                  type: number
                  format: float
                  example: 22.5
      responses:
        '201':
          description: Sensor cadastrado com sucesso.
          content:
            application/json:
              schema:
                type: object
                properties:
                  mensagem:
                    type: string
                    example: "Sensor cadastrado com sucesso!"
        '400':
          $ref: '#/components/responses/Erro400'
        '500':
          $ref: '#/components/responses/Erro500'

  # --- WebSocket (Chat) ---
  # Endpoint WebSocket não é documentado como um endpoint REST convencional
  # mas pode ser descrito como uma conexão.
  /ws:
    get:
      summary: Conexão WebSocket para o Chat
      description: |
        Endpoint para estabelecer uma conexão WebSocket com o servidor de chat.
        Requer autenticação via token JWT enviado nos cabeçalhos ou na URL.
        Exemplo de URL: `wss://tchuu-tchuu-server-chat.onrender.com/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
      tags:
        - WebSocket
      parameters:
        - name: token
          in: query
          required: true
          description: Token JWT do usuário autenticado
          schema:
            type: string
      responses:
        '101':
          description: Mudança de protocolo para WebSocket bem-sucedida.
        '401':
          description: Token inválido ou ausente.
        '500':
          $ref: '#/components/responses/Erro500'

# --- Componentes Reutilizáveis ---
components:
  responses:
    Erro400:
      description: Requisição inválida (Bad Request).
      content:
        application/json:
          schema:
            type: object
            properties:
              erro:
                type: string
                example: "Campos obrigatórios ausentes ou inválidos."
    Erro500:
      description: Erro interno do servidor.
      content:
        application/json:
          schema:
            type: object
            properties:
              erro:
                type: string
                example: "Ocorreu um erro interno no servidor."

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Token JWT necessário para endpoints protegidos.

# --- Segurança Geral ---
# Exemplo: Aplicar BearerAuth a todos os endpoints (exceto os de autenticação)
security:
  - BearerAuth: []

tags:
  - name: Usuários
    description: Operações relacionadas a usuários
  - name: Trens
    description: Operações relacionadas a trens
  - name: Sensores
    description: Operações relacionadas a sensores
  - name: WebSocket
    description: Conexão para comunicação em tempo real (Chat)