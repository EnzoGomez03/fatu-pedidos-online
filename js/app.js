const contenedorProductos = document.querySelector(".productos-container");


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

    // Si el producto tiene variantes, arrancamos mostrando la primera
    let varianteActual = producto.variantes ? producto.variantes[0] : null;

    if (varianteActual) {
        imagen.src = varianteActual.imagen;
        imagen.alt = varianteActual.nombre;
    } else {
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
    }

    // Arma el objeto que se manda al carrito, según la variante elegida en este momento
    function armarProductoParaCarrito() {
        if (varianteActual) {
            return {
                id: `${producto.id}-${varianteActual.id}`,
                nombre: `${producto.nombre} (${varianteActual.nombre})`,
                precio: producto.precio
            };
        }
        return producto;
    }

    // ---------- Contador (+/-) ----------
    let cantidad = 0;

    const contador = document.createElement("div");
    contador.classList.add("contador");

    const cantidadSpan = document.createElement("span");
    cantidadSpan.textContent = cantidad;

    const btnMenos = document.createElement("button");
    btnMenos.textContent = "-";
    btnMenos.addEventListener("click", () => {
        if (cantidad > 0) {
            cantidad--;
            cantidadSpan.textContent = cantidad;
            eliminarProducto(armarProductoParaCarrito());
        }
    });

    const btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.addEventListener("click", () => {
        cantidad++;
        cantidadSpan.textContent = cantidad;
        agregarProducto(armarProductoParaCarrito());
    });

    contador.appendChild(btnMenos);
    contador.appendChild(cantidadSpan);
    contador.appendChild(btnMas);

    tarjeta.appendChild(imagen);

    // ---------- Selector de variantes (solo si el producto tiene) ----------
    if (producto.variantes) {
        const selector = document.createElement("div");
        selector.classList.add("selector-variantes");

        producto.variantes.forEach(variante => {
            const btnVariante = document.createElement("button");
            btnVariante.textContent = variante.nombre;
            btnVariante.classList.add("btn-variante");

            if (variante.id === varianteActual.id) {
                btnVariante.classList.add("activo");
            }

            btnVariante.addEventListener("click", () => {
                varianteActual = variante;
                imagen.src = variante.imagen;
                imagen.alt = variante.nombre;

                selector.querySelectorAll(".btn-variante").forEach(b => {
                    b.classList.remove("activo");
                });
                btnVariante.classList.add("activo");

                // Cambiamos de variante: reiniciamos la cantidad a 0
                cantidad = 0;
                cantidadSpan.textContent = cantidad;
            });

            selector.appendChild(btnVariante);
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