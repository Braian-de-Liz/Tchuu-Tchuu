async function validaRegistroTrem(event) {
    event.preventDefault();

    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const numero_de_Trem = crypto.randomUUID().substring(0, 20);
    const fabricante = document.getElementById('fabricante').value.trim();
    const dataRegistro = document.getElementById('DataRe').value.trim();
    const cpfUser = document.getElementById('RegistroUser').value.trim();
    const nomeUser = document.getElementById('NomeUser').value.trim();
/*    
    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const numero_de_Trem = crypto.randomUUID().substring(0, 20);
    const numero_de_Trem = crypto.randomUUID().substring(0, 20);
    const numero_de_Trem = crypto.randomUUID().substring(0, 20);
    const fabricante = document.getElementById('fabricante').value.trim();
    const fabricante = document.getElementById('fabricante').value.trim();
    const fabricante = document.getElementById('fabricante').value.trim();
    const dataRegistro = document.getElementById('DataRe').value.trim();
    const dataRegistro = document.getElementById('DataRe').value.trim();
    const dataRegistro = document.getElementById('DataRe').value.trim();
    const cpfUser = document.getElementById('RegistroUser').value.trim();
    const cpfUser = document.getElementById('RegistroUser').value.trim();
    const cpfUser = document.getElementById('RegistroUser').value.trim();
*/
    if (!nomeTrem || !numero_de_Trem || !fabricante || !dataRegistro || !cpfUser  || !nomeUser) {
        alert("Todos os dados são necessários. PREENCHA OS CAMPOS");
        return false;
    }

    if (isNaN(numero_de_Trem) || Number(numero_de_Trem) <= 0) {
        alert('O campo deve ser preenchido com números acima de 0');
        return false;
    }

    if (!/^\d{11}$/.test(cpfUser)) { //Quem Foi que inventou isso MEU DEUS.
        alert("CPF inválido");
        return false;
    }

    const data_parte = dataRegistro.split('-');
    if (data_parte.length !== 3) {
        alert("Data inválida");
        return false;
    }

    // if(nomeUser  ){}

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
        constructor(nomeTrem, numero_de_Trem, fabricante, cpfUser, dataRegistro, nomeUser) {
            this.nome = nome;
            this.numero = numero_de_Trem;
            this.fabricante = fabricante;
            this.cpfUser = cpfUser;
            this.dataRegistro = dataRegistro;
            this.NomeUser = nomeUser;
        }


    }


    const novoTrem = new Trem(nomeTrem, numero_de_Trem, fabricante, cpfUser, dataRegistro);

    //A APARENTE INVENÇÃO DE MODA PARECE TER DADO CERTO AGORA É SÓ ESPERAR

    try {

        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/trem_Cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(nomeTrem)
        });

        




    alert("Trem Registrado com sucesso");
    window.location.href = '../Public/pagMonitora.html';

    return true;
}
    catch {
    console.log("babuga");
    alert("ERRO");
}


}
