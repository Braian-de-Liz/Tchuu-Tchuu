// FRONT-END\javascript\auth_chamadoDelete.js 

const botao_deletar_form = document.getElementById("hyper_confirmar"); 
const div_form_delete = document.getElementById("confirmar_chamado_delete"); 
const botao_abrir_form = document.getElementById("Deletar"); 


async function deletar_chamado(event) {
    event.preventDefault();

    const cpf_data = localStorage.getItem("usuario_cpf"); 
    const nome_chamado = document.getElementById("nome_de_chamado").value;
    const token = localStorage.getItem('token'); 

    console.log("DEBUG: Token presente?", !!token);
    console.log("DEBUG: CPF do LocalStorage:", cpf_data);
    console.log("DEBUG: Nome do Chamado do Input:", nome_chamado);

    if (!nome_chamado || nome_chamado.trim() === '') {
        alert("Chamado sem nome, preencha o campo 'Nome do Chamado'.");
        return false;
    }
    
    if (!cpf_data || cpf_data.length !== 11 || !token) { 
        alert("Sessão expirada ou CPF inválido. Faça login novamente.");
        localStorage.removeItem('token');
        window.location.href = '../index.html';
        return false;
    }


    try {
        // 🔑 MUDANÇA CRÍTICA: Construção da URL com Query Parameters
        const baseUrl = "https://tchuu-tchuu-server-chat.onrender.com/api/trens";
        const url_delete = new URL(baseUrl);
        
        // Adicionando CPF e nome chamado como parâmetros de consulta
        url_delete.searchParams.append("cpf_user", cpf_data);
        url_delete.searchParams.append("nome_chamado", nome_chamado);

        console.log("DEBUG: URL Final (DELETE):", url_delete.toString());

        const conexao = await fetch(url_delete.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        
        if (conexao.ok) {
            alert(`Chamado "${nome_chamado}" deletado com sucesso!`);
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

            alert(`Erro ao deletar o chamado: ${mensagemErro}`);
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
botao_deletar_form.addEventListener("click", deletar_chamado); 
document.getElementById("cancelar_delete").addEventListener("click", fechar_form);