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
    
    // Validação de segurança e presença do Token/CPF
    if (!cpf_data || cpf_data.length !== 11 || !token) { 
        alert("Sessão expirada ou CPF inválido. Faça login novamente.");
        localStorage.removeItem('token');
        window.location.href = '../index.html';
        return false;
    }

    // A classe dados_delete_trem e o body JSON não são mais necessários.

    try {
        // 🔑 MUDANÇA CRÍTICA: Construção da URL com Query Parameters
        const baseUrl = "https://tchuu-tchuu-server-chat.onrender.com/api/trens";
        const url_delete = new URL(baseUrl);
        
        // Adicionando CPF e nome do trem como parâmetros de consulta
        url_delete.searchParams.append("cpf_user", cpf_data);
        url_delete.searchParams.append("nome_trem", nome_trem);

        console.log("DEBUG: URL Final (DELETE):", url_delete.toString());

        const conexao = await fetch(url_delete.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
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