// const div = document.createElement("div");

async function mostrar_dados_trem() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("usuário não logado, Como você entrou? se for bonzinho me conte no email delizbraian@gmail.com");
        window.location.href = "../index.html";
        return;
    }

    try {

        const consulta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/Trem_mostrar', {

            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Status da resposta:", resposta.status);

        const info = await resposta.json();
        console.log("Dados recebidos:", info);

        if (resposta.ok) {
            // const usuario = info.usuario;
            if (resposta.ok) {
                const dados = await resposta.json();

                /*             nome_campo.textContent = usuario.nome || 'Carregando...';
                            data_nasc_campo.textContent = usuario.data_nasc ? new Date(usuario.data_nasc).toLocaleDateString('pt-BR') : 'Carregando...';
                            email_campo.textContent = usuario.email || 'Carregando...';
                            cpf_campo.textContent = usuario.cpf || 'Carregando...';
                
                            nomeUser.textContent = usuario.nome || 'Usuário';
                
                            localStorage.setItem('usuarioNome', usuario.nome || 'Usuário'); */

            } else {

                alert('Erro: ' + info.mensagem);
                localStorage.removeItem('token');
                window.location.href = "../index.html";
            }
        }

    }


    catch (erro) {

        }

    
    };



    document.addEventListener("DOMContentLoaded", mostrar_dados_trem);