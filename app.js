import {
  getTurno,
  isJuegoActivo,
  getTablero,
  cambiarTurno,
  jugar,
  verificarGanador,
  finalizarJuego,
  hayEmpate,
  reiniciarJuego,
} from "./game.js";

//=================
// Referencias del DOM
//=================

const celdas = document.querySelectorAll(".celda");
const btn = document.getElementById("reiniciar");
const modal = document.getElementById("modal");
const mensaje = document.getElementById("mensaje");
const cerrarModal = document.getElementById("cerrarModal");
const tableroHTML = document.querySelector(".tablero");

const modalInicio = document.getElementById("modalInicio");
const tituloModal = document.getElementById("tituloModal");
const inputNombre = document.getElementById("inputNombre");
const btnSiguiente = document.getElementById("btnSiguiente");

const estado = document.getElementById("estado");

const acciones = document.getElementById("acciones");
const btnSeguir = document.getElementById("seguir");
const btnReiniciarTodo = document.getElementById("reiniciarTodo");

//=================
// ESTADO JUGADORES
//=================

let nombreX = "";
let nombreO = "";
let paso = "X";

//=================
// LOGICA JUGADORES
//=================

// Guarda nombre según turno del flujo
function guardarNombre(nombre) {
  if (paso === "X") {
    nombreX = nombre;
    paso = "O";
    return "siguiente";
  } else {
    nombreO = nombre;
    return "fin";
  }
}

// Devuelve nombre según turno del juego
function getNombreJugador(turno) {
  return turno === "X" ? nombreX : nombreO;
}

//=================
// Modal inicio
//=================

// Cambia UI para jugador O
function actualizarUIJugador() {
  tituloModal.textContent = "Jugador O";
  inputNombre.value = "";
  inputNombre.placeholder = "Nombre del jugador O";

  inputNombre.focus();
}

// Cierra el modal
function cerrarModalInicio() {
  modalInicio.classList.add("oculto");
}

// Muestra modal inicial
function mostrarModalInicio() {
  modalInicio.classList.remove("oculto");

  tituloModal.textContent = "Jugador X";
  inputNombre.value = "";
  inputNombre.placeholder = "Nombre del jugador X";
}

function mostrarModalUI(texto) {
  mensaje.textContent = texto;
  modal.classList.remove("oculto");
}

// =================
// MODAL RESULTADO + DECISIÓN
// =================
  function mostrarResultado(texto){
    mensaje.textContent = texto;

    acciones.classList.add("oculto");
    modal.classList.remove("oculto");
  }

  function activarDecisiones(){
    acciones.classList.remove("oculto");
  }



//=================
// Juego UI
//=================

// Limpia tablero visual
function limpiarTablero() {
  celdas.forEach((celda) => {
    celda.textContent = "";
    celda.classList.remove("ganadora");
  });
  tableroHTML.classList.add("bloqueado");
}

// Resetea jugadores
function resetJugadores() {
  nombreX = "";
  nombreO = "";
  paso = "X";
}

// Actualiza UI del turno
function actualizarEstadoTurno() {
  const turno = getTurno();

  estado.textContent = turno;
  estado.className = turno === "X" ? "turno-x" : "turno-o";
}

//=================
// EVENTOS
//=================

// Flujo de nombres (modal inicio)
btnSiguiente.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  if (!nombre) return;

  const resultado = guardarNombre(nombre);

  if (resultado === "siguiente") {
    actualizarUIJugador();
  } else {
    cerrarModalInicio();
    tableroHTML.classList.remove("bloqueado");
  }
});

// Reiniciar juego completo
btn.addEventListener("click", () => {
  modal.classList.add("oculto");
  reiniciarJuego();

  resetJugadores();
  limpiarTablero();
  mostrarModalInicio();
  actualizarEstadoTurno();
});

// Cerrar modal de resultado
cerrarModal.addEventListener("click", () => {
  modal.classList.add("oculto");
});

// =================
// BOTONES MODAL
// =================

// Otra ronda (mismos jugadores)
btnSeguir.addEventListener("click", () =>{
modal.classList.add("oculto")

reiniciarJuego();
limpiarTablero();
actualizarEstadoTurno();
tableroHTML.classList.remove("bloqueado");
})

//Cambiar jugadores

btnReiniciarTodo.addEventListener("click", () =>{
  modal.classList.add("oculto")

  reiniciarJuego();
  resetJugadores();
  limpiarTablero();

  mostrarModalInicio();
  actualizarEstadoTurno();
} )

// Eventos de cada celda
celdas.forEach((celda) => {
  celda.addEventListener("click", manejarClick);
});

// =========================
//  LÓGICA PRINCIPAL DEL JUEGO
// =========================

function manejarClick(evento) {
  console.log("Click detectado");

  // bloquear si no han puesto nombres
  if (!modalInicio.classList.contains("oculto")) return;

  // bloquear si el juego terminó
  if (!isJuegoActivo()) return;
 
  const celda = evento.currentTarget;
  const index = Number(celda.dataset.index)

  // si no puede jugar, salir
  if (!jugar(index)) return;

  // pintar en UI
  celda.textContent = getTurno();

  // verificar resultado
  let resultado = verificarGanador();

  //==============
  // GANADOR
  //==============

  if (resultado) {
    resultado.combo.forEach((index) => {
      celdas[index].classList.add("ganadora");
    });
    tableroHTML.classList.add("bloqueado");
    const nombre = getNombreJugador(resultado.ganador);

    mostrarResultado(`Ganó ${nombre}`);
    finalizarJuego();
    setTimeout(()=>{
      activarDecisiones();

    },1000);
    return;
  }

  //==============
  // EMPATE
  //==============

  if (hayEmpate()) {
    tableroHTML.classList.add("bloqueado");
   mostrarResultado("Empate");
    finalizarJuego();

    setTimeout(()=>{
      activarDecisiones();
    },1000);
    return;
  }

  //==============
  // CAMBIO de turno
  //==============

  cambiarTurno();
  actualizarEstadoTurno();
  console.log("celda: " + index);
}
