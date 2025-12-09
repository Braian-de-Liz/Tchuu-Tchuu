function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function ValidaRegistro(event) {
    event.preventDefault();

    let cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const senha = document.getElementById('Senha').value.trim();
    const dataNasc = document.getElementById('DataNasc').value.trim();
    const RegistroFun = crypto.randomUUID().substring(0, 20);

    // 🔑 CORREÇÃO: Limpa o CPF antes de validar e enviar
    cpf = cpf.replace(/[^\d]/g, ''); 

    if (!cpf || !email || !senha || !dataNasc || !nome) {
        alert("Preencha todos os campos.");
        return false;
    }

    if (cpf.length !== 11) {
        alert('CPF inválido. Deve conter exatamente 11 dígitos.');
        return false;
    }

    const [ano, mes, dia] = dataNasc.split('-').map(Number);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        alert("Data inválida.");
        return false;
    }

    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1920) {
        alert("Data de nascimento inválida.");
        return false;
    }

    if (!validateEmail(email)) {
        alert("Email inválido.");
        return false;
    }

    if (senha.length < 8) {
        alert("Senha deve ter no mínimo 8 caracteres.");
        return false;
    }

    class Usuario {
        constructor(nome, cpf, email, senha, RegistroFun, dataNasc) {
            this.nome = nome;
            this.cpf = cpf;
            this.email = email;
            this.senha = senha;
            this.RegistroFun = RegistroFun;
            this.dataNasc = dataNasc;
        }
    }

    const NovoUsuario = new Usuario(nome, cpf, email, senha, RegistroFun, dataNasc);

    try {
        const response = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(NovoUsuario)
        });

        const data = await response.text();

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = '../index.html';
        }
        else {
            alert('Erro: ' + data);
        }
    } catch (error) {
        console.error('Erro na conexão:', error);
        alert('Falha ao conectar ao servidor.');
    }
}