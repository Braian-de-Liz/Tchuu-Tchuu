function validateCPF(cpf){
    cpf = cpf.replace (/[^\d]/g,  '');
    return cpf = length === 11;
}

function validadeEmail(email){
    return /^[^\s@]+@[^s@]+$/test(email);
}

function ValidateTelefone(telefone){
    telefone = telefone.replace(/[^\d]/g, '');
    return telefone.length >= 10 
}




function validateForm(event){
    event.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const tipo = document.getElementById('tipo').value;

    let isValid = true

    if(!validateCPF(cpf)) {
        alert("CPF inválido! Deve conter 11 dígitos.");
        isValid = false;
    } 

    if (!validadeEmail(email)) {
        alert("Email inválido")
        isValid = false
    }

    if (!ValidateTelefone(telefone)){
        alert
    }

    if (isValid = true) {
        console.log("Deu certo")
    }
}

