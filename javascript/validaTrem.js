function validaRegistroTrem(event) {
    event.preventDefault(); 

    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const numero_de_Trem = document.getElementById('numero_de_Trem').value.trim();
    const fabricante = document.getElementById('fabricante').value.trim();
    const dataRegistro = document.getElementById('DataRe').value.trim();
    const registroUser = document.getElementById('RegistroUser').value.trim();

    if (!nomeTrem || !numero_de_Trem || !fabricante || !dataRegistro || !registroUser) {
        alert("Todos os dados são necessários. PREENCHA OS CAMPOS");
        return false;
    }

    if (isNaN(numero_de_Trem) || Number(numero_de_Trem) <= 0) {
        alert('O campo deve ser preenchido com números acima de 0');
        return false;
    }

    if (!/^\d{12}$/.test(registroUser)) { //Quem Foi que inventou isso MEU DEUS.
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

    if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900) {
        alert("Data inválida");
        return false;
    }




    //DAQUI PARA BAIXO É BRAIAN QUERENDO INVENTAR MODA, MAS SE DER CERTO JÁ PODEREMOS PASSAR O TREM INTEIRO PARA O BANCO DE DADOS 

    class Trem {
        constructor(nome, numero, fabricante, registroUser, dataRegistro) {
            this.nome = nome;
            this.numero = numero;
            this.fabricante = fabricante;
            this.registroUser = registroUser;
            this.dataRegistro = dataRegistro;
        }


    }


    const novoTrem = new Trem(nomeTrem, numero_de_Trem, fabricante, registroUser, dataRegistro);

    //A APARENTE INVENÇÃO DE MODA PARECE TER DADO CERTO AGORA É SÓ ESPERAR


    alert("Trem Registrado com sucesso");
    
    window.location.href = '../Public/pagMonitora.html';

    return true;



}
