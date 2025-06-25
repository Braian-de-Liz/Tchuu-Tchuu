
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
    const NumFun = document.getElementById('NumFun').value.trim();


    if (!validadeEmail(email)) {
        alert('Email Inválido, tente novamente');
        return false;
    }

    if (!ValidaNumRegistro(NumFun)) {
        alert("Seu número de Funcionário ");
        return false;
    }





    alert('Dados Aprovados com Sucesso');
    document.getElementById('passou').innerHTML = ('André é Gay');

    document.getElementById("senhaVeio").style.display = 'block';
    document.getElementById('senhaVeio').style.animation = "aparecer 1s ease-in-out";


}


function SalvarNovaSenha() {
    const senhaNova = document.getElementById('senhaNova').value.trim();

    if (senhaNova.length < 8) {
        alert('Senha inválida. Ela deve conter no mínimo 8 caracteres.');
        return ;
    }

    alert('Senha redefinida com sucesso!');
  
    window.location.href = '../Public/paglogin.html';
}

