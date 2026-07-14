function crearAutocompletado(idInput) {
    const input = document.querySelector(`#${idInput}`);

    // Contenedor donde van a aparecer las sugerencias, justo debajo del input
    const contenedorSugerencias = document.createElement("div");
    contenedorSugerencias.classList.add("sugerencias-direccion");
    input.insertAdjacentElement("afterend", contenedorSugerencias);

    let temporizador = null;

    input.addEventListener("input", () => {
        const texto = input.value.trim();

        // Con muy poco texto todavía no vale la pena buscar
        if (texto.length < 4) {
            contenedorSugerencias.innerHTML = "";
            return;
        }

        // Debounce: cancelamos la búsqueda anterior si la persona sigue tipeando
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
            buscarDirecciones(texto, contenedorSugerencias, input);
        }, 500);
    });

    // Si tocás en cualquier otro lado de la página, se cierran las sugerencias
    document.addEventListener("click", (evento) => {
        if (evento.target !== input && !contenedorSugerencias.contains(evento.target)) {
            contenedorSugerencias.innerHTML = "";
        }
    });
}

async function buscarDirecciones(texto, contenedorSugerencias, input) {
    const consulta = `${texto}, Buenos Aires, Argentina`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ar&limit=5&addressdetails=1&q=${encodeURIComponent(consulta)}`;

    try {
        const respuesta = await fetch(url);
        const resultados = await respuesta.json();
        mostrarSugerencias(resultados, contenedorSugerencias, input);
    } catch (error) {
        console.error("Error al buscar direcciones:", error);
    }
}

function formatearDireccion(resultado) {
    const partes = resultado.address;

    const calle = partes.road || "";
    const numero = partes.house_number || "";
    const barrio = partes.suburb || partes.neighbourhood || partes.city_district || "";
    const ciudad = partes.city || partes.town || partes.village || partes.municipality || "";

    // Armamos "Calle 123, Barrio, Ciudad", salteando las partes que no existan
    const calleYNumero = numero ? `${calle} ${numero}` : calle;

    return [calleYNumero, barrio, ciudad].filter(parte => parte !== "").join(", ");
}


function mostrarSugerencias(resultados, contenedorSugerencias, input) {
    contenedorSugerencias.innerHTML = "";

    resultados.forEach(resultado => {
        const textoCorto = formatearDireccion(resultado);
        const textoParaMostrar = textoCorto !== "" ? textoCorto : resultado.display_name;

        const opcion = document.createElement("div");
        opcion.classList.add("sugerencia-item");
        opcion.textContent = textoParaMostrar; // lo que se VE en la lista: corto y legible

        opcion.addEventListener("click", () => {
            input.value = resultado.display_name; // lo que se GUARDA en el campo: completo y preciso
            contenedorSugerencias.innerHTML = "";
        });

        contenedorSugerencias.appendChild(opcion);
    });
}

// Activamos el autocompletado en los dos campos pedidos
crearAutocompletado("direccion");
//crearAutocompletado("EntreCalles"); Decidi que no hace falta el entre calle, el usuario puede escribirlo a mano es mucho mas practico y entendible.