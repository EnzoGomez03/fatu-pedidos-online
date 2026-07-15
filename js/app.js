const contenedorProductos = document.querySelector(".productos-container");

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
    descripcion.textContent = producto.descripcion;

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
        return {
            id: idActual(),
            nombre: varianteActual
                ? `${producto.nombrePedido} (${varianteActual.nombre})`
                : producto.nombrePedido,
            precio: producto.precio
        };
    }

    // ---------- Contador (-, input editable, +) ----------
    const contador = document.createElement("div");
    contador.classList.add("contador");

    const cantidadInput = document.createElement("input");
    cantidadInput.type = "number";
    cantidadInput.min = "0";
    cantidadInput.classList.add("cantidad-input");

    function actualizarCantidadMostrada() {
        cantidadInput.value = obtenerCantidadEnCarrito(idActual());
    }

    actualizarCantidadMostrada();

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

    // Cuando el usuario escribe un número directo y sale del campo (o presiona Enter)
    cantidadInput.addEventListener("change", () => {
        const valorEscrito = parseInt(cantidadInput.value, 10);
        establecerCantidadEnCarrito(armarProductoParaCarrito(), valorEscrito);
        actualizarCantidadMostrada();
    });

    contador.appendChild(btnMenos);
    contador.appendChild(cantidadInput);
    contador.appendChild(btnMas);

    // ---------- Botones de salto rápido (+5 / +10) ----------
    const saltosRapidos = document.createElement("div");
    saltosRapidos.classList.add("saltos-rapidos");

    [5, 10].forEach(salto => {
        const btnSalto = document.createElement("button");
        btnSalto.textContent = `+${salto}`;
        btnSalto.classList.add("btn-salto");
        btnSalto.addEventListener("click", () => {
            const cantidadActual = obtenerCantidadEnCarrito(idActual());
            establecerCantidadEnCarrito(armarProductoParaCarrito(), cantidadActual + salto);
            actualizarCantidadMostrada();
        });
        saltosRapidos.appendChild(btnSalto);
    });

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
    tarjeta.appendChild(saltosRapidos);

    return tarjeta;
}


productos.forEach(producto => {

    const tarjeta = crearTarjetaProducto(producto);

    contenedorProductos.appendChild(tarjeta);

});


const inputFecha = document.querySelector("#fechaEntrega");

const fechaMinima = new Date();
fechaMinima.setDate(fechaMinima.getDate() + 2);

const anio = fechaMinima.getFullYear();
const mes = String(fechaMinima.getMonth() + 1).padStart(2, "0");
const dia = String(fechaMinima.getDate()).padStart(2, "0");

inputFecha.min = `${anio}-${mes}-${dia}`;

inputFecha.addEventListener("change", () => {
    if (inputFecha.value === "") return;

    const fechaElegida = new Date(inputFecha.value + "T00:00:00");
    const diaSemana = fechaElegida.getDay();

    if (diaSemana === 0 || diaSemana === 1) {
        alert("No hacemos entregas los domingos ni los lunes. Elegí una fecha de martes a sábado.");
        inputFecha.value = "";
    }
});