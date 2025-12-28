# 🚆 Projeto TCHUU-TCHUU

**TCHUU-TCHUU** é um ecossistema de gerenciamento ferroviário inteligente desenvolvido pelos alunos do **Curso Técnico em Desenvolvimento de Sistemas** da **Escola SESI de Referência**. O sistema aplica conceitos avançados de computação para gerenciar ferroramas e simular operações ferroviárias reais.

➡️ **Acesse o Web App:** [https://tchuu-tchuu-front-end.onrender.com](https://tchuu-tchuu-front-end.onrender.com)

➡️ **Acesse o Tchuu-Tchuu Desktop:** [Repositório Desktop](https://github.com/Guilherme-JSS/Tchuu-Tchuu_Desktop)

---

##  Propósito

Este projeto visa o **aprimoramento das habilidades em tecnologias Web**, tanto no **Front-end** quanto no **Back-end**, por meio da criação de uma aplicação **completa, funcional e integrada**, simulando um ambiente de produção real.

---

##  Tecnologias Utilizadas

###  Front-end
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" width="25"/> **HTML5**
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="25"/> **CSS3** 
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="25"/> **JavaScript (Vanilla)** — Lógica de interface e interatividade.
- <img src="https://www.chartjs.org/media/logo-title.svg" alt="Chart.js" width="25"/> **Chart.js** — Gráficos dinâmicos para telemetria e desempenho.

###  Back-end
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="25"/> **TypeScript** — Base do desenvolvimento, garantindo segurança de tipos e código escalável.
- <img src="https://fastify.dev/img/logos/fastify-white.svg" alt="Fastify" width="55"/> **Fastify** — Framework web de alta performance e baixo overhead para gerenciar APIs.
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="25"/> **Node.js** — Ambiente de execução do servidor.
- <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="bcrypt" width="25"/> **Bcrypt** — Segurança rigorosa através de hashing de senhas.
- <img src="https://cdn-icons-png.flaticon.com/512/1055/1055646.png" alt="WebSocket" width="25"/> **ws (WebSocket)** — Comunicação bidirecional em tempo real para chat e sensores.

###  Banco de Dados
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="25"/> **PostgreSQL** — Banco de dados relacional robusto (via [Neon.tech](https://neon.tech)).

---

##  Funcionalidades do Sistema

-  **Gestão de Malha:** Simulação e controle de rotas, trens e estações ferroviárias.
-  **Real-time Chat:** Comunicação instantânea entre operadores via WebSocket.
-  **Autenticação Segura:** Sistema completo de login, cadastro e recuperação de acesso.
-  **Monitoramento IoT:** Gerenciamento de sensores e telemetria de trens em tempo real.
-  **Módulo de Manutenção:** Registro e controle de status operacional da frota.

---

##  Estrutura do Projeto

````
Directory structure:
└── braian-de-liz-tchuu-tchuu/
    ├── README.md
    ├── package.json
    ├── BACK-END_NODEJS2/
    │   ├── package.json
    │   ├── TCHUU-TCHUU_DB.SQL
    │   ├── tsconfig.json
    │   └── src/
    │       ├── server.ts
    │       ├── connections/
    │       │   ├── chatServer.ts
    │       │   └── ESP_Server.ts
    │       ├── databases/
    │       │   └── conectar_banco.ts
    │       ├── hooks/
    │       │   ├── autenticar_id_jwt.ts
    │       │   └── consultar_DB.ts
    │       ├── routes/
    │       │   ├── dash/
    │       │   │   ├── dadosgraficos.ts
    │       │   │   └── getAlertas.ts
    │       │   ├── rotas_e_estacoes/
    │       │   │   ├── Atualizar_Rota.ts
    │       │   │   ├── atualizarPosicaoEstacao.ts
    │       │   │   ├── excluirEstacao.ts
    │       │   │   ├── ExcluirRota.ts
    │       │   │   ├── obterEstacao.ts
    │       │   │   ├── obterRotas.ts
    │       │   │   ├── salvarEstacao.ts
    │       │   │   └── salvarRota.ts
    │       │   ├── sensores/
    │       │   │   ├── alterarSensor.ts
    │       │   │   ├── cadastrarSensor.ts
    │       │   │   ├── deletarSensor.ts
    │       │   │   └── exibirSensores.ts
    │       │   ├── trens/
    │       │   │   ├── atualizar_trem.ts
    │       │   │   ├── deletar_trem.ts
    │       │   │   ├── mostrar_trem.ts
    │       │   │   └── registrar_trem.ts
    │       │   ├── trens_manutencao/
    │       │   │   ├── enviar_manutencao.ts
    │       │   │   ├── obter_manutencao.ts
    │       │   │   └── tirar_manutencao.ts
    │       │   └── usuario/
    │       │       ├── atualizarUsuario.ts
    │       │       ├── deletarUsuario.ts
    │       │       ├── loginUsuario.ts
    │       │       ├── mostrar_dadosUsuario.ts
    │       │       └── registrarUsuario.ts
    │       └── types/
    │           └── fastify.d.ts
    ├── Documentações/
    │   ├── Back-end_Nodejs.md
    │   └── LICENSE
    └── FRONT-END/
        ├── index.html
        ├── Assets/
        │   ├── AnimaçãoScroll.css
        │   ├── Desempenho.css
        │   ├── fot.css
        │   ├── Frota.css
        │   ├── Manutencao.css
        │   ├── menulateral.css
        │   ├── rotas_novas.css
        │   ├── sobre.css
        │   ├── stylealerta.css
        │   ├── stylechat.css
        │   ├── styledash.css
        │   ├── stylelogin.css
        │   ├── stylesenha.css
        │   ├── tremRegistro.css
        │   └── user.css
        ├── javascript/
        │   ├── AlterarDadosUsuario.js
        │   ├── alteraSUB-ROTAS.js
        │   ├── Atualizar_Sensor.js
        │   ├── autenticacao.js
        │   ├── auth_chamadoDelete.js
        │   ├── auth_tremDelete.js
        │   ├── ChamadoPopup.js
        │   ├── ChatJS.js
        │   ├── containerdemanutenção.js
        │   ├── dadosUser.js
        │   ├── deletar_validado.js
        │   ├── GestaoDeRotaMenu.js
        │   ├── GestaoRota.js
        │   ├── GestaoRota2.js
        │   ├── gestaoRotas.js
        │   ├── GraficoDesempenho.js
        │   ├── graficoSensores.js
        │   ├── listarAlertas.js
        │   ├── menu-hamburguer-PC.js
        │   ├── menu-Rotas.js
        │   ├── menu.js
        │   ├── Monitora.js
        │   ├── mostrar_dados_trens.js
        │   ├── mostrar_trem_manutencao.js
        │   ├── mostrarDados_sensor.js
        │   ├── notificacaodash.js
        │   ├── protegerPAG.js
        │   ├── render_menu.js
        │   ├── render_rodape.js
        │   ├── rotas_fetch.js
        │   ├── RotasSidebar.js
        │   ├── SensorDelete.js
        │   ├── SensorView.js
        │   ├── solicitar_delete_sensor.js
        │   ├── some-hambuer.js
        │   ├── sume-rodape.js
        │   ├── tentativa-deimplementaAPIdeCLima.js
        │   ├── valicacao_sensor.js
        │   ├── validaEmailSenhaRecupera.js
        │   ├── validaLogin.js
        │   ├── ValidaManutrem.js
        │   ├── validaTrem.js
        │   └── Valideregistro.js
        └── Public/
            ├── cadastrarSensor.html
            ├── enviaTremManu.html
            ├── pagChamados.html
            ├── pagChat.html
            ├── pagEsquecisenha.html
            ├── pagFrota.html
            ├── pagGeralDashboard.html
            ├── pagGestaoRotas.html
            ├── pagMonitora.html
            ├── pagregistraTREM.html
            ├── pagRegistro.html
            ├── pagUsuario.html
            └── sobre.html

````


---

##  Arquitetura Modular com Múltiplos Deploys

O sistema **TCHUU-TCHUU** foi desenvolvido com uma **arquitetura modular e descentralizada**, onde cada componente é **independente, escalável e implantado separadamente** — seguindo práticas reais de engenharia de software.

| Componente | Tecnologia | Deploy | Observações |
|-----------|------------|--------|-------------|
| **Front-end** | HTML, CSS, JavaScript | [https://tchuu-tchuu-front-end.onrender.com](https://tchuu-tchuu-front-end.onrender.com) | Hospedado no **Render** como site estático. Não consome horas de instância. |
| **Back-end Node.js** | Node.js + Fastify + Typescript + WebSocket | [https://tchuu-tchuu-server-chat.onrender.com](https://tchuu-tchuu-server-chat.onrender.com) | Serviço **24/7** com keep-alive via `/acordar`. Responsável pelo chat e autenticação. |
| **Banco de Dados** | PostgreSQL | [Neon.tech](https://neon.tech) | Hosted em nuvem, com conexão segura via SSL. Acesso controlado por variáveis de ambiente. |

###  Vantagens dessa Arquitetura:

-  **Escalabilidade**: Cada serviço pode ser escalado individualmente.
-  **Profissionalismo**: Reflete arquiteturas reais de empresas como Spotify, Discord e GitHub.

>  **Nenhum serviço depende do outro para funcionar.**  
> Isso é **microserviços**.

---

---

##  Segurança e Boas Práticas

O **TCHUU-TCHUU** adota medidas de segurança essenciais para garantir a integridade e confidencialidade dos dados dos usuários e a confiabilidade da aplicação como um todo:

- ** Criptografia de Senhas com Bcrypt**  
  Todas as senhas são **criptografadas utilizando o algoritmo Bcrypt** antes de serem armazenadas no banco de dados.  
  Isso garante que mesmo em caso de vazamento, as credenciais permaneçam protegidas por hashes fortes e não reversíveis.

- ** Política de CORS (Cross-Origin Resource Sharing)**  
  O servidor Node.js utiliza uma **configuração restritiva de CORS**, permitindo apenas o domínio oficial do front-end.  
  Essa medida impede que outras origens façam requisições não autorizadas, prevenindo ataques como *Cross-Site Request Forgery (CSRF)*.

- ** Variáveis de Ambiente (.env)**  
  Informações sensíveis, como **chaves JWT, credenciais de banco e URLs privadas**, são armazenadas em **variáveis de ambiente** através do arquivo `.env`, que **não é versionado** no repositório.  
  Isso evita a exposição de dados confidenciais e segue as boas práticas de segurança recomendadas para aplicações em produção.

>  *Essas práticas reforçam o compromisso do projeto com a segurança, privacidade e integridade das informações dos usuários.*


##  Aprendizados Envolvidos

Durante o desenvolvimento do **TCHUU-TCHUU**, a equipe aplicou e desenvolveu habilidades em:

-  Lógica de programação  
-  Estruturação de sistemas web completos  
-  Integração cliente-servidor com WebSocket e APIs REST  
-  Gerenciamento de banco de dados relacional (PostgreSQL)  
-  Versionamento de código com Git e GitHub  
-  Trabalho em equipe e organização com metodologias ágeis  
-  Deploy e monitoramento de aplicações em nuvem (Render, Neon.tech)  
-  Segurança de dados e uso de variáveis de ambiente  

---

>  *Projeto educacional com foco em prática, colaboração e construção de soluções reais.*  
> **Não é apenas um trabalho simples, é um sistema funcional, em produção, e com arquitetura distribuida.**
