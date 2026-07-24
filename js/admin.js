const auth = firebase.auth();

const seccionLogin = document.querySelector("#seccion-login");
const seccionPanel = document.querySelector("#seccion-panel");
const contenedorProductosAdmin = document.querySelector("#lista-productos-admin");
const btnAgregarProducto = document.querySelector("#btn-agregar-producto");
const inputBuscador = document.querySelector("#buscador-admin");

const btnLogin = document.querySelector("#btn-login");
const btnLogout = document.querySelector("#btn-logout");

let productosCacheAdmin = []; // Última lista traída de Firestore, para calcular el próximo id


// ==================== LOGIN ====================

btnLogin.addEventListener("click", () => {
    const email = document.querySelector("#adminEmail").value.trim();
    const password = document.querySelector("#adminPassword").value;

    if (email === "" || password === "") {
        mostrarAviso("Completá el email y la contraseña.");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
            mostrarAviso("No se pudo ingresar. Revisá el email y la contraseña.");
            console.error(error);
        });
});

btnLogout.addEventListener("click", () => {
    auth.signOut();
});

auth.onAuthStateChanged((usuario) => {
    if (usuario) {
        seccionLogin.classList.add("oculto");
        seccionPanel.classList.remove("oculto");
        cargarProductosAdmin();
    } else {
        seccionLogin.classList.remove("oculto");
        seccionPanel.classList.add("oculto");
    }
});


// ==================== UTILIDADES ====================

function generarIdDesdeTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function calcularProximoId() {
    if (productosCacheAdmin.length === 0) return 1;
    const idsExistentes = productosCacheAdmin.map(p => p.id);
    return Math.max(...idsExistentes) + 1;
}


// ==================== BUSCADOR ====================

inputBuscador.addEventListener("input", () => {
    const textoBusqueda = inputBuscador.value.trim().toLowerCase();
    const tarjetas = contenedorProductosAdmin.querySelectorAll(".admin-producto");

    tarjetas.forEach(tarjeta => {
        const coincide = tarjeta.dataset.nombreBusqueda.includes(textoBusqueda);
        tarjeta.style.display = coincide ? "block" : "none";
    });
});


// ==================== ELIMINAR PRODUCTO ====================

function mostrarConfirmacionEliminar(producto, tarjeta) {
    const modal = document.querySelector("#modal-eliminar");
    const texto = document.querySelector("#modal-eliminar-texto");
    const btnConfirmar = document.querySelector("#btn-confirmar-eliminar");
    const btnCancelar = document.querySelector("#btn-cancelar-eliminar");

    texto.textContent = `¿Seguro que querés eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`;
    modal.classList.remove("oculto");

    btnConfirmar.addEventListener("click", async () => {
        try {
            await db.collection("productos").doc(producto.idDocumento).delete();
            tarjeta.remove();
            modal.classList.add("oculto");
        } catch (error) {
            mostrarAviso("No se pudo eliminar el producto. Intentá de nuevo.");
            console.error(error);
        }
    }, { once: true });

    btnCancelar.addEventListener("click", () => {
        modal.classList.add("oculto");
    }, { once: true });
}


// ==================== CARGAR Y CREAR PRODUCTOS ====================

async function cargarProductosAdmin() {
    contenedorProductosAdmin.innerHTML = "<p>Cargando productos...</p>";

    const snapshot = await db.collection("productos").get();
    contenedorProductosAdmin.innerHTML = "";

    productosCacheAdmin = snapshot.docs.map(doc => {
        const producto = doc.data();
        producto.idDocumento = doc.id;
        return producto;
    });

    productosCacheAdmin
        .sort((a, b) => a.id - b.id)
        .forEach(producto => {
            const tarjeta = crearTarjetaAdminProducto(producto, false);
            contenedorProductosAdmin.appendChild(tarjeta);
        });
}

btnAgregarProducto.addEventListener("click", () => {
    const productoVacio = {
        id: null,
        nombre: "",
        nombrePedido: "",
        categoria: "",
        precio: 2500,
        descripcion: "",
        disponible: true
    };

    const tarjetaNueva = crearTarjetaAdminProducto(productoVacio, true);

    contenedorProductosAdmin.insertBefore(tarjetaNueva, contenedorProductosAdmin.firstChild);
    tarjetaNueva.scrollIntoView({ behavior: "smooth" });
});


// ==================== ARMAR CADA TARJETA DEL PANEL ====================

function crearTarjetaAdminProducto(producto, esNuevo) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("admin-producto");

    if (esNuevo) {
        tarjeta.classList.add("admin-producto-nuevo");
    }

    // El nombre "buscable" se guarda SIEMPRE, sea producto nuevo o existente
    tarjeta.dataset.nombreBusqueda = (producto.nombre || "").toLowerCase();

    tarjeta.innerHTML = `
        ${esNuevo ? '<p class="admin-badge-nuevo">✦ Producto nuevo (sin guardar)</p>' : ""}

        <div class="admin-campo">
            <label>Nombre</label>
            <input type="text" class="input-nombre" value="${producto.nombre || ""}">
        </div>

        <div class="admin-campo">
            <label>Nombre para el pedido</label>
            <input type="text" class="input-nombrePedido" value="${producto.nombrePedido || ""}">
        </div>

        <div class="admin-campo">
            <label>Categoría</label>
            <input type="text" class="input-categoria" value="${producto.categoria || ""}">
        </div>

        <div class="admin-campo">
            <label>Precio</label>
            <input type="number" class="input-precio" value="${producto.precio || 0}">
        </div>

        <div class="admin-campo">
            <label>Descripción</label>
            <input type="text" class="input-descripcion" value="${producto.descripcion || ""}">
        </div>

        <div class="admin-campo admin-campo-checkbox">
            <label>
                <input type="checkbox" class="input-disponible" ${producto.disponible !== false ? "checked" : ""}>
                Disponible
            </label>
        </div>

        <div class="admin-campo admin-imagen-simple">
            <label>Imagen (si NO tiene variantes)</label>
            <input type="text" class="input-imagen" value="${producto.imagen || ""}" placeholder="assets/img/nombre.jpeg">
        </div>

        <div class="admin-variantes">
            <label>Variantes</label>
            <div class="lista-variantes"></div>
            <button type="button" class="btn-agregar-variante">+ Agregar variante</button>
        </div>

        <button type="button" class="btn-guardar-producto">${esNuevo ? "Crear producto" : "Guardar cambios"}</button>
        ${esNuevo ? '<button type="button" class="btn-cancelar-nuevo">Cancelar</button>' : '<button type="button" class="btn-eliminar-producto">🗑 Eliminar producto</button>'}
        <p class="admin-guardado-msg"></p>
    `;

    inicializarVariantes(tarjeta, producto);
    inicializarBotonSecundario(tarjeta, producto, esNuevo);
    inicializarBotonGuardar(tarjeta, producto, esNuevo);

    return tarjeta;
}


// ---------- Variantes ----------

function inicializarVariantes(tarjeta, producto) {
    const listaVariantes = tarjeta.querySelector(".lista-variantes");

    function crearFilaVariante(variante) {
        const fila = document.createElement("div");
        fila.classList.add("fila-variante");
        fila.dataset.varianteId = variante ? variante.id : "";

        fila.innerHTML = `
            <input type="text" class="variante-nombre" placeholder="Nombre (ej: Nutella)" value="${variante ? variante.nombre : ""}">
            <input type="text" class="variante-imagen" placeholder="assets/img/archivo.jpeg" value="${variante ? variante.imagen : ""}">
            <button type="button" class="btn-quitar-variante">✕</button>
        `;

        fila.querySelector(".btn-quitar-variante").addEventListener("click", () => {
            fila.remove();
        });

        return fila;
    }

    if (producto.variantes) {
        producto.variantes.forEach(variante => {
            listaVariantes.appendChild(crearFilaVariante(variante));
        });
    }

    tarjeta.querySelector(".btn-agregar-variante").addEventListener("click", () => {
        listaVariantes.appendChild(crearFilaVariante(null));
    });
}

// Lee del DOM las filas de variantes actuales y arma el array final a guardar
function leerVariantesDesdeTarjeta(tarjeta) {
    const filas = tarjeta.querySelectorAll(".fila-variante");
    const variantes = [];

    filas.forEach(fila => {
        const nombreVariante = fila.querySelector(".variante-nombre").value.trim();
        const imagenVariante = fila.querySelector(".variante-imagen").value.trim();

        if (nombreVariante === "") return; // Fila vacía, se ignora

        const idVariante = fila.dataset.varianteId !== ""
            ? fila.dataset.varianteId
            : generarIdDesdeTexto(nombreVariante);

        variantes.push({ id: idVariante, nombre: nombreVariante, imagen: imagenVariante });
    });

    return variantes;
}


// ---------- Botón "Cancelar" (nuevo) / "Eliminar" (existente) ----------

function inicializarBotonSecundario(tarjeta, producto, esNuevo) {
    if (esNuevo) {
        tarjeta.querySelector(".btn-cancelar-nuevo").addEventListener("click", () => {
            tarjeta.remove();
        });
    } else {
        tarjeta.querySelector(".btn-eliminar-producto").addEventListener("click", () => {
            mostrarConfirmacionEliminar(producto, tarjeta);
        });
    }
}


// ---------- Botón "Guardar" / "Crear" ----------

// Lee todos los campos simples del formulario de una tarjeta
function leerDatosDelFormulario(tarjeta) {
    return {
        nombre: tarjeta.querySelector(".input-nombre").value.trim(),
        nombrePedido: tarjeta.querySelector(".input-nombrePedido").value.trim(),
        categoria: tarjeta.querySelector(".input-categoria").value.trim(),
        precio: parseFloat(tarjeta.querySelector(".input-precio").value) || 0,
        descripcion: tarjeta.querySelector(".input-descripcion").value.trim(),
        disponible: tarjeta.querySelector(".input-disponible").checked,
        imagenSimple: tarjeta.querySelector(".input-imagen").value.trim()
    };
}

function inicializarBotonGuardar(tarjeta, producto, esNuevo) {
    tarjeta.querySelector(".btn-guardar-producto").addEventListener("click", async () => {
        const mensajeGuardado = tarjeta.querySelector(".admin-guardado-msg");
        const datosFormulario = leerDatosDelFormulario(tarjeta);

        if (datosFormulario.nombre === "" || datosFormulario.nombrePedido === "") {
            mostrarAviso("Completá al menos el nombre y el nombre para el pedido antes de guardar.");
            return;
        }

        const variantesNuevas = leerVariantesDesdeTarjeta(tarjeta);
        const idProducto = esNuevo ? calcularProximoId() : producto.id;

        const datosActualizados = {
            id: idProducto,
            nombre: datosFormulario.nombre,
            nombrePedido: datosFormulario.nombrePedido,
            categoria: datosFormulario.categoria,
            precio: datosFormulario.precio,
            descripcion: datosFormulario.descripcion,
            disponible: datosFormulario.disponible
        };

        if (variantesNuevas.length > 0) {
            datosActualizados.variantes = variantesNuevas;
        } else {
            datosActualizados.imagen = datosFormulario.imagenSimple;
        }

        try {
            const idDocumento = esNuevo ? String(idProducto) : producto.idDocumento;
            await db.collection("productos").doc(idDocumento).set(datosActualizados);

            mensajeGuardado.textContent = "✓ Guardado";
            mensajeGuardado.classList.add("guardado-ok");

            if (esNuevo) {
                setTimeout(() => cargarProductosAdmin(), 800);
            } else {
                setTimeout(() => {
                    mensajeGuardado.textContent = "";
                    mensajeGuardado.classList.remove("guardado-ok");
                }, 2000);
            }
        } catch (error) {
            mensajeGuardado.textContent = "✕ Error al guardar";
            console.error(error);
        }
    });
}