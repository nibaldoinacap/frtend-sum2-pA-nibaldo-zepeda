document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reserva-form');
    const summary = document.getElementById('error-summary');
    const containerForm = form.parentElement;

    // --- Elementos dinámicos y condicionales ---
    const selectPuerto = document.getElementById('puerto_salida');
    const containerOtroPuerto = document.getElementById('container_otro_puerto');
    const inputOtroPuerto = document.getElementById('otro_puerto');
    
    const checkMayores = document.getElementById('con_adultos_mayores');
    const containerMayores = document.getElementById('container_cant_mayores');
    const inputCantMayores = document.getElementById('cant_mayores');

    const checkNecesidades = document.getElementById('check_necesidades');
    const containerNecesidades = document.getElementById('container_necesidades_texto');
    const textareaNecesidades = document.getElementById('texto_necesidades');

    const inputFechaSalida = document.getElementById('fecha_salida');
    const inputFechaRegreso = document.getElementById('fecha_regreso');
    const textareaComentarios = document.getElementById('comentarios');
    const charCount = document.getElementById('char-count');

    // Visibilidad condicional: Puerto "Otro"
    selectPuerto.addEventListener('change', () => {
        if (selectPuerto.value === 'otro') {
            containerOtroPuerto.style.display = 'block';
        } else {
            containerOtroPuerto.style.display = 'none';
            inputOtroPuerto.value = '';
            removeError(inputOtroPuerto);
        }
    });

    // Visibilidad condicional: Adultos Mayores
    checkMayores.addEventListener('change', () => {
        if (checkMayores.checked) {
            containerMayores.style.display = 'block';
        } else {
            containerMayores.style.display = 'none';
            inputCantMayores.value = '';
            removeError(inputCantMayores);
        }
    });

    // Visibilidad condicional: Necesidades Especiales
    checkNecesidades.addEventListener('change', () => {
        if (checkNecesidades.checked) {
            containerNecesidades.style.display = 'block';
        } else {
            containerNecesidades.style.display = 'none';
            textareaNecesidades.value = '';
            removeError(textareaNecesidades);
        }
    });

    // Contador de caracteres en tiempo real (Comentarios)
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

    function validarFechaRegreso(element) {
        const salida = new Date(inputFechaSalida.value);
        const regreso = new Date(element.value);
        if (regreso <= salida) {
            showError(element, 'El regreso debe ser posterior a la salida.');
            return false;
        } else {
            showSuccess(element);
            return true;
        }
    }

    // --- Validación Principal en Submit ---
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
        const grupoPaquete = document.getElementById('grupo-tipo-paquete');
        check(tipoPaquete !== null, grupoPaquete, 'Seleccione un tipo de paquete.');

        // Fechas
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        let difDias = -1;
        if (inputFechaSalida.value) {
            const salida = new Date(inputFechaSalida.value);
            salida.setDate(salida.getDate() + 1); // Ajuste timezone
            difDias = (salida - hoy) / (1000 * 60 * 60 * 24);
        }
        check(inputFechaSalida.value && difDias >= 7, inputFechaSalida, 'La fecha debe ser al menos 7 días desde hoy.');

        if (inputFechaRegreso.value && inputFechaSalida.value) {
            const salida = new Date(inputFechaSalida.value);
            const regreso = new Date(inputFechaRegreso.value);
            check(regreso > salida, inputFechaRegreso, 'El regreso debe ser estrictamente posterior a la salida.');
        } else {
            check(false, inputFechaRegreso, 'Seleccione una fecha de regreso.');
        }

        const duracion = document.getElementById('duracion');
        check(duracion.value !== '', duracion, 'Seleccione la duración aproximada.');

        check(selectPuerto.value !== '', selectPuerto, 'Seleccione el puerto de salida.');
        if (selectPuerto.value === 'otro') {
            check(inputOtroPuerto.value.trim() !== '', inputOtroPuerto, 'Especifique la ciudad de salida.');
        }

        // --- SECCIÓN B ---
        const cantAdultos = document.getElementById('cant_adultos');
        const cantMenores = document.getElementById('cant_menores');
        const vAdultos = parseInt(cantAdultos.value);
        const vMenores = parseInt(cantMenores.value) || 0;
        
        check(vAdultos >= 1 && vAdultos <= 10, cantAdultos, 'Debe haber mínimo 1 y máximo 10 adultos.');
        check(vMenores >= 0 && vMenores <= 8 && vMenores <= (vAdultos * 2), cantMenores, 'Los menores no pueden superar el doble de adultos (Máx 8).');

        if (checkMayores.checked) {
            const vMayores = parseInt(inputCantMayores.value);
            check(!isNaN(vMayores) && vMayores > 0 && vMayores <= vAdultos, inputCantMayores, 'Indique una cantidad válida de adultos mayores.');
        }

        const nombre = document.getElementById('nombre_principal');
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,80}$/;
        check(nombreRegex.test(nombre.value.trim()), nombre, 'El nombre debe contener solo letras (entre 5 y 80 caracteres).');

        const dni = document.getElementById('dni_pasaporte');
        const dniRegex = /^[a-zA-Z0-9]{7,12}$/;
        check(dniRegex.test(dni.value.trim()), dni, 'El documento debe ser alfanumérico entre 7 y 12 caracteres.');

        const fechaNac = document.getElementById('fecha_nac_principal');
        if (fechaNac.value) {
            const nac = new Date(fechaNac.value);
            const edad = Math.floor((new Date() - nac) / (365.25 * 24 * 60 * 60 * 1000));
            check(edad >= 18, fechaNac, 'El pasajero principal debe ser mayor de 18 años.');
        } else {
            check(false, fechaNac, 'Seleccione la fecha de nacimiento.');
        }

        const nacionalidad = document.getElementById('nacionalidad');
        check(nacionalidad.value !== '', nacionalidad, 'Seleccione su nacionalidad.');

        const email = document.getElementById('email_principal');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        check(emailRegex.test(email.value.trim()), email, 'Ingrese un correo electrónico válido (ej: nombre@dominio.com).');

        const telefono = document.getElementById('telefono_principal');
        const numCount = (telefono.value.match(/\d/g) || []).length;
        const telRegex = /^[\d\s+\-]+$/;
        check(telRegex.test(telefono.value) && numCount >= 8, telefono, 'Ingrese un teléfono válido (mínimo 8 dígitos).');

        if (checkNecesidades.checked) {
            check(textareaNecesidades.value.trim() !== '', textareaNecesidades, 'Por favor, detalle sus necesidades especiales.');
        }

        // --- SECCIÓN C ---
        const tipoHab = document.querySelector('input[name="tipo_hab"]:checked');
        const grupoHabitacion = document.getElementById('grupo-habitacion');
        check(tipoHab !== null, grupoHabitacion, 'Seleccione un tipo de habitación.');

        const regimenComidas = document.getElementById('regimen_comidas');
        check(regimenComidas.value !== '', regimenComidas, 'Seleccione un régimen de comidas.');

        const presupuesto = document.getElementById('presupuesto');
        check(presupuesto.value !== '', presupuesto, 'Seleccione un presupuesto estimado.');

        // --- SECCIÓN D ---
        check(textareaComentarios.value.length <= 300, textareaComentarios, 'Los comentarios no pueden exceder los 300 caracteres.');

        const terminos = document.getElementById('terminos');
        const privacidad = document.getElementById('privacidad');
        check(terminos.checked, terminos.parentElement, 'Debe aceptar los Términos y Condiciones.');
        check(privacidad.checked, privacidad.parentElement, 'Debe aceptar la Política de Privacidad.');

        // --- Resultados de la Validación ---
        if (hasErrors) {
            summary.style.display = 'block';
            summary.textContent = `Se encontraron ${erroresCount} campos con errores. Por favor corríjalos antes de continuar.`;
            // Scroll suave hacia el primer error detectado
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            summary.style.display = 'none';
            mostrarConfirmacion(
                nombre.value, 
                destino.options[destino.selectedIndex].text, 
                inputFechaSalida.value, 
                vAdultos + vMenores
            );
        }
    });

    // --- Funciones Auxiliares ---
    function showError(element, message) {
        element.classList.remove('campo-ok');
        element.classList.add('campo-error');
        
        let error = document.createElement('div');
        error.className = 'error-text';
        error.textContent = message;
        
        // Manejo especial para radio buttons agrupados
        if(element.tagName === 'DIV') {
            element.appendChild(error);
        } else {
            element.parentElement.appendChild(error);
        }

        // Limpiar el error cuando el usuario interactúe con el campo
        const eventType = (element.tagName === 'SELECT' || element.type === 'radio' || element.type === 'checkbox' || element.type === 'date') ? 'change' : 'input';
        
        element.addEventListener(eventType, function onInteract() {
            removeError(element);
            element.classList.add('campo-ok');
            element.removeEventListener(eventType, onInteract);
        });
    }

    function removeError(element) {
        element.classList.remove('campo-error');
        let parent = (element.tagName === 'DIV') ? element : element.parentElement;
        const errorMsg = parent.querySelector('.error-text');
        if (errorMsg) errorMsg.remove();
    }

    function showSuccess(element) {
        element.classList.remove('campo-error');
        if (element.tagName !== 'DIV') {
            element.classList.add('campo-ok');
        }
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
            <p>Fecha de salida: <strong>${fecha}</strong> | Pasajeros totales: <strong>${totalPax}</strong></p>
            <p>Número de solicitud de reserva: <strong>#${numReserva}</strong></p>
            <br>
            <button class="btn-primary" onclick="window.location.reload()">Hacer otra reserva</button>
            <a href="index.html" class="btn-secondary" style="display:inline-block; padding:12px 25px; text-decoration:none;">Volver al inicio</a>
        `;
        containerForm.appendChild(div);
    }
});