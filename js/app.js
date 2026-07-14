const contenedorProductos = document.querySelector(".productos-container");

// Lista compartida de "funciones para refrescar cada tarjeta".
// Cada tarjeta se anota acá cuando se crea.
const actualizadoresDeCantidad = [];

function sincronizarTodosLosContadores() {
    actualizadoresDeCantidad.forEach(actualizar => actualizar());
}


function crearTarjetaProducto(producto) {

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("producto");

    const imagen = document.createElement("img");

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.classList.add("descripcion");
    descripcion.textContent = "Bandeja x6";

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.textContent = `$${producto.precio}`;

    let varianteActual = producto.variantes ? producto.variantes[0] : null;

    if (varianteActual) {
        imagen.src = varianteActual.imagen;
        imagen.alt = varianteActual.nombre;
    } else {
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
    }

    function idActual() {
        return varianteActual ? `${producto.id}-${varianteActual.id}` : producto.id;
    }

    function armarProductoParaCarrito() {
        if (varianteActual) {
            return {
                id: idActual(),
                nombre: `${producto.nombre} (${varianteActual.nombre})`,
                precio: producto.precio
            };
        }
        return producto;
    }

    // ---------- Contador (+/-) ----------
    const contador = document.createElement("div");
    contador.classList.add("contador");

    const cantidadSpan = document.createElement("span");

    function actualizarCantidadMostrada() {
        cantidadSpan.textContent = obtenerCantidadEnCarrito(idActual());
    }

    actualizarCantidadMostrada();

    // Esta tarjeta se anota en la lista compartida, para que la avisen
    // cuando el carrito cambie desde otro lado (ej: el resumen del pedido)
    actualizadoresDeCantidad.push(actualizarCantidadMostrada);

    const btnMenos = document.createElement("button");
    btnMenos.textContent = "-";
    btnMenos.addEventListener("click", () => {
        if (obtenerCantidadEnCarrito(idActual()) > 0) {
            eliminarProducto(armarProductoParaCarrito());
            actualizarCantidadMostrada();
        }
    });

    const btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.addEventListener("click", () => {
        agregarProducto(armarProductoParaCarrito());
        actualizarCantidadMostrada();
    });

    contador.appendChild(btnMenos);
    contador.appendChild(cantidadSpan);
    contador.appendChild(btnMas);

    tarjeta.appendChild(imagen);

    if (producto.variantes) {
        const selector = document.createElement("select");
        selector.classList.add("selector-variantes");

        producto.variantes.forEach(variante => {
            const opcion = document.createElement("option");
            opcion.value = variante.id;
            opcion.textContent = variante.nombre;
            selector.appendChild(opcion);
        });

        selector.addEventListener("change", () => {
            const idElegido = selector.value;
            varianteActual = producto.variantes.find(v => v.id === idElegido);

            imagen.src = varianteActual.imagen;
            imagen.alt = varianteActual.nombre;

            actualizarCantidadMostrada();
        });

        tarjeta.appendChild(selector);
    }

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(contador);

    return tarjeta;
}


productos.forEach(producto => {

    const tarjeta = crearTarjetaProducto(producto);

    contenedorProductos.appendChild(tarjeta);

});


// Bloquear que el usuario elija una fecha con menos de 2 días de anticipación
const inputFecha = document.querySelector("#fechaEntrega");

const fechaMinima = new Date();
fechaMinima.setDate(fechaMinima.getDate() + 2);

const anio = fechaMinima.getFullYear();
const mes = String(fechaMinima.getMonth() + 1).padStart(2, "0");
const dia = String(fechaMinima.getDate()).padStart(2, "0");

inputFecha.min = `${anio}-${mes}-${dia}`;