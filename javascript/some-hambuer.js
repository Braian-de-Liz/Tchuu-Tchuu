const menu_icon = document.querySelector('.menu-icon')
const midia_pequena = window.matchMedia('(max-width: 900px)')

function escondeHamburguer (e){
    
    if(e.matches){
        menu_icon.style.display = 'none';
    }
    else{
        menu_icon.style.display = 'inline-block';
    }
}

escondeHamburguer(midia_pequena);
midia_pequena.addEventListener('change', escondeHamburguer);