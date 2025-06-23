
function validadeEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function ValidaNumRegistro(RegistroFun) {
    return /^\d{12}$/.test(RegistroFun);
}

function ValidaSenhaRecuperacao(event){
    event.preventDefault();


    const email = document.getElementById('email').value.trim();
    const NumFun = document.getElementById('Numfun').value.trim();

    
    if(!validadeEmail(email)){
        alert('Email Inválido, tente novamente');
        return false;
    }

    if(!ValidaNumRegistro(NumFun)){
        alert("Seu número de Funcionário ");
        return false;
    }



    

    alert('Dados Aprovados com Sucesso');
    document.getElementById('passou').innerHTML = ('Funcionou');

    return true
}

