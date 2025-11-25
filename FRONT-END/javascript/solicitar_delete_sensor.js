// FRONT-END\javascript\auth_sensorDelete.js 

const botao_deletar_form = document.getElementById("hyper_confirmar_sensor"); 
const div_form_delete = document.getElementById("confirmar_sensor_delete"); 
const botao_abrir_form = document.getElementById("Deletar_Sensor"); 


async function deletar_sensor(event) {
    event.preventDefault();

    const cpf_data = localStorage.getItem("usuario_cpf"); 
    const nome_sensor = document.getElementById("nome_do_sensor").value;
    const token = localStorage.getItem('token'); 

    console.log("DEBUG: Token presente?", !!token);
    console.log("DEBUG: CPF do LocalStorage:", cpf_data);
    console.log("DEBUG: Nome do Sensor do Input:", nome_sensor);

    if (!nome_sensor || nome_sensor.trim() === '') {
        alert("Sensor sem nome. Preencha o campo 'Nome/ID do Sensor'.");
        return false;
    }
    
    if (!cpf_data || cpf_data.length !== 11 || !token) { 
        alert("Sessão expirada ou CPF inválido. Faça login novamente.");
        localStorage.removeItem('token');
        window.location.href = '../index.html';
        return false;
    }


    try {
        const baseUrl = "https://tchuu-tchuu-server-chat.onrender.com/api/sensores"; 
        const url_delete = new URL(baseUrl);
        
        url_delete.searchParams.append("cpf_user", cpf_data);
        url_delete.searchParams.append("nome_sensor", nome_sensor); 

        console.log("DEBUG: URL Final (DELETE):", url_delete.toString());

        const conexao = await fetch(url_delete.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        
        if (conexao.ok) {
            alert(`Sensor "${nome_sensor}" deletado com sucesso!`);
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

            alert(`Erro ao deletar o sensor: ${mensagemErro}`);
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

if (botao_abrir_form) {
    botao_abrir_form.addEventListener('click', form_aparece); 
}
if (botao_deletar_form) {
    botao_deletar_form.addEventListener("click", deletar_sensor); 
}
const cancelar_delete = document.getElementById("cancelar_delete_sensor");
if (cancelar_delete) {
    cancelar_delete.addEventListener("click", fechar_form);
}