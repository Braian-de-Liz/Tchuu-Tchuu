function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.length === 11;
}

function validadeEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function ValidateTelefone(telefone) {
    telefone = telefone.replace(/[^\d]/g, '');
    return telefone.length >= 10;
}

function ValidaNumRegistro(RegistroFun) {
    return /^\d{12}$/.test(RegistroFun);
}

function ValidaRegistro(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('tel').value.trim();
    const senha = document.getElementById('Senha').value.trim();
    const RegistroFun = document.getElementById('RegistroFun').value.trim();
    const dataNasc = document.getElementById('DataNasc').value.trim();

    if (!cpf || !email || !telefone || !senha || !RegistroFun || !dataNasc) {
        alert("Preencha todos os campos.");
        return false;
    }

    if (!validateCPF(cpf)) {
        alert('CPF inválido. Deve conter exatamente 11 dígitos numéricos.');
        return false;
    }

    if (!ValidaNumRegistro(RegistroFun)) {
        alert("Número de registro inválido. Deve conter exatamente 12 dígitos.");
        return false;
    }

    if (!ValidateTelefone(telefone)) {
        alert("Telefone inválido. Deve conter pelo menos 10 dígitos.");
        return false;
    }

    const data_parte = dataNasc.split('-');
    
    if (data_parte.length !== 3) {
        alert("Data inválida.");
        return false;
    }

    const ano = parseInt(data_parte[0], 10);
    const mes = parseInt(data_parte[1], 10);
    const dia = parseInt(data_parte[2], 10);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        alert("Data contém valores inválidos.");
        return false;
    }

    if (dia < 1 || dia > 31) {
        alert("Dia inválido.");
        return false;
    }

    if (mes < 1 || mes > 12) {
        alert("Seu mês nem existe, inválido.");
        return false;
    }

    if (ano < 1900) {
        alert("Seu ano é inválido.");
        return false;
    }

    if (!validadeEmail(email)) {
        alert("Email inválido.");
        return false;
    }

    if (senha.length < 8) {
        alert("Senha deve ter no mínimo 8 caracteres.");
        return false;
    }

    alert("Cadastro realizado com sucesso!");
    window.location.href = '../Public/paglogin.html';
    return true;
}