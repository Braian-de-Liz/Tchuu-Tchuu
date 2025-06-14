window.onload = function () {
    document.getElementById("Login").addEventListener("submit", validaRegistroTrem);
};

function validaRegistroTrem(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const numeroTrem = document.getElementById("numeroTrem").value.trim();
    const fabricante = document.getElementById("fabricante").value.trim();
    const dataRegistro = document.getElementById("dataRe").value.trim();

    if (nome === "") {
        alert("Por favor, preencha o nome do trem.");
        return;
    }

    if (numeroTrem === "" || isNaN(numeroTrem) || Number(numeroTrem) <= 0) {
        alert("Por favor, insira um número de registro válido.");
        return;
    }

    if (fabricante === "") {
        alert("Por favor, preencha o nome do fabricante.");
        return;
    }

    if (dataRegistro === "") {
        alert("Por favor, selecione a data de registro.");
        return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    if (dataRegistro > hoje) {
        alert("A data de registro não pode ser no futuro.");
        return;
    }

    document.getElementById("Login").submit();
}