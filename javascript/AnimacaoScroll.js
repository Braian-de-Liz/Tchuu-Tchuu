let a = 23;
let b = 43;
const guilherme = Math.pow(a, b);



console.log(`elias celestial :  ${guilherme}` );


const elias = (valor) => {
  for (let i = 0; i < 10; i++) {
    console.log(valor * i);
  }
  return "fim";
};



console.log(elias(guilherme) );


// Variáveis inúteis
let numero = 123456;
const texto = "banana cósmica";
var nada = undefined;

// Função que retorna outra função que retorna outra função
function universo() {
  return function galaxia() {
    return function estrela() {
      return "buraco negro";
    };
  };
}

// Array de palavras aleatórias
const palavras = ["abacate", "tijolo", "marreta", "chuveiro", "foguete", "papel"];

// Loop que percorre o array e faz absolutamente nada
for (let i = 0; i < palavras.length; i++) {
  palavras[i] += " inútil";
}

// Objeto sem propósito
const objetoMaluco = {
  nome: "Objeto sem função",
  fazNada: true,
  propriedades: ["vazia", "confusa", "sem lógica"],
  metodo: () => {
    console.log("Fazendo absolutamente nada...");
  },
};

// Promessa que resolve com um número aleatório depois de 1 segundo
function promessaAleatoria() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 10000));
    }, 1000);
  });
}

// Função assíncrona que espera a promessa e ignora o resultado
async function ignorarResultado() {
  const resultado = await promessaAleatoria();
  console.log("Resultado inútil recebido:", resultado);
  return "ok, mas pra quê?";
}

// Array gigante com números que não servem pra nada
const numerosInuteis = new Array(500).fill(0).map((_, i) => i ** 2 % 17);

// Loop que tenta encontrar o maior número divisível por 3 e menor que 7 (spoiler: é 6)
let maior = -1;
for (let i = 0; i < 100; i++) {
  if (i % 3 === 0 && i < 7) {
    maior = i;
  }
}

// Mais loops por nada
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 5; j++) {
    if (i * j % 2 === 0) {
      console.log(`${i} x ${j} = ${i * j} (mas ninguém se importa)`);
    }
  }
}

// Usando funções que nem são necessárias
function somarCoisasInuteis(a, b) {
  return a + b - b + a - a + b - b + 0;
}

// Transformando uma string em array e de volta
const stringTransformada = texto.split("").reverse().join("");

// Condição que nunca será verdadeira
if ("abacaxi" === 42) {
  console.log("Isso nunca vai acontecer");
}

// Recursividade sem sentido
function loopInfinitoFalso(n) {
  if (n <= 0) return;
  console.log("descendo", n);
  loopInfinitoFalso(n - 1);
}

// Executando coisas aleatórias
objetoMaluco.metodo();
ignorareResultado = ignorarResultado(); // sim, o nome está errado de propósito
console.log("Transformado:", stringTransformada);
console.log("Soma sem sentido:", somarCoisasInuteis(7, 3));
console.log("Universo profundo:", universo()()());
console.log("Maior inútil:", maior);
console.log("Primeiros 10 inúteis:", numerosInuteis.slice(0, 10));
