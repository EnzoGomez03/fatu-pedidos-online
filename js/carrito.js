const carrito = [];

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

function calcularTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function actualizarCarrito() {
    const listaPedido = document.querySelector("#lista-pedido");
    const totalSpan = document.querySelector("#total");

    if (carrito.length === 0) {
        listaPedido.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalSpan.textContent = 0;
        return;
    }

    listaPedido.innerHTML = "";

    carrito.forEach(item => {
        const linea = document.createElement("p");
        linea.textContent = `${item.cantidad} x ${item.nombre} = $${item.precio * item.cantidad}`;
        listaPedido.appendChild(linea);
    });

    totalSpan.textContent = calcularTotal();
}