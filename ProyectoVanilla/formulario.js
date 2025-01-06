
//DECLARAR VARIABLES
const caja = document.getElementById("caja");

const text1= document.getElementById("text1");
const text2= document.getElementById("text2");
const buttPantalla3= document.getElementById("buttPantalla3");

const freeText=document.getElementById("freeText");
const inputRadio=document.getElementById("inputRadio");
const numberInput=document.getElementById("numberInput");
const buttAtras= document.getElementById("buttAtras");
const buttGrabar= document.getElementById("buttGrabar");


//FUNCTIONES BÁSICAS

//setCookie: establece una cookie indicandole variable, valor y días para la expiración
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }


//getCookie: recibe el nombre de la variable y devuelve su valor
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
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

//checkCoockie: comprueba que una cookie existe y en caso negativo la crea
function checkCookie(username) {
    let user = getCookie(username);
    if (user === "") { // Si no existe o está vacío
        setCookie(username, "[]", 2); // Crear la cookie donde después gurdaremos varios objetos   
    }
}



// PANTALLA 1


 // Verificar si la URL actual es "pantalla1.html"
 if (window.location.pathname.includes('Pantalla1.html')) {

    // Presionaron Control (Ctrl) + A
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'a') {
            event.preventDefault(); // Previene el comportamiento por defecto (si lo tiene)
            registrarUsuario(); // Llamar a la función registrarUsuario()
        }
    });

    // Temporizador
    setTimeout(registrarUsuario, 5000);




// Función para registrar al usuario y mostrar el campo de correo
function registrarUsuario() {
   
    caja.innerHTML = "";  // Limpiar el contenido previo

    // Crear contenido
    var labelNodo = document.createElement("label");
    labelNodo.innerText = "Usuario";
    var inputText = document.createElement("input");
    inputText.type = "text";
    inputText.id = "correoInput";  // Agregar ID para referenciar el campo

    caja.appendChild(labelNodo);
    caja.appendChild(inputText);

    // Agregar el evento de "blur" al campo de correo
    inputText.addEventListener('blur', function() {
        // Obtener el valor del correo
        const correo = inputText.value;

        // Expresión regular para validar el correo electrónico
        const regexCorreo = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

        // Validar el correo
        if (!regexCorreo.test(correo)) {
            // Mostrar mensaje de correo incorrecto
            alert("Correo electrónico incorrecto. Por favor, ingresa un correo válido.");

            // Usamos setTimeout para esperar un poco antes de seleccionar el texto
            setTimeout(() => {
                // Seleccionar todo el texto para que el usuario lo pueda corregir
                inputText.select();
            }, 100);  // Espera 100 ms para permitir que el evento 'blur' termine
        }else{
            correoName=correo.split('@')[0]; //nos quedamos solo con el nombre para simplificar [ eric@gmail.com => eric ]
            checkCookie(correoName);
            window.location.href = 'Pantalla2.html?user='+correoName;
            
        }
    });
}

}

// PANTALLA 2
if (window.location.pathname.includes('Pantalla2.html')) {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');
    
    checkCookieDate(username+"Date");

    function checkCookieDate(userDate) {
        let userD = getCookie(userDate);
        if (userD === "") { // Si no existe o está vacío
            console.log("correcto");
            setCookie(userDate, new Date(), 2); // Crear la cookie donde guardamos el momento exacto en el que se crea
            mostrarFecha(); 
        }else{
            //en el caso de que ya exista la cookie primero mostramos la función mostrarFecha() y luego ya actualizamos el valor de la cookie userDate
            console.log("ya has entrado antes con esta cuenta");
            mostrarFecha();  
            setCookie(userDate, new Date(), 2); // Crear la cookie donde guardamos el momento exacto en el que se crea
        }
    }
    

    function mostrarFecha(){
        text1.innerHTML="Hola ["+username+"]";
        
        const fecha = new Date(getCookie(username+"Date")); // Convertir la cookie a objeto Date

        // Extraer componentes de la fecha y hora
        const DD = fecha.getDate().toString().padStart(2, '0');
        const MM = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
        const AAAA = fecha.getFullYear();
        const HH = fecha.getHours().toString().padStart(2, '0');
        const Mm = fecha.getMinutes().toString().padStart(2, '0');
        const SS = fecha.getSeconds().toString().padStart(2, '0');

        text2.innerHTML="La útlima vez que entraste<br>fue el "+DD+"/"+MM+"/"+AAAA+"<br>a las "+HH+":"+Mm+":"+SS+"";
    }

    buttPantalla3.addEventListener("click", function() {
        window.location.href = 'Pantalla3.html?user='+username;
    });

}




// PANTALLA 3


if (window.location.pathname.includes('Pantalla3.html')) {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');
    cargarTabla();

    //Rellenar todos los campos
    function rAllCampos() {
        let emptyCampo = false;
    
        const freeText = document.getElementById("freeText");
        const numberInput = document.getElementById("numberInput");
        const inputRadios = document.getElementsByName("verdaderoFalso");
    
        // Verificar si el campo de texto está vacío
        if (freeText.value.trim() === "") emptyCampo = true;
    
        // Verificar si el campo numérico está vacío o fuera del rango permitido
        const numberValue = parseInt(numberInput.value.trim(), 10);
        if (isNaN(numberValue) || numberValue < 0 || numberValue > 9) emptyCampo = true;
    
        // Verificar si al menos un radio está seleccionado
        let radioChecked = false;
        for (const radio of inputRadios) {
            if (radio.checked) {
                radioChecked = true;
                break;
            }
        }
        if (!radioChecked) emptyCampo = true;
    
        // Mostrar mensaje si algún campo está vacío o incompleto
        if (emptyCampo) {
            alert("No has llenado todos los campos correctamente.");
        } else {
            //alert("Todos los campos están completos.");
            grabar();
        }
    }

    function grabar() {
        const freeText = document.getElementById("freeText");
        const numberInput = document.getElementById("numberInput");
        const inputRadios = document.getElementsByName("verdaderoFalso");
        const buttAtras = document.getElementById("buttAtras");
    
        buttAtras.disabled = true; // Deshabilitar el botón para volver atrás
    
        // Obtener el array de la cookie o inicializarlo si no existe
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
    
        // Crear el nuevo objeto pregunta
        const cuestionario = {
            Pregunta: freeText.value,
            Respuesta: selectedRadioValue,
            Puntuacion: numberInput.value,
            Estado: "Grabando"
        };
    
        // Agregar la nueva pregunta al array
        cuestion.push(cuestionario);
    
        // Actualizar la cookie con el array completo
        setCookie(username, JSON.stringify(cuestion), 2);
    
        // Actualizar la tabla con la nueva pregunta
        agregarFilaATabla(cuestionario);
    
        // Asegurarse de que todas las preguntas se actualicen después de 5 segundos
        if (!grabar.temporizador) {
            grabar.temporizador = setTimeout(() => {
                //Vuelvo a declarar cuestion por si se han agregado más elementos:
                cuestion = JSON.parse(getCookie(username));

                // Actualizar el estado de todas las preguntas a "OK"
                cuestion.forEach((pregunta, index) => {
                    pregunta.Estado = "OK";
    
                    // Actualizar la celda correspondiente en la tabla
                    const tabla = document.querySelector("#caja2 table");
                    if (tabla && tabla.rows[index + 1]) {
                        tabla.rows[index + 1].cells[3].innerText = "OK";
                    }
                });
    
                // Guardar los cambios en la cookie
                setCookie(username, JSON.stringify(cuestion), 2);
    
                // Habilitar el botón "Atrás" ya que todo está en "OK"
                buttAtras.disabled = false;
    
                // Limpiar el temporizador
                grabar.temporizador = null;
            }, 5000); // 5 segundos desde el primer clic
        }
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

    // Mostrar todas las preguntas almacenadas en la cookie
    function cargarTabla() {
        const cuestion = getCookie(username);
        if (cuestion) {
            const listaCuestionarios = JSON.parse(cuestion);
            for (const cuestionario of listaCuestionarios) {
                agregarFilaATabla(cuestionario);
            }
        }
    }
    

    //Ir a la pantalla 2
    buttAtras.addEventListener("click", function() {
        window.location.href = 'Pantalla2.html?user='+username;
    });

    //Comprobar campos vacíos + grabar preguntas
    buttGrabar.addEventListener("click", function() {
       rAllCampos();
    });


}


