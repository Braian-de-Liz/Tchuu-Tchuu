/* import { protegerRota, getUsuarioLogado } from './autentificacao.js';

if (!protegerRota()) {
  return;
}

const usuario = getUsuarioLogado();
document.getElementById('nome-usuario').textContent = usuario.nome || 'Usuário';
document.getElementById('email-usuario').textContent = usuario.email;
 */

document.addEventListener("DOMContentLoaded", () => {
  const climadash = document.getElementById("climadash");

  const latitude = -26.3045;
  const longitude = -48.8487;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const clima = data.current_weather;
      const temperatura = clima.temperature;
      const vento = clima.windspeed;
      const codigoClima = clima.weathercode;

      const descricao = traduzirClima(codigoClima);

      climadash.innerHTML = `
        <div class="clima-box">
          <h4>🌤 Clima em Joinville</h4>
          <p><strong>${temperatura}°C</strong></p>
          <p>${descricao}</p>
          <p>💨 Vento: ${vento} km/h</p>
        </div>
      `;
    })
    .catch(err => {
      console.error("Erro ao obter clima:", err);
      climadash.innerHTML = "<p>Não foi possível carregar o clima.</p>";
    });


  function traduzirClima(codigo) {
    const descricoes = {
      0: "Céu limpo",
      1: "Principalmente limpo",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Névoa",
      48: "Névoa gelada",
      51: "Chuvisco leve",
      53: "Chuvisco moderado",
      55: "Chuvisco forte",
      61: "Chuva leve",
      63: "Chuva moderada",
      65: "Chuva forte",
      71: "Neve leve",
      73: "Neve moderada",
      75: "Neve forte",
      80: "Pancadas leves",
      81: "Pancadas moderadas",
      82: "Pancadas fortes",
    };
    return descricoes[codigo] || "Clima desconhecido";



  }
});


