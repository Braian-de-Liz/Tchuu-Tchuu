function validaRegistroTrem(event) {
    event.preventDefault();


    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const numero_de_Trem = document.getElementById('numero_de_Trem').value.trim();
    const fabricante = document.getElementById('fabricante').value.trim();
    const dataRegistro = document.getElementById('DataRe').value.trim();
    const RegistroUser = document.getElementById('RegistroUser').value.trim();


    if (!nomeTrem || !numero_de_Trem || !fabricante || !dataRegistro || !RegistroUser) {
        alert("todos os dados são necessários, PREENCHA OS CAMPOS");
        return false;
    }

    if (isNaN(numero_de_Trem) || Number(numero_de_Trem) <= 0) {
        alert('O campo deve ser preenchido e com números acima de 0');
        return false;
    }


    if (!/^\d{12}$/.test(RegistroUser)) { //Quem foi que inventou isso PELO O AMOR DEUS
        alert("Número de Registro do usuário deve conter exatamente 12 dígitos numéricos.");
        return false;
    }


    const data_parte = dataRegistro.split('-');

    if (data_parte.length !== 3) {
        alert("Data inválida");
        return false;
    }

    const ano = parseInt(data_parte[0], 10);
    const mes = parseInt(data_parte[1], 10);
    const dia = parseInt(data_parte[2], 10);


    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        alert('Sua data não é um número');
        return false;
    }

    if (dia < 1 || dia > 31) {
        alert("Seu dia não é válido");
        return false;
    }
    
    if (mes > 12) {
        alert("Seu Mês não é válido");
        return false;
    }

    if (ano < 1900) {
        alert("Seu ano é inválido");
        return false;
    }




    alert("Trem Registrado com sucesso");



    return true;




}



