// FRONT-END\javascript\auth_tremDelete.js 

const botao_deletar_form = document.getElementById("hyper_confirmar"); 
const div_form_delete = document.getElementById("confirmar_trem_delete"); 
const botao_abrir_form = document.getElementById("Deletar"); 


async function deletar_trem(event) {
    event.preventDefault();

    const cpf_data = localStorage.getItem("usuario_cpf"); 
    const nome_trem = document.getElementById("nome_de_trem").value;
    const token = localStorage.getItem('token'); 

    console.log("DEBUG: Token presente?", !!token);
    console.log("DEBUG: CPF do LocalStorage:", cpf_data);
    console.log("DEBUG: Nome do Trem do Input:", nome_trem);

    if (!nome_trem || nome_trem.trim() === '') {
        alert("Trem sem nome, preencha o campo 'Nome do Trem'.");
        return false;
    }
    
    if (!cpf_data || cpf_data.length !== 11) { 
        alert("Erro de Autenticação: CPF não encontrado ou inválido. Redirecionando.");
        window.location.href = '../index.html';
        return false;
    }

    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = '../index.html';
        return false;
    }

    class dados_delete_trem {
        constructor(cpf_user, nome_trem) {
            this.cpf_user = cpf_user; 
            this.nome_trem = nome_trem;
        }
    }

    try {
        const nova_request = new dados_delete_trem(cpf_data, nome_trem);

        console.log("DEBUG: Corpo da Requisição (JSON Final):", JSON.stringify(nova_request));

        const conexao = await fetch("https://tchuu-tchuu-server-chat.onrender.com/api/trem", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(nova_request)
        });
        
        if (conexao.ok) {
            alert(`Trem "${nome_trem}" deletado com sucesso!`);
            window.location.reload(); 
        } else {
            const data = await conexao.json().catch(() => ({ mensagem: 'Erro desconhecido.' }));
            const mensagemErro = data.mensagem || conexao.statusText;

            if (conexao.status === 401 || conexao.status === 403) {
                alert(`Sessão expirada. Redirecionando. Erro: ${mensagemErro}`);
                localStorage.removeItem('token');
                window.location.href = "../index.html";
                return;
            }

            alert(`Erro ao deletar o trem: ${mensagemErro}`);
            console.error(`Erro ${conexao.status}:`, mensagemErro);
        }

    } catch (erro) {
        alert("Não foi possível conectar ao servidor: " + erro.message);
        console.error("Erro na requisição:", erro);
    }
}

function form_aparece(e) {
    e.preventDefault(); 
    div_form_delete.style.display = 'flex';
}

function fechar_form() {
    div_form_delete.style.display = 'none';
}

botao_abrir_form.addEventListener('click', form_aparece); 
botao_deletar_form.addEventListener("click", deletar_trem); 
document.getElementById("cancelar_delete").addEventListener("click", fechar_form);