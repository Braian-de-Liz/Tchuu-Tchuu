// Tipagens básicas
let a: number = 23;
let b: number = 43;
const guilherme: number = Math.pow(a, b);

console.log(`elias celestial :  ${guilherme}`);

// Função tipada
const elias = (valor: number): string => {
  for (let i = 0; i < 10; i++) {
    console.log(valor * i);
  }
  return "fim";
};

console.log(elias(guilherme));

// Variáveis inúteis com tipos
let numero: number = 123456;
const texto: string = "banana cósmica";
var nada: undefined = undefined;

// Função que retorna função que retorna função
function universo(): () => () => string {
  return function galaxia(): () => string {
    return function estrela(): string {
      return "buraco negro";
    };
  };
}

// Array de strings
const palavras: string[] = ["abacate", "tijolo", "marreta", "chuveiro", "foguete", "papel"];

// Loop inútil
for (let i = 0; i < palavras.length; i++) {
  palavras[i] += " inútil";
}

// Objeto sem uso com tipagem
type ObjetoMaluco = {
  nome: string;
  fazNada: boolean;
  propriedades: string[];
  metodo: () => void;
};

const objetoMaluco: ObjetoMaluco = {
  nome: "Objeto sem função",
  fazNada: true,
  propriedades: ["vazia", "confusa", "sem lógica"],
  metodo: (): void => {
    console.log("Fazendo absolutamente nada...");
  },
};

// Promessa com tipagem explícita
function promessaAleatoria(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 10000));
    }, 1000);
  });
}

// Função async que ignora o resultado
async function ignorarResultado(): Promise<string> {
  const resultado = await promessaAleatoria();
  console.log("Resultado inútil recebido:", resultado);
  return "ok, mas pra quê?";
}

// Array com cálculo inútil
const numerosInuteis: number[] = new Array(500).fill(0).map((_, i) => (i ** 2) % 17);

// Loop que busca o maior número inútil
let maior: number = -1;
for (let i = 0; i < 100; i++) {
  if (i % 3 === 0 && i < 7) {
    maior = i;
  }
}

// Loop duplo sem razão
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 5; j++) {
    if ((i * j) % 2 === 0) {
      console.log(`${i} x ${j} = ${i * j} (mas ninguém se importa)`);
    }
  }
}

// Função sem propósito real
function somarCoisasInuteis(a: number, b: number): number {
  return a + b - b + a - a + b - b + 0;
}

// Transformação de string
const stringTransformada: string = texto.split("").reverse().join("");

// Condição sem sentido
if ("abacaxi" === (42 as unknown as string)) {
  console.log("Isso nunca vai acontecer");
}

// Recursividade "limitada"
function loopInfinitoFalso(n: number): void {
  if (n <= 0) return;
  console.log("descendo", n);
  loopInfinitoFalso(n - 1);
}

// Execução de ações sem utilidade
objetoMaluco.metodo();

let resultadoPromessa: Promise<string> = ignorarResultado(); // nome agora correto

console.log("Transformado:", stringTransformada);
console.log("Soma sem sentido:", somarCoisasInuteis(7, 3));
console.log("Universo profundo:", universo()()());
console.log("Maior inútil:", maior);
console.log("Primeiros 10 inúteis:", numerosInuteis.slice(0, 10));