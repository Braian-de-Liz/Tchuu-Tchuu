function renderizar_rodape() {
    const rodape = document.createElement("footer");
    rodape.classList = 'fot';

    rodape.innerHTML = `
        <footer class="fot">
            <div class="iconf"><a href="pagGestaoRotas.html"><img src="../Assets/imagens/barras/mapa.png" alt=""></a>
            </div>
            <div class="iconf"><a href="pagChat.html"><img src="../Assets/imagens/barras/chat.png" alt=""></a></div>
            <div class="iconf"><a href="pagGeralDashboard.html"><img src="../Assets/imagens/barras/home.png" alt=""></a>
            </div>
            <div class="iconf"><a href="pagMonitora.html"><img src="../Assets/imagens/barras/desempenho.png" alt=""></a>
            </div>
            <div class="iconf"><a href="pagUsuario.html"><img src="../Assets/imagens/barras/user.png" alt=""></a></div>
        </footer>`;


    const container = document.getElementById("container");

    if (container) {

        container.prepend(rodape);

        const fot = document.querySelector('.fot'); 
        const midia_grande = window.matchMedia('(min-width: 901px)');

        function esconderodape(e) {
            if (e.matches) {
                if (fot) { 
                    fot.style.display = 'none';
                }
            } else {
                if (fot) { 
                    fot.style.display = 'flex'; 
                }
            }
        }

      
        if (fot) { 
            esconderodape(midia_grande);
        }
        midia_grande.addEventListener('change', () => {
            if (fot) { 
                esconderodape(midia_grande);
            }
        });
        console.log("Funções de sume-rodape.js aplicadas ao rodapé dinâmico.");

    } else {
        console.error("Elemento com ID 'container' não encontrado para adicionar o rodapé.");
    }
}



    




document.addEventListener("DOMContentLoaded", renderizar_rodape);