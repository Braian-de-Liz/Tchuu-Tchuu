const menuIcon = document.querySelector('.menu-icon');
const menuLateral = document.querySelector('.menu-lateral');
const container = document.querySelector('.container');

menuIcon.addEventListener('click', () => {
    menuLateral.classList.toggle('aberto');
    container.classList.toggle('menu-aberto');
});