const contenedorProductos = document.querySelector(".productos-container");

function crearContador(producto) {

    let cantidad = 0;

    const contador = document.createElement("div");
    contador.classList.add("contador");

    const btnMenos = document.createElement("button");
    btnMenos.textContent = "-";
    btnMenos.addEventListener("click", () => {
        if (cantidad > 0) {
            cantidad--;
            cantidadSpan.textContent = cantidad;
            eliminarProducto(producto);
        }
    });


    const cantidadSpan = document.createElement("span");
    cantidadSpan.textContent = cantidad;

    const btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.addEventListener("click", () => {
        cantidad++;
        cantidadSpan.textContent = cantidad;
        agregarProducto(producto);
    });


    contador.appendChild(btnMenos);
    contador.appendChild(cantidadSpan);
    contador.appendChild(btnMas);

    return contador;
}


function crearTarjetaProducto(producto) {

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("producto");

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.classList.add("descripcion");
    descripcion.textContent = "Bandeja x6";

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.textContent = `$${producto.precio}`;

    const contador = crearContador(producto);

    tarjeta.appendChild(imagen);
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