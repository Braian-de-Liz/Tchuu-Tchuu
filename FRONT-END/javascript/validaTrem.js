const botao_registra = document.getElementById("botao_registra");



async function validaRegistroTrem(event) {
    event.preventDefault();

    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    // let numero_de_Trem = Math.floor(Math.random() * 999999999999) + 1000;
    // let numero_de_Trem = Math.floor(Math.random() * 2147483647) + 1;
    let numero_de_Trem = Math.floor(Math.random() * 999999) + 1;
    const fabricante = document.getElementById('fabricante').value.trim();
    const dataRegistro = document.getElementById('DataRe').value.trim();
    const cpfUser = document.getElementById('RegistroUser').value.trim();

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
    if (!nomeTrem || !numero_de_Trem || !fabricante || !dataRegistro || !cpfUser) {
        alert("Todos os dados são necessários. PREENCHA OS CAMPOS");
        return false;
    }


    /*    if (isNaN(numero_de_Trem) || Number(numero_de_Trem) <= 0) {
        alert('O campo deve ser preenchido com números acima de 0');
        return false;
        } */

    if (!/^\d{11}$/.test(cpfUser)) {
        alert("CPF inválido");
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





    class Trem {
        constructor(nomeTrem, numero_de_Trem, fabricante, cpfUser, dataRegistro) {
            this.nomeTrem = nomeTrem;
            this.numero = numero_de_Trem;
            this.fabricante = fabricante;
            this.cpfUser = cpfUser;
            this.dataRegistro = dataRegistro;
        }
    }


    const novoTrem = new Trem(nomeTrem, numero_de_Trem, fabricante, cpfUser, dataRegistro);


    try {

        const resposta = await fetch('https://tchuu-tchuu-server-chat.onrender.com/api/trem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(novoTrem)
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

botao_registra.addEventListener("click", validaRegistroTrem);











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