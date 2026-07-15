const btnWhatsapp = document.querySelector("#btn-whatsapp");

btnWhatsapp.addEventListener("click", () => {

    // 1. Validar que haya al menos un producto
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agregá al menos un producto antes de enviar el pedido.");
        return;
    }


    // 1.b Validar pedido mínimo (12 bandejas en total)
    if (calcularCantidadTotal() < PEDIDO_MINIMO_BANDEJAS) {
        alert(`El pedido mínimo es de ${PEDIDO_MINIMO_BANDEJAS} bandejas en total. Te faltan ${PEDIDO_MINIMO_BANDEJAS - calcularCantidadTotal()}.`);
        return;
    }

    // 2. Leer los datos del formulario
    const nombre = document.querySelector("#nombre").value.trim();
    const telefono = document.querySelector("#telefono").value.trim();
    const fechaEntrega = document.querySelector("#fechaEntrega").value;
    const horarioEntrega = document.querySelector("#horarioEntrega").value;
    const direccion = document.querySelector("#direccion").value.trim();
    const entreCalles = document.querySelector("#EntreCalles").value.trim();
    const pago = document.querySelector("#pago").value;
    const observaciones = document.querySelector("#observaciones").value.trim();

    // 3. Validaciones
    if (nombre.length < 3) {
        alert("Ingresá tu nombre completo (mínimo 3 caracteres).");
        return;
    }

    const soloNumeros = /^[0-9]{8,}$/;
    if (!soloNumeros.test(telefono)) {
        alert("Ingresá un teléfono válido, solo números y sin espacios (mínimo 8 dígitos). Ej: 1165308996");
        return;
    }

    if (direccion.length < 3) {
        alert("Ingresá la dirección de entrega.");
        return;
    }

    if (entreCalles.length < 3) {
        alert("Ingresá entre qué calles está la dirección.");
        return;
    }

    if (fechaEntrega === "") {
        alert("Elegí una fecha de entrega.");
        return;
    }

    const fechaElegida = new Date(fechaEntrega + "T00:00:00");

    // Revalidar días bloqueados (domingo/lunes), por si el valor se forzó a mano
    const diaSemana = fechaElegida.getDay();
    if (diaSemana === 0 || diaSemana === 1) {
        alert("No hacemos entregas los domingos ni los lunes. Elegí una fecha de martes a sábado.");
        return;
    }

    const minimaValidacion = new Date();
    minimaValidacion.setDate(minimaValidacion.getDate() + 2);
    minimaValidacion.setHours(0, 0, 0, 0);

    if (fechaElegida < minimaValidacion) {
        alert("La fecha de entrega debe ser con un mínimo de 2 días de anticipación.");
        return;
    }

     // 4. Armar el mensaje
    const separador = "▬".repeat(18);

    let mensaje = `★ *Nuevo pedido - Fatu Delicias y Sabores*\n`;
    mensaje += `${separador}\n\n`;

    mensaje += `✎ *Pedido:*\n`;
    carrito.forEach(item => {
        mensaje += `• ${item.cantidad} x ${item.nombrePedido} = $${item.precio * item.cantidad}\n`;
    });
    const subtotal = calcularTotal();
    const descuento = calcularDescuento();

    if (descuento > 0) {
        mensaje += `\nSubtotal: $${subtotal.toFixed(0)}\n`;
        mensaje += `Descuento por volumen (10%): -$${descuento.toFixed(0)}\n`;
    }

    mensaje += `\n✦ *Total: $${calcularTotalFinal().toFixed(0)}*\n\n`;

    mensaje += `${separador}\n`;
    mensaje += `● *Cliente:*\n`;
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += `Teléfono: ${telefono}\n\n`;

    mensaje += `${separador}\n`;
    mensaje += `➤ *Entrega:*\n`;
    mensaje += `Dirección: ${direccion}\n`;
    mensaje += `Entre calles: ${entreCalles}\n`;
    mensaje += `Fecha: ${fechaEntrega}\n`;
    mensaje += `Horario: ${horarioEntrega}\n\n`;

    mensaje += `${separador}\n`;
    mensaje += `● Forma de pago: ${pago}\n`;

    if (observaciones !== "") {
        mensaje += `\n${separador}\n`;
        mensaje += `▸ Observaciones: ${observaciones}\n`;
    }

    // 5. Armar el link de WhatsApp y abrirlo
    const numero = "541171328324";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");


});