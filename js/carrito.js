const carrito = [];

// Reglas de negocio (todas juntas acá, para poder ajustarlas fácil el día de mañana)
const PEDIDO_MINIMO_BANDEJAS = 12;
const UMBRAL_DESCUENTO_BANDEJAS = 100;
const PORCENTAJE_DESCUENTO = 0.10;

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
    // Nos aseguramos de que sea un número entero válido, nunca negativo
    cantidadNueva = Math.max(0, Math.floor(cantidadNueva) || 0);

    const productoExistente = carrito.find(item => item.id === producto.id);

    if (cantidadNueva === 0) {
        // Si la cantidad nueva es 0, sacamos el producto del carrito directamente
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



function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function calcularCantidadTotal() {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

function calcularDescuento() {
    if (calcularCantidadTotal() >= UMBRAL_DESCUENTO_BANDEJAS) {
        return calcularTotal() * PORCENTAJE_DESCUENTO;
    }
    return 0;
}

function calcularTotalFinal() {
    return calcularTotal() - calcularDescuento();
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
    const filaSubtotal = document.querySelector("#fila-subtotal");
    const filaDescuento = document.querySelector("#fila-descuento");
    const subtotalSpan = document.querySelector("#subtotal");
    const descuentoSpan = document.querySelector("#descuento");

    if (carrito.length === 0) {
        listaPedido.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalSpan.textContent = 0;
        contadorFlotante.textContent = 0;
        estadoMinimo.textContent = "";
        estadoMinimo.classList.remove("aviso-minimo");
        filaSubtotal.style.display = "none";
        filaDescuento.style.display = "none";
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
    const subtotal = calcularTotal();

    // Aviso de pedido mínimo
    if (totalItems < PEDIDO_MINIMO_BANDEJAS) {
        const faltan = PEDIDO_MINIMO_BANDEJAS - totalItems;
        estadoMinimo.textContent = `Te faltan ${faltan} bandeja${faltan === 1 ? "" : "s"} para alcanzar el pedido mínimo de ${PEDIDO_MINIMO_BANDEJAS}.`;
        estadoMinimo.classList.add("aviso-minimo");
    } else {
        estadoMinimo.textContent = "";
        estadoMinimo.classList.remove("aviso-minimo");
    }

    // Descuento por volumen
    if (totalItems >= UMBRAL_DESCUENTO_BANDEJAS) {
        const descuento = calcularDescuento();
        filaSubtotal.style.display = "block";
        filaDescuento.style.display = "block";
        subtotalSpan.textContent = subtotal.toFixed(0);
        descuentoSpan.textContent = descuento.toFixed(0);
        totalSpan.textContent = calcularTotalFinal().toFixed(0);
    } else {
        filaSubtotal.style.display = "none";
        filaDescuento.style.display = "none";
        totalSpan.textContent = subtotal.toFixed(0);
    }

    contadorFlotante.textContent = totalItems;

    if (typeof sincronizarTodosLosContadores === "function") {
        sincronizarTodosLosContadores();
    }
}

document.querySelector("#carrito-flotante").addEventListener("click", () => {
    document.querySelector("#pedido").scrollIntoView({ behavior: "smooth" });
});