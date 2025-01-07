
// DECLARAR VARIABLES
const caja = document.getElementById("caja");

const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const buttPantalla3 = document.getElementById("buttPantalla3");

const freeText = document.getElementById("freeText");
const inputRadio = document.getElementById("inputRadio");
const numberInput = document.getElementById("numberInput");
const buttAtras = document.getElementById("buttAtras");
const buttGrabar = document.getElementById("buttGrabar");

var keyA = false;
var contador = 0;

// FUNCIONES BÁSICAS

// setCookie: establece una cookie indicando variable, valor y días para la expiración
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// getCookie: recibe el nombre de la variable y devuelve su valor
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// checkCookie: comprueba que una cookie existe y en caso negativo la crea
function checkCookie(username) {
    let user = getCookie(username);
    if (user === "") { 
        // Si no existe o está vacío, crear la cookie
        setCookie(username, "[]", 2); 
    }
}


// PANTALLA 1

// Verificar si la URL actual es "pantalla1.html"
if (window.location.pathname.includes('Pantalla1.html')) {
    // Temporizador para registrar usuario automáticamente después de 5 segundos
    var templ = setTimeout(registrarUsuario, 5000);

    // Detectar si se presiona Ctrl + A
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'a') {
            event.preventDefault(); // Previene el comportamiento por defecto
            clearTimeout(templ);
            registrarUsuario(); // Llamar a la función registrarUsuario()
        }
    });

    // Función para registrar al usuario y mostrar el campo de correo
    function registrarUsuario() {
        caja.innerHTML = ""; // Limpiar el contenido previo

        // Crear elementos para el formulario
        var labelNodo = document.createElement("label");
        labelNodo.innerText = "Usuario";
        var inputText = document.createElement("input");
        inputText.type = "text";
        inputText.id = "correoInput"; // ID para referenciar el campo

        // Agregar elementos al contenedor
        caja.appendChild(labelNodo);
        caja.appendChild(inputText);

        // Evento "blur" para validar el correo electrónico ingresado
        inputText.addEventListener('blur', function() {
            const correo = inputText.value;

            // Expresión regular para validar el correo
            const regexCorreo = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

            // Validar el correo
            if (!regexCorreo.test(correo)) {
                alert("Correo electrónico incorrecto. Por favor, ingresa un correo válido.");
                
                // Usar setTimeout para seleccionar el texto después del blur
                setTimeout(() => {
                    inputText.select();
                }, 100); 
            } else {
                // Extraer el nombre del correo antes del '@'
                correoName = correo.split('@')[0];
                checkCookie(correoName);

                // Redirigir a Pantalla2.html con el nombre como parámetro
                window.location.href = 'Pantalla2.html?user=' + correoName;
            }
        });
    }
}


// PANTALLA 2
if (window.location.pathname.includes('Pantalla2.html')) {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');

    checkCookieDate(username + "Date");

    // checkCookieDate: verifica si existe una cookie con la fecha de acceso
    function checkCookieDate(userDate) {
        let userD = getCookie(userDate);
        if (userD === "") { 
            console.log("correcto");
            setCookie(userDate, new Date(), 2); // Crear cookie con la fecha actual
            mostrarFecha();
        } else {
            console.log("ya has entrado antes con esta cuenta");
            mostrarFecha();  
            setCookie(userDate, new Date(), 2); // Actualizar la cookie con la nueva fecha
        }
    }

    // mostrarFecha: muestra la última fecha de acceso en el HTML
    function mostrarFecha() {
        text1.innerHTML = "Hola [" + username + "]";

        const fecha = new Date(getCookie(username + "Date")); // Convertir la cookie a objeto Date

        // Formatear fecha y hora
        const DD = fecha.getDate().toString().padStart(2, '0');
        const MM = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
        const AAAA = fecha.getFullYear();
        const HH = fecha.getHours().toString().padStart(2, '0');
        const Mm = fecha.getMinutes().toString().padStart(2, '0');
        const SS = fecha.getSeconds().toString().padStart(2, '0');

        // Mostrar la fecha en el elemento correspondiente
        text2.innerHTML = `La última vez que entraste<br>fue el ${DD}/${MM}/${AAAA}<br>a las ${HH}:${Mm}:${SS}`;
    }

    // Navegar a Pantalla3.html al hacer clic en el botón
    buttPantalla3.addEventListener("click", function() {
        window.location.href = 'Pantalla3.html?user=' + username;
    });
}


// PANTALLA 3

if (window.location.pathname.includes('Pantalla3.html')) {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');
    cargarTabla(); // Cargar preguntas almacenadas al cargar la página

    // Función para verificar si todos los campos están llenos correctamente
    function rAllCampos() {
        let emptyCampo = false;

        const freeText = document.getElementById("freeText");
        const numberInput = document.getElementById("numberInput");
        const inputRadios = document.getElementsByName("verdaderoFalso");

        // Validar campo de texto
        if (freeText.value.trim() === "") emptyCampo = true;

        // Validar campo numérico (entre 0 y 9)
        const numberValue = parseInt(numberInput.value.trim(), 10);
        if (isNaN(numberValue) || numberValue < 0 || numberValue > 9) emptyCampo = true;

        // Validar selección de radio button
        let radioChecked = false;
        for (const radio of inputRadios) {
            if (radio.checked) {
                radioChecked = true;
                break;
            }
        }
        if (!radioChecked) emptyCampo = true;

        // Alertar al usuario si algún campo no está completo
        if (emptyCampo) {
            alert("No has llenado todos los campos correctamente.");
        } else {
            contador++; // Incrementar contador de temporizadores activos
            grabar(); // Llamar a la función grabar()
        }
    }

    // Función para grabar una nueva pregunta en la tabla y las cookies
    function grabar() {
        const freeText = document.getElementById("freeText");
        const numberInput = document.getElementById("numberInput");
        const inputRadios = document.getElementsByName("verdaderoFalso");
        const buttAtras = document.getElementById("buttAtras");

        buttAtras.disabled = true; // Deshabilitar botón "Atrás" durante la grabación

        // Obtener datos de la cookie o inicializar una nueva lista
        let cuestion = getCookie(username);
        cuestion = cuestion ? JSON.parse(cuestion) : [];

        // Obtener el valor del radio seleccionado
        let selectedRadioValue = null;
        for (const radio of inputRadios) {
            if (radio.checked) {
                selectedRadioValue = radio.value;
                break;
            }
        }

        // Crear un objeto para la nueva pregunta
        const cuestionario = {
            Pregunta: freeText.value,
            Respuesta: selectedRadioValue,
            Puntuacion: numberInput.value,
            Estado: "Grabando"
        };

        // Agregar la nueva pregunta a la lista
        cuestion.push(cuestionario);

        // Guardar la lista actualizada en las cookies
        setCookie(username, JSON.stringify(cuestion), 2);

        // Agregar la nueva pregunta a la tabla
        agregarFilaATabla(cuestionario);

         // Vaciar los campos del formulario
         freeText.value = "";
         numberInput.value = "";
         inputRadios.forEach(radio => radio.checked = false);
       
        // Temporizador para actualizar el estado de las preguntas
        grabar.temporizador = setTimeout(() => {
            cuestion.forEach((pregunta, index) => {
                pregunta.Estado = "OK"; //Cambiar estado a "OK"

                // Actualizar el estado en la tabla
                const tabla = document.querySelector("#caja2 table");
                if (tabla && tabla.rows[index + 1]) {
                    tabla.rows[index + 1].cells[3].innerText = "OK";
                }
            });

            contador--; // Decrementar contador

            // Guardar los cambios en la cookie
            if (contador === 0) setCookie(username, JSON.stringify(cuestion), 2);

            //habilitar botón
            if (contador === 0) buttAtras.disabled = false;

           
        }, 5000); // Actualizar después de 5 segundos
    }

    // Función para agregar una fila a la tabla
    function agregarFilaATabla(cuestionario) {
        const tabla = document.querySelector("#caja2 table");
        const fila = tabla.insertRow();
        fila.innerHTML = `
            <td>${cuestionario.Pregunta}</td>
            <td>${cuestionario.Respuesta}</td>
            <td>${cuestionario.Puntuacion}</td>
            <td>${cuestionario.Estado}</td>
        `;
    }

    // Función para cargar preguntas almacenadas en la tabla desde las cookies
    function cargarTabla() {
        const cuestion = getCookie(username);
        if (cuestion) {
            const listaCuestionarios = JSON.parse(cuestion);
            for (const cuestionario of listaCuestionarios) {
                agregarFilaATabla(cuestionario);
            }
        }
    }

    // Navegar a la pantalla 2 al hacer clic en el botón "Atrás"
    buttAtras.addEventListener("click", function() {
        window.location.href = 'Pantalla2.html?user=' + username;
    });

    // Validar campos y grabar una nueva pregunta al hacer clic en "Grabar"
    buttGrabar.addEventListener("click", function() {
        rAllCampos();
    });
}
