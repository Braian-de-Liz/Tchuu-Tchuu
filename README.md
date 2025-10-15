# 🚆 Projeto TCHUU-TCHUU

**TCHUU-TCHUU** é um projeto desenvolvido pelos alunos do **Curso Técnico em Desenvolvimento de Sistemas** da **Escola SESI de Referência**. Seu principal objetivo é **Gerenciar Ferroramas**, aplicando na prática os conhecimentos adquiridos ao longo do curso.

➡️ **Acesse agora:** [https://tchuu-tchuu-front-end.onrender.com](https://tchuu-tchuu-front-end.onrender.com)

---

## 🎯 Propósito

Este projeto visa o **aprimoramento das habilidades em tecnologias Web**, tanto no **Front-end** quanto no **Back-end**, por meio da criação de uma aplicação **completa, funcional e integrada**.

---

## 🛠️ Tecnologias Utilizadas

## 🛠️ Tecnologias Utilizadas

### 🎨 Front-end
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" width="30"/> **HTML5**  
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="30"/> **CSS3**  
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="30"/> **JavaScript**  
- <img src="https://www.chartjs.org/media/logo-title.svg" alt="Chart.js" width="30"/> **Chart.js** — para criação de gráficos dinâmicos e interativos.

### ⚙️ Back-end
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="30"/> **Node.js**  
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="30"/> **Express**  
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP" width="30"/> **PHP**  
- <img src="https://raw.githubusercontent.com/websockets/ws/master/doc/ws-logo.svg" alt="ws" width="30"/> **ws (WebSocket)** — biblioteca NPM utilizada para comunicação em tempo real entre servidor e clientes.


### 💾 Banco de Dados
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="30"/> **PostgreSQL** (via [Neon.tech](https://neon.tech))

---

## ✨ Funcionalidades do Sistema

- 🚉 Simulação de rotas e estações ferroviárias  
- 💬 Chat em tempo real entre usuários  
- 🌐 Interface web interativa e responsiva  
- 🔐 Sistema de login e cadastro de usuários  
- 📊 Gerenciamento de trens e sensores (IoT)  
- 🔗 Integração entre front-end, back-end e banco de dados  

---

## 📁 Estrutura do Projeto

````
TCHUU-TCHUU/
├── BACK-END-NODEJS/                  
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── .env
│       ├── databases/
│       │   └── conectar_banco.js
│       ├── modulos/
│       │   ├── chatServer.js
│       │   └── ESP_Server.js
│       ├── routers/
│       │   └── usuario/
│       │       ├── deletarUsuarios.js
│       │       └── registrarUsuarios.js
│       └── server.js
│
├── BACK-END-PHP/                     
│   ├── APIs/
│   │   ├── salvar_trem.php
│   │   └── salvar_user.php
│   ├── bd.sql
│   └── index.php
│
├── Documentações/                   
│   ├── LICENSE
│   ├── Plano de Testes Tchuu-Tchuu.pdf
│   └── S.A requisitos Tchuu-Tchuu.pdf
│
└── FRONT-END/                       
    ├── Assets/                      
    │   ├── AnimaçãoScroll.css       
    │   ├── Desempenho.css           
    │   ├── fot.css                  
    │   ├── Frota.css                
    │   ├── Manutencao.css           
    │   ├── menulateral.css          
    │   ├── stylealerta.css          
    │   ├── stylechat.css            
    │   ├── styledash.css            
    │   ├── styleGestaoDeRota.css    
    │   ├── stylelogin.css           
    │   ├── stylesenha.css           
    │   ├── tremRegistro.css         
    │   ├── user.css                 
    │   └── imagens/
    │
    ├── javascript/                  
    │   ├── .gitignore
    │   ├── alteraSUB-ROTAS.js       
    │   ├── ChatJS.js                
    │   ├── containerdemanutenção.js 
    │   ├── GestaoDeRotaMenu.js      
    │   ├── GestaoRota.js            
    │   ├── GestaoRota2.js           
    │   ├── gestaoRotas.js           
    │   ├── GraficoDesempenho.js     
    │   ├── Lista Regex              
    │   ├── menu.js                  
    │   ├── menu-hamburguer-PC.js    
    │   ├── menu-Rotas.js            
    │   ├── Monitora.js              
    │   ├── Nodejs/                  
    │   │   ├── package.json
    │   │   └── package-lock.json
    │   ├── some-hambuer.js          
    │   ├── sume-rodape.js           
    │   ├── tentativa-deimplementaAPIdeCLima.js 
    │   ├── validaEmailSenhaRecupera.js 
    │   ├── validaLogin.js           
    │   ├── ValidaManutrem.js        
    │   ├── validaTrem.js            
    │   └── Valideregistro.js        
    │
    ├── Public/                    
    │   ├── enviaTremManu.html       
    │   ├── pagChat.html             
    │   ├── pagEsquecisenha.html     
    │   ├── pagFrota.html            
    │   ├── pagGeralDashboard.html   
    │   ├── pagGestaoRotas.html      
    │   ├── pagManutencao.html       
    │   ├── pagMonitora.html         
    │   ├── pagregistraTREM.html     
    │   ├── pagRegistro.html         
    │   └── pagUsuario.html          
    │
    └── index.html                   

├── package.json                     
├── package-lock.json
└── README.md                        

````


---

## 🏗️ Arquitetura Modular com Múltiplos Deploys

O sistema **TCHUU-TCHUU** foi desenvolvido com uma **arquitetura modular e descentralizada**, onde cada componente é **independente, escalável e implantado separadamente** — seguindo práticas reais de engenharia de software.

| Componente | Tecnologia | Deploy | Observações |
|-----------|------------|--------|-------------|
| **Front-end** | HTML, CSS, JavaScript | [https://tchuu-tchuu-front-end.onrender.com](https://tchuu-tchuu-front-end.onrender.com) | Hospedado no **Render** como site estático. Não consome horas de instância. |
| **Back-end Node.js** | Node.js + Express + WebSocket | [https://tchuu-tchuu-server-chat.onrender.com](https://tchuu-tchuu-server-chat.onrender.com) | Serviço **24/7** com keep-alive via `/acordar`. Responsável pelo chat e autenticação. |
| **Banco de Dados** | PostgreSQL | [Neon.tech](https://neon.tech) | Hosted em nuvem, com conexão segura via SSL. Acesso controlado por variáveis de ambiente. |

### ✅ Vantagens dessa Arquitetura:

- 🌐 **Escalabilidade**: Cada serviço pode ser escalado individualmente.
- 📈 **Profissionalismo**: Reflete arquiteturas reais de empresas como Spotify, Discord e GitHub.

> 💡 **Nenhum serviço depende do outro para funcionar.**  
> Isso é **microserviços**.

---

---

## 🔒 Segurança e Boas Práticas

O **TCHUU-TCHUU** adota medidas de segurança essenciais para garantir a integridade e confidencialidade dos dados dos usuários e a confiabilidade da aplicação como um todo:

- **🔐 Criptografia de Senhas com Bcrypt**  
  Todas as senhas são **criptografadas utilizando o algoritmo Bcrypt** antes de serem armazenadas no banco de dados.  
  Isso garante que mesmo em caso de vazamento, as credenciais permaneçam protegidas por hashes fortes e não reversíveis.

- **🌐 Política de CORS (Cross-Origin Resource Sharing)**  
  O servidor Node.js utiliza uma **configuração restritiva de CORS**, permitindo apenas o domínio oficial do front-end.  
  Essa medida impede que outras origens façam requisições não autorizadas, prevenindo ataques como *Cross-Site Request Forgery (CSRF)*.

- **⚙️ Variáveis de Ambiente (.env)**  
  Informações sensíveis, como **chaves JWT, credenciais de banco e URLs privadas**, são armazenadas em **variáveis de ambiente** através do arquivo `.env`, que **não é versionado** no repositório.  
  Isso evita a exposição de dados confidenciais e segue as boas práticas de segurança recomendadas para aplicações em produção.

> 🔒 *Essas práticas reforçam o compromisso do projeto com a segurança, privacidade e integridade das informações dos usuários.*


## 📚 Aprendizados Envolvidos

Durante o desenvolvimento do **TCHUU-TCHUU**, a equipe aplicou e desenvolveu habilidades em:

- 🧠 Lógica de programação  
- 🏗️ Estruturação de sistemas web completos  
- 🔄 Integração cliente-servidor com WebSocket e APIs REST  
- 🗃️ Gerenciamento de banco de dados relacional (PostgreSQL)  
- 🛠️ Versionamento de código com Git e GitHub  
- 🤝 Trabalho em equipe e organização com metodologias ágeis  
- 🌍 Deploy e monitoramento de aplicações em nuvem (Render, Neon.tech)  
- 🔒 Segurança de dados e uso de variáveis de ambiente  

---

> 🎓 *Projeto educacional com foco em prática, colaboração e construção de soluções reais.*  
> **Não é apenas um trabalho — é um sistema funcional, em produção, e com arquitetura de nível profissional.**
