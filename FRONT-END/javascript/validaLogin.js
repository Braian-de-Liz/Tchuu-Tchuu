
const checkzim = document.getElementById("check");
const senhaInput = document.getElementById('senha');
// let ver = false;

checkzim.addEventListener("change", () => {

    if (checkzim.checked) {
        senhaInput.type = "text";
    }

    else {
        senhaInput.type = "password";
    }

});


async function ValidaLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        alert("Campos não preenchidos");
        return false;
    }

    function ValidaEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    if (!ValidaEmail(email)) {
        alert('Email inválido');
        return false;
    }

    if (senha.length < 8) {
        alert("A senha deve ter pelo menos 8 caracteres.");
        return false;
    }

    try {

        const resposta = await fetch("https://tchuu-tchuu-server-chat.onrender.com/api/usu_login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ email, senha })
        });

        if (!resposta.ok) {
            const erroDate = await resposta.json();
            throw new Error(erroDate.mensagem || 'Erro desconhecido');
        }

        const data = await resposta.json();

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuarioId', data.usuario.id);
        localStorage.setItem('usuarioEmail', data.usuario.email);
        localStorage.setItem('usuarioNome', data.usuario.nome);

        document.getElementById('passou').innerHTML = "Seu login foi autorizado";


        window.location.href = 'Public/pagGeralDashboard.html';

    } catch (erro) {
        console.error('Erro no login:', erro);
        alert('Erro ao fazer login: ' + erro.message);
    }



    // return true;
}