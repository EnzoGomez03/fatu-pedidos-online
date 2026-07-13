const contenedorProductos = document.querySelector(".productos-container");

function crearContador() {

    let cantidad = 0;

    const contador = document.createElement("div");
    contador.classList.add("contador");

    const btnMenos = document.createElement("button");
    btnMenos.textContent = "-";
    btnMenos.addEventListener("click", () => {
        if (cantidad > 0) {
            cantidad--;
            cantidadSpan.textContent = cantidad;
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

    const contador = crearContador();

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