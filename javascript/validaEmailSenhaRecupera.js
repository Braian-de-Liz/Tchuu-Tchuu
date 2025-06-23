
function validadeEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


function ValidaSenhaRecuperacao(event){
    event.preventDefault();


    const email = document.getElementById('email').value.trim();


    if(!validadeEmail(email)){
        alert('Email Inválido, tente novamente');
        return false;
    }


    alert('Email Identificado com Sucesso');

    document.getElementById('passou').innerHTML = ('Funcionou');

    return true
}

