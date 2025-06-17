function ValidaManutrem(event){
    event.preventDefault();


    const nomeTrem = document.getElementById('nomeTrem').value.trim();
    const numero_de_Trem = document.getElementById('numero_de_Trem').value.trim();
    const DataMANU = document.getElementById('DataMANU').value.trim();
    const ProblemaTrem = document.getElementById('ProblemaTrem').value.trim();
    const tremDescri =document.getElementById('tremDescri').value.trim();






    if(!nomeTrem || !numero_de_Trem || !DataMANU || !ProblemaTrem || !tremDescri){

        alert('PREENCHA OS CAMPOS, NÃO PODE TER NENHUM VAZIO');
        return false;
    }


    if (isNaN(numero_de_Trem) || Number(numero_de_Trem) <= 0) {
        alert('O campo deve ser preenchido com números acima de 0');
        return false;
    }


    const data_parte_Manu = DataMANU.split('-');

    if(data_parte_Manu.length !== 3){
        alert('Data imcompleta PREENCHA CORRETAMENET');
        return false;
    }

    const ano = parseInt(data_parte_Manu[0], 10);
    const mes = parseInt(data_parte_Manu[1], 10);
    const dia = parseInt(data_parte_Manu[2], 10);



    if(isNaN(ano) || isNaN(mes) || isNaN(dia)){
        alert('As datas são dados numéricos ')
        return false;
    }


    if(dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900){
        alert('sua data não faz sentido, REVEJA');
        return false;
    }


    const



    alert('Seu Trem poderá ir para manu');
    return true;



}