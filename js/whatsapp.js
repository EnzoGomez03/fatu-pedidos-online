const btnWhatsapp = document.querySelector("#btn-whatsapp");

let urlWhatsappPendiente = null; // Guarda el link armado, hasta que el cliente confirme

btnWhatsapp.addEventListener("click", () => {

    // 1. Validar que haya al menos un producto
    if (carrito.length === 0) {
        mostrarAviso("Tu carrito está vacío. Agregá al menos un producto antes de enviar el pedido.");
        return;
    }

    // 1.b Validar pedido mínimo (12 bandejas en total)
    if (calcularCantidadTotal() < PEDIDO_MINIMO_BANDEJAS) {
        mostrarAviso(`El pedido mínimo es de ${PEDIDO_MINIMO_BANDEJAS} bandejas en total. Te faltan ${PEDIDO_MINIMO_BANDEJAS - calcularCantidadTotal()}.`);
        return;
    }

    // 2. Leer los datos del formulario
    const nombre = document.querySelector("#nombre").value.trim();
    const telefono = document.querySelector("#telefono").value.trim();
    const fechaEntrega = document.querySelector("#fechaEntrega").value;
    const horarioEntrega = document.querySelector("#horarioEntrega").value;
    const puntoEntrega = document.querySelector("#puntoEntrega").value;
    const direccion = document.querySelector("#direccion").value.trim();
    const entreCalles = document.querySelector("#EntreCalles").value.trim();
    const metodoSeña = document.querySelector("#metodoSeña").value;
    const pago = document.querySelector("#pago").value;
    const observaciones = document.querySelector("#observaciones").value.trim();

    // 3. Validaciones
    if (nombre.length < 3) {
        mostrarAviso("Ingresá tu nombre completo (mínimo 3 caracteres).");
        return;
    }

    const soloNumeros = /^[0-9]{8,}$/;
    if (!soloNumeros.test(telefono)) {
        mostrarAviso("Ingresá un teléfono válido, solo números y sin espacios (mínimo 8 dígitos). Ej: 1165308996");
        return;
    }

    if (metodoSeña === "") {
        mostrarAviso("Elegí cómo vas a pagar la seña (transferencia o Mercado Pago).");
        return;
    }

    if (puntoEntrega === "domicilio") {
        if (direccion.length < 3) {
            mostrarAviso("Ingresá la dirección de entrega.");
            return;
        }

        if (entreCalles.length < 3) {
            mostrarAviso("Ingresá entre qué calles está la dirección.");
            return;
        }
    }

    if (fechaEntrega === "") {
        mostrarAviso("Elegí una fecha de entrega.");
        return;
    }

    
    const fechaElegida = new Date(fechaEntrega + "T00:00:00");
    const diaSemana = fechaElegida.getDay();
    if (diaSemana === 0 || diaSemana === 1) {
        mostrarAviso("No hacemos entregas los domingos ni los lunes. Elegí una fecha de martes a sábado.");
        return;
    }

    const minimaValidacion = new Date();
    minimaValidacion.setDate(minimaValidacion.getDate() + 2);
    minimaValidacion.setHours(0, 0, 0, 0);

    if (fechaElegida < minimaValidacion) {
        mostrarAviso("La fecha de entrega debe ser con un mínimo de 2 días de anticipación.");
        return;
    }

    // 4. Armar el mensaje
    const mensaje = construirMensaje({
        nombre, telefono, fechaEntrega, horarioEntrega, puntoEntrega,
        direccion, entreCalles, metodoSeña, pago, observaciones
    });

    // 5. Guardar el link armado, y mostrar el resumen para confirmar (en vez de abrir ya)
    const numero = "541171328324";
    urlWhatsappPendiente = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    mostrarConfirmacion(mensaje);
});


function construirMensaje(datos) {
    const separador = "▬".repeat(18);

    let mensaje = `★ *Nuevo pedido - Fatu Delicias y Sabores*\n`;
    mensaje += `${separador}\n\n`;

    mensaje += `✎ *Pedido:*\n`;
    carrito.forEach(item => {
        mensaje += `• ${item.cantidad} x ${item.nombre} = $${item.precio * item.cantidad}\n`;
    });

    mensaje += `\n✦ *Total: $${calcularTotal().toFixed(0)}*\n`;

    const señaMonto = calcularSeña();
    mensaje += `\n✦ *Seña a abonar (50%): $${señaMonto.toFixed(0)}*\n`;

    if (datos.metodoSeña === "transferencia") {
        mensaje += `Pagar por transferencia a: ${ALIAS_TRANSFERENCIA}\n\n`;
    } else {
        mensaje += `Pagar por Mercado Pago a: ${ALIAS_MERCADOPAGO}\n\n`;
    }

    mensaje += `${separador}\n`;
    mensaje += `● *Cliente:*\n`;
    mensaje += `Nombre: ${datos.nombre}\n`;
    mensaje += `Teléfono: ${datos.telefono}\n\n`;

    mensaje += `${separador}\n`;
    mensaje += `➤ *Entrega:*\n`;

    if (datos.puntoEntrega === "local") {
        mensaje += `Modalidad: Retiro en el local\n`;
        mensaje += `Dirección del local: ${DIRECCION_LOCAL}\n`;
    } else {
        mensaje += `Modalidad: Envío a domicilio\n`;
        mensaje += `Dirección: ${datos.direccion}\n`;
        mensaje += `Entre calles: ${datos.entreCalles}\n`;
    }

    mensaje += `Fecha: ${datos.fechaEntrega}\n`;
    mensaje += `Horario: ${datos.horarioEntrega}\n\n`;

    mensaje += `${separador}\n`;
    mensaje += `● Forma de pago: ${datos.pago}\n`;

    if (datos.observaciones !== "") {
        mensaje += `\n${separador}\n`;
        mensaje += `▸ Observaciones: ${datos.observaciones}\n`;
    }

    return mensaje;
}


function mostrarConfirmacion(mensaje) {
    const resumen = document.querySelector("#resumen-confirmacion");
    resumen.textContent = mensaje; // textContent = seguro, no interpreta el texto como HTML
    document.querySelector("#modal-confirmacion").classList.remove("oculto");
}

function ocultarConfirmacion() {
    document.querySelector("#modal-confirmacion").classList.add("oculto");
}

document.querySelector("#btn-volver-editar").addEventListener("click", () => {
    urlWhatsappPendiente = null;
    ocultarConfirmacion();
});

const btnConfirmarEnvio = document.querySelector("#btn-confirmar-envio");

btnConfirmarEnvio.addEventListener("click", () => {
    if (!urlWhatsappPendiente) return;

    // Deshabilitamos el botón de inmediato, para que un segundo clic no haga nada
    btnConfirmarEnvio.disabled = true;
    btnConfirmarEnvio.textContent = "Enviando...";

    window.open(urlWhatsappPendiente, "_blank");
    vaciarCarrito();
    urlWhatsappPendiente = null;
    ocultarConfirmacion();

    // Lo volvemos a habilitar para la próxima vez que se abra este modal
    btnConfirmarEnvio.disabled = false;
    btnConfirmarEnvio.textContent = "Confirmar y enviar";
});