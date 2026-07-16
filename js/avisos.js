function mostrarAviso(mensaje) {
    const modal = document.querySelector("#modal-aviso");
    const texto = document.querySelector("#modal-aviso-texto");

    texto.textContent = mensaje;
    modal.classList.remove("oculto");
}

function ocultarAviso() {
    document.querySelector("#modal-aviso").classList.add("oculto");
}

document.querySelector("#modal-aviso-btn").addEventListener("click", ocultarAviso);

// Si tocás afuera de la cajita (en el fondo oscuro), también se cierra
document.querySelector("#modal-aviso").addEventListener("click", (evento) => {
    if (evento.target.id === "modal-aviso") {
        ocultarAviso();
    }
});