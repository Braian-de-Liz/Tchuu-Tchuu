
function validadeEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function ValidaNumRegistro(RegistroFun) {
    return /^\d{12}$/.test(RegistroFun);
}

function ValidaSenhaRecuperacao(event) {
    event.preventDefault();


    const email = document.getElementById('email').value.trim();
    const NumFun = document.getElementById('Numfun').value.trim();


    if (!validadeEmail(email)) {
        alert('Email Inválido, tente novamente');
        return false;
    }

    if (!ValidaNumRegistro(NumFun)) {
        alert("Seu número de Funcionário ");
        return false;
    }





    alert('Dados Aprovados com Sucesso');
    document.getElementById('passou').innerHTML = ('Funcionou');



    return true
    //AGORA ME PERDI.


}

const id = document.getElementById('senhaVeio');

function mostrarSenhaDiv(id) {

    if (ValidaSenhaRecuperacao = true){
        // Oculta todos os conteúdos
        const todos = document.querySelectorAll('#senhaVeio');
        todos.forEach(el => el.style.display = 'none');
    
        // Mostra o conteúdo com o ID correspondente
        const alvo = document.getElementById(id);
        if (alvo) alvo.style.display = 'block';

    }
}

