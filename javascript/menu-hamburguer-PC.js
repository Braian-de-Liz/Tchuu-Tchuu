const menuIcon = document.querySelector('.menu-icon');
const menuLateral = document.querySelector('.menu-lateral');

menuIcon.addEventListener('click', () => {
    menuLateral.classList.toggle('aberto');
});