const btnWhatsapp = document.querySelector("#btn-whatsapp");

btnWhatsapp.addEventListener("click", () => {

    // 1. Validar que haya al menos un producto
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agregá al menos un producto antes de enviar el pedido.");
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


    if (fechaEntrega === "") {
    alert("Elegí una fecha de entrega.");
    return;
    }

    const minimaValidacion = new Date();
    minimaValidacion.setDate(minimaValidacion.getDate() + 2);
    minimaValidacion.setHours(0, 0, 0, 0);

    const fechaElegida = new Date(fechaEntrega + "T00:00:00");

    if (fechaElegida < minimaValidacion) {
        alert("La fecha de entrega debe ser con un mínimo de 2 días de anticipación.");
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

    // 4. Armar el mensaje
    let mensaje = `🧁 *Nuevo pedido - Fatu Delicias y Sabores*\n\n`;
    mensaje += `📝 Pedido:\n`;

    carrito.forEach(item => {
        mensaje += `- ${item.cantidad} x ${item.nombre} = $${item.precio * item.cantidad}\n`;
    });

    mensaje += `\n💰 Total: $${calcularTotal()}\n\n`;
    mensaje += `👤 Datos del cliente:\n`;
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += `Teléfono: ${telefono}\n`;
    mensaje += `Dirección: ${direccion}\n`;
    mensaje += `Entre calles: ${entreCalles}\n`;
    mensaje += `Fecha de entrega: ${fechaEntrega}\n`;
    mensaje += `Horario: ${horarioEntrega}\n`;
    mensaje += `Forma de pago: ${pago}\n`;

    if (observaciones !== "") {
        mensaje += `Observaciones: ${observaciones}\n`;
    }

    // 5. Armar el link de WhatsApp y abrirlo
    const numero = "541171328324"; // 👈 tu número real
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
});