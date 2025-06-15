function ValidaLogin(event) {
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

    document.getElementById('passou').innerHTML = "Seu login foi autorizado";


        window.location.href='../Public/pagGeralDashboard.html';


    return true;
}