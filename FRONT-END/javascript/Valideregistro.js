function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.length === 11;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateTelefone(telefone) {
    telefone = telefone.replace(/[^\d]/g, '');
    return telefone.length >= 10;
}

function validaNumRegistro(registro) {
    return /^\d{12}$/.test(registro);
}


async function ValidaRegistro(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('tel').value.trim();
    const senha = document.getElementById('Senha').value.trim();
    const dataNasc = document.getElementById('DataNasc').value.trim();
    const RegistroFun = crypto.randomUUID(); 


    if (!cpf || !email || !telefone || !senha || !dataNasc || !nome) {
        alert("Preencha todos os campos.");
        return false;
    }

    if (!validateCPF(cpf)) {
        alert('CPF inválido. Deve conter exatamente 11 dígitos.');
        return false;
    }

    if (!validateTelefone(telefone)) {
        alert("Telefone inválido. Deve conter pelo menos 10 dígitos.");
        return false;
    }

    const [ano, mes, dia] = dataNasc.split('-').map(Number);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        alert("Data inválida.");
        return false;
    }

    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900) {
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