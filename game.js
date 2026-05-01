// con esto creamos el estado global
let tablero = ["", "", "", "", "", "", "", "", ""];
let turno = "X";
let juegoActivo = true;

export function getTurno() {
  return turno;
}

export function isJuegoActivo() {
  return juegoActivo;
}

export function getTablero() {
  return tablero;
}

export function jugar(index) {
  if (!juegoActivo || tablero[index] !== "") return false;
  tablero[index] = turno;
  return true;
}

export function cambiarTurno() {
  turno = turno === "X" ? "O" : "X";
}

// Combinaciones ganadoras

const combinaciones = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], //filas

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], //columnas

  [0, 4, 8],
  [2, 4, 6], //diagonales
];

export function verificarGanador() {
  for (let combo of combinaciones) {
    const [a, b, c] = combo;
    if (
      tablero[a] !== "" &&
      tablero[a] === tablero[b] &&
      tablero[a] === tablero[c]
    ) {
      return {
        ganador: tablero[a],
        combo: combo,
      };
    }
  }
  return null;
}

export function finalizarJuego() {
  juegoActivo = false;
}

export function hayEmpate() {
  return !tablero.includes("") && !verificarGanador();
}

export function reiniciarJuego() {
  tablero = ["", "", "", "", "", "", "", "", ""];
  turno = "X";
  juegoActivo = true;
}





