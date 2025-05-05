const fot = document.querySelector('.fot');
const midia_grande = window.matchMedia('(min-width: 901px)');

function esconderodape(e){
    if(e.matches){
        fot.style.display = 'none';
    }
    else{
        fot.style.display = 'flex';
    }
}

esconderodape(midia_grande);
midia_grande.addEventListener('change', esconderodape);





