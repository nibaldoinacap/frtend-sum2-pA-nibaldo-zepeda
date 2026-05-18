document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reserva-form');
    const summary = document.getElementById('error-summary');
    const containerForm = form.parentElement;

    // Elementos dinámicos
    const selectPuerto = document.getElementById('puerto_salida');
    const containerOtroPuerto = document.getElementById('container_otro_puerto');
    const inputOtroPuerto = document.getElementById('otro_puerto');
    const inputFechaSalida = document.getElementById('fecha_salida');
    const inputFechaRegreso = document.getElementById('fecha_regreso');
    const textareaComentarios = document.getElementById('comentarios');
    const charCount = document.getElementById('char-count');

    // Visibilidad condicional del puerto
    selectPuerto.addEventListener('change', () => {
        if (selectPuerto.value === 'otro') {
            containerOtroPuerto.style.display = 'block';
        } else {
            containerOtroPuerto.style.display = 'none';
            inputOtroPuerto.value = '';
            removeError(inputOtroPuerto);
        }
    });

    // Contador de caracteres en tiempo real
    textareaComentarios.addEventListener('input', () => {
        const len = textareaComentarios.value.length;
        charCount.textContent = `${len} / 300`;
        if (len >= 300) charCount.style.color = 'red';
        else if (len >= 240) charCount.style.color = 'orange';
        else charCount.style.color = 'black';
    });

    // Validar regreso al cambiar salida
    inputFechaSalida.addEventListener('change', () => {
        if(inputFechaRegreso.value) validarFechaRegreso(inputFechaRegreso);
    });

    // Función principal de validación en el Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        document.querySelectorAll('.error-text').forEach(el => el.remove());
        let hasErrors = false;
        let primerError = null;
        let erroresCount = 0;

        function check(condition, inputElement, message) {
            if (!condition) {
                showError(inputElement, message);
                hasErrors = true;
                erroresCount++;
                if (!primerError) primerError = inputElement;
            } else {
                showSuccess(inputElement);
            }
        }

        // --- SECCIÓN A ---
        const destino = document.getElementById('destino');
        check(destino.value !== '', destino, 'Seleccione un destino.');

        const tipoPaquete = document.querySelector('input[name="tipo_paquete"]:checked');
        const radiosPaquete = document.getElementsByName('tipo_paquete');
        check(tipoPaquete !== null, radiosPaquete[0].parentElement.parentElement, 'Seleccione un tipo de paquete.');

        // Fechas
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        const salida = new Date(inputFechaSalida.value);
        salida.setDate(salida.getDate() + 1); // Ajuste timezone
        const difDias = (salida - hoy) / (1000 * 60 * 60 * 24);
        check(inputFechaSalida.value && difDias >= 7, inputFechaSalida, 'La fecha debe ser al menos 7 días desde hoy.');

        const regreso = new Date(inputFechaRegreso.value);
        regreso.setDate(regreso.getDate() + 1);
        check(inputFechaRegreso.value && regreso > salida, inputFechaRegreso, 'El regreso debe ser posterior a la salida.');

        const duracion = document.getElementById('duracion');
        check(duracion.value !== '', duracion, 'Seleccione la duración.');

        check(selectPuerto.value !== '', selectPuerto, 'Seleccione puerto de salida.');
        if (selectPuerto.value === 'otro') {
            check(inputOtroPuerto.value.trim() !== '', inputOtroPuerto, 'Especifique la ciudad.');
        }

        // --- SECCIÓN B ---
        const cantAdultos = document.getElementById('cant_adultos');
        const cantMenores = document.getElementById('cant_menores');
        const vAdultos = parseInt(cantAdultos.value);
        const vMenores = parseInt(cantMenores.value) || 0;
        
        check(vAdultos >= 1 && vAdultos <= 10, cantAdultos, 'Mínimo 1, máximo 10 adultos.');
        check(vMenores >= 0 && vMenores <= 8 && vMenores <= (vAdultos * 2), cantMenores, 'Máximo 8 menores (no puede superar el doble de adultos).');

        const nombre = document.getElementById('nombre_principal');
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,80}$/;
        check(nombreRegex.test(nombre.value.trim()), nombre, 'Solo letras y espacios (5-80 caracteres).');

        const dni = document.getElementById('dni_pasaporte');
        const dniRegex = /^[a-zA-Z0-9]{7,12}$/;
        check(dniRegex.test(dni.value.trim()), dni, 'Alfanumérico entre 7 y 12 caracteres.');

        const fechaNac = document.getElementById('fecha_nac_principal');
        const nac = new Date(fechaNac.value);
        const edad = Math.floor((new Date() - nac) / (365.25 * 24 * 60 * 60 * 1000));
        check(fechaNac.value && edad >= 18, fechaNac, 'El pasajero principal debe ser mayor de 18 años.');

        const email = document.getElementById('email_principal');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        check(emailRegex.test(email.value.trim()), email, 'Formato de correo inválido.');

        const telefono = document.getElementById('telefono_principal');
        const numCount = (telefono.value.match(/\d/g) || []).length;
        const telRegex = /^[\d\s+\-]+$/;
        check(telRegex.test(telefono.value) && numCount >= 8, telefono, 'Mínimo 8 dígitos permitiendo +, guiones y espacios.');

        // --- SECCIÓN C & D ---
        const tipoHab = document.getElementById('tipo_hab');
        check(tipoHab.value !== '', tipoHab, 'Seleccione tipo de habitación.');

        check(textareaComentarios.value.length <= 300, textareaComentarios, 'Máximo 300 caracteres.');

        const terminos = document.getElementById('terminos');
        const privacidad = document.getElementById('privacidad');
        check(terminos.checked, terminos.parentElement, 'Debe aceptar los Términos y Condiciones.');
        check(privacidad.checked, privacidad.parentElement, 'Debe aceptar la Política de Privacidad.');


        // Resultados
        if (hasErrors) {
            summary.style.display = 'block';
            summary.textContent = `Se encontraron ${erroresCount} campos con errores. Por favor corríjalos antes de continuar.`;
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            summary.style.display = 'none';
            mostrarConfirmacion(nombre.value, destino.options[destino.selectedIndex].text, inputFechaSalida.value, vAdultos + vMenores);
        }
    });

    // Funciones Helper para CSS
    function showError(element, message) {
        element.classList.remove('campo-ok');
        element.classList.add('campo-error');
        
        let error = document.createElement('div');
        error.className = 'error-text';
        error.textContent = message;
        element.parentElement.appendChild(error);

        // Limpieza al modificar
        element.addEventListener('input', function onInput() {
            removeError(element);
            element.classList.add('campo-ok');
            element.removeEventListener('input', onInput);
        });
    }

    function removeError(element) {
        element.classList.remove('campo-error');
        const parent = element.parentElement;
        const errorMsg = parent.querySelector('.error-text');
        if (errorMsg) errorMsg.remove();
    }

    function showSuccess(element) {
        element.classList.remove('campo-error');
        element.classList.add('campo-ok');
    }

    function mostrarConfirmacion(nombre, destino, fecha, totalPax) {
        form.style.display = 'none';
        const numReserva = Math.floor(Math.random() * 1000000);
        
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.innerHTML = `
            <h2 style="color: green;">¡Reserva Solicitada con Éxito!</h2>
            <p>Gracias <strong>${nombre}</strong>.</p>
            <p>Destino: <strong>${destino}</strong></p>
            <p>Fecha de salida: <strong>${fecha}</strong> | Pasajeros: <strong>${totalPax}</strong></p>
            <p>Número de solicitud: <strong>#${numReserva}</strong></p>
            <br>
            <button class="btn-primary" onclick="window.location.reload()">Hacer otra reserva</button>
            <a href="index.html" class="btn-secondary" style="display:inline-block; padding:12px 25px; text-decoration:none;">Volver al inicio</a>
        `;
        containerForm.appendChild(div);
    }
});