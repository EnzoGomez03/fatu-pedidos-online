const carrito = [];

const PEDIDO_MINIMO_BANDEJAS = 12;
const DIRECCION_LOCAL = "Hornero 4211, San José, Temperley";
const PORCENTAJE_SEÑA = 0.50;
const ALIAS_TRANSFERENCIA = "COMPLETAR_ALIAS_O_CBU";
const ALIAS_MERCADOPAGO = "COMPLETAR_ALIAS_MERCADOPAGO"; 

function agregarProducto(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    actualizarCarrito();
}

function eliminarProducto(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (!productoExistente) return;

    productoExistente.cantidad--;

    if (productoExistente.cantidad <= 0) {
        const index = carrito.findIndex(item => item.id === producto.id);
        carrito.splice(index, 1);
    }

    actualizarCarrito();
}

function establecerCantidadEnCarrito(producto, cantidadNueva) {
    cantidadNueva = Math.max(0, Math.floor(cantidadNueva) || 0);

    const productoExistente = carrito.find(item => item.id === producto.id);

    if (cantidadNueva === 0) {
        if (productoExistente) {
            const index = carrito.findIndex(item => item.id === producto.id);
            carrito.splice(index, 1);
        }
    } else if (productoExistente) {
        productoExistente.cantidad = cantidadNueva;
    } else {
        carrito.push({ ...producto, cantidad: cantidadNueva });
    }

    actualizarCarrito();
}

function guardarCarritoEnStorage() {
    try {
        localStorage.setItem("carritoFatu", JSON.stringify(carrito));
    } catch (error) {
        console.error("No se pudo guardar el carrito:", error);
    }
}

function cargarCarritoDesdeStorage() {
    try {
        const guardado = localStorage.getItem("carritoFatu");
        if (guardado) {
            const itemsGuardados = JSON.parse(guardado);
            itemsGuardados.forEach(item => carrito.push(item));
        }
    } catch (error) {
        console.error("No se pudo cargar el carrito guardado:", error);
    }
}

function vaciarCarrito() {
    carrito.length = 0; // Vacía el array sin perder la referencia (no podemos reasignar, es "const")
    localStorage.removeItem("carritoFatu");
    actualizarCarrito();
}



function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function calcularCantidadTotal() {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

function calcularSeña() {
    return calcularTotal() * PORCENTAJE_SEÑA;
}

function obtenerCantidadEnCarrito(id) {
    const item = carrito.find(item => item.id === id);
    return item ? item.cantidad : 0;
}


function actualizarCarrito() {
    const listaPedido = document.querySelector("#lista-pedido");
    const totalSpan = document.querySelector("#total");
    const contadorFlotante = document.querySelector("#carrito-contador");
    const estadoMinimo = document.querySelector("#estado-minimo");

    if (carrito.length === 0) {
        listaPedido.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalSpan.textContent = 0;
        contadorFlotante.textContent = 0;
        estadoMinimo.textContent = "";
        estadoMinimo.classList.remove("aviso-minimo");
        return;
    }

    listaPedido.innerHTML = "";

    carrito.forEach(item => {
        const linea = document.createElement("div");
        linea.classList.add("linea-pedido");

        const texto = document.createElement("span");
        texto.textContent = `${item.cantidad} x ${item.nombre} = $${item.precio * item.cantidad}`;

        const controles = document.createElement("div");
        controles.classList.add("controles-linea");

        const btnMenos = document.createElement("button");
        btnMenos.textContent = "-";
        btnMenos.addEventListener("click", () => {
            eliminarProducto(item);
        });

        const btnMas = document.createElement("button");
        btnMas.textContent = "+";
        btnMas.addEventListener("click", () => {
            agregarProducto(item);
        });

        controles.appendChild(btnMenos);
        controles.appendChild(btnMas);

        linea.appendChild(texto);
        linea.appendChild(controles);

        listaPedido.appendChild(linea);
    });

    const totalItems = calcularCantidadTotal();

    if (totalItems < PEDIDO_MINIMO_BANDEJAS) {
        const faltan = PEDIDO_MINIMO_BANDEJAS - totalItems;
        estadoMinimo.textContent = `Te faltan ${faltan} bandeja${faltan === 1 ? "" : "s"} para alcanzar el pedido mínimo de ${PEDIDO_MINIMO_BANDEJAS}.`;
        estadoMinimo.classList.add("aviso-minimo");
    } else {
        estadoMinimo.textContent = "";
        estadoMinimo.classList.remove("aviso-minimo");
    }

    totalSpan.textContent = calcularTotal();
    contadorFlotante.textContent = totalItems;

    if (typeof sincronizarTodosLosContadores === "function") {
        sincronizarTodosLosContadores();
    }

    guardarCarritoEnStorage(); //guarda automáticamente cada vez que el carrito cambia

}

document.querySelector("#carrito-flotante").addEventListener("click", () => {
    document.querySelector("#pedido").scrollIntoView({ behavior: "smooth" });
});
cargarCarritoDesdeStorage();
actualizarCarrito();