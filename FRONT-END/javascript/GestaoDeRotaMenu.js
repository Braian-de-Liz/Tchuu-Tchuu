document.addEventListener("DOMContentLoaded", () => {
  const togglePrincipal = document.getElementById("menu-toggle");
  const menuPrincipal = document.getElementById("menu");

  togglePrincipal.addEventListener("click", () => {
    menuPrincipal.classList.toggle("hidden");
  });

  const toggleSecundario = document.getElementById("toggle-lado");
  const menuLado = document.getElementById("lado");

  toggleSecundario.addEventListener("click", () => {
    menuLado.classList.toggle("hidden-lado");
  });
});
