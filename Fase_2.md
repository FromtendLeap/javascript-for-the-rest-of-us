# FASE 2: Añadir Webcam al Sistema

## Objetivo de la fase
Integrar acceso a la webcam en nuestro sistema, convirtiendo `init()` en función asíncrona y añadiendo `initCamera()`.

## Timing estimado: 40 minutos

---

### Concepto 1: APIs del navegador + Async/await
- **Explicación**: Para acceder a la webcam necesitamos una **API** (menú de opciones del navegador). `navigator.mediaDevices.getUserMedia()` nos da acceso, pero como tarda tiempo (pedir permiso), necesitamos **async/await** para esperar el resultado sin bloquear el navegador.
- **Demo RunJS**:
```js
// Verificar si tenemos la API
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('✅ Podemos acceder a la webcam');
  
  // Función async que usa await para operaciones que tardan
  async function probarAcceso() {
    try {
      console.log('🔄 Empezando...');
      
      // await espera a que termine antes de continuar
      const response = await fetch('https://api.github.com/users/octocat');
      const data = await response.json();
      
      console.log('✅ Resultado:', data.name);
      console.log('🏁 Terminado');
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  probarAcceso();
  console.log('Esta línea aparece inmediatamente');
} else {
  console.log('❌ Tu navegador no tiene acceso a webcam');
}
```
- **Aplicación a la fase**: Creamos `initCamera()` usando la API real
```js
// Función que usa la API para acceder a la webcam
async function initCamera() {
  const constraints = {
    video: {
      width: 320,
      height: 240,
      facingMode: 'user',
    },
    audio: false,
  };

  // getUserMedia() devuelve una promesa
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  webcamVideo.srcObject = stream;

  webcamVideo.onloadedmetadata = (metadata) => {
    canvas.width = webcamVideo.videoWidth;
    canvas.height = webcamVideo.videoHeight;
  };

  return true;
}
```
- **Resultado esperado**: Tenemos la función que accede a la webcam usando APIs y promesas

---

### Concepto 2: Try/catch + Integración de webcam
- **Explicación**: Cuando algo puede fallar (como pedir acceso a la webcam), usamos **try/catch** - "intenta esto, si falla haz esto otro". Es nuestro "plan B" para cuando las cosas salen mal.
- **Demo RunJS**:
```js
// Función que podría fallar
async function operacionRiesgosa() {
  try {
    console.log('🔄 Intentando operación...');
    
    // Simular fallo aleatorio
    if (Math.random() > 0.5) {
      throw new Error('¡Ups! Algo salió mal');
    }
    
    console.log('✅ Operación exitosa');
    return 'Todo bien';
  } catch (error) {
    console.log('❌ Error capturado:', error.message);
    console.log('🔧 Ejecutando plan B...');
    return 'Plan B funcionó';
  }
}

// Probar varias veces
for (let i = 1; i <= 3; i++) {
  console.log(`Intento ${i}:`);
  console.log('Resultado:', await operacionRiesgosa());
}
```
- **Aplicación a la fase**: Integramos `initCamera()` en `init()` con manejo de errores
```js
// Convertimos init() en función async y añadimos try/catch
async function init() {
  try {
    if (isDetecting) {
      console.log('Deteniendo sistema...');
      isDetecting = false;
    } else {
      console.log('Iniciando sistema...');
      await initCamera(); // ¡Aquí usamos await para esperar la webcam!
      isDetecting = true;
    }

    startStopButton.querySelector('span').textContent = isDetecting
      ? 'Parar'
      : 'Iniciar';
  } catch (error) {
    isDetecting = false;
    console.warn('Error en el sistema:', error);
  }
}
```
- **Resultado esperado**: El sistema espera a que la webcam esté lista y maneja errores

---

### Concepto 3: Capturar y clasificar errores específicos
- **Explicación**: La webcam puede fallar de diferentes formas: usuario niega permiso, no hay cámara, está siendo usada por otra app, etc. Necesitamos **identificar cada tipo de error** y responder apropiadamente con mensajes específicos.
- **Demo RunJS**:
```js
// Simular diferentes tipos de errores de webcam
async function simularErroresWebcam() {
  const tiposError = [
    { name: 'NotAllowedError', message: 'Permiso denegado' },
    { name: 'NotFoundError', message: 'No hay cámara' },
    { name: 'NotReadableError', message: 'Cámara en uso' }
  ];
  
  for (const error of tiposError) {
    try {
      throw error; // Simular el error
    } catch (e) {
      console.log(`❌ Error capturado: ${e.name}`);
      
      // Usar if/else para clasificar errores
      if (e.name === 'NotAllowedError') {
        console.log('💡 Solución: Recargar página y dar permiso');
      } else if (e.name === 'NotFoundError') {
        console.log('💡 Solución: Conectar una cámara al dispositivo');
      } else if (e.name === 'NotReadableError') {
        console.log('💡 Solución: Cerrar otras apps que usen la cámara');
      } else {
        console.log('💡 Error desconocido');
      }
      console.log('---');
    }
  }
}

simularErroresWebcam();
```
- **Aplicación a la fase**: Mejoramos `init()` con clasificación específica de errores de webcam
```js
async function init() {
  try {
    if (isDetecting) {
      console.log('Deteniendo sistema...');
      isDetecting = false;
    } else {
      console.log('Iniciando sistema...');
      await initCamera();
      console.log('✅ Webcam iniciada correctamente');
      isDetecting = true;
    }

    startStopButton.querySelector('span').textContent = isDetecting
      ? 'Parar'
      : 'Iniciar';
  } catch (error) {
    isDetecting = false;
    
    // Clasificar errores específicos de webcam con if/else
    if (error.name === 'NotAllowedError') {
      console.warn('❌ Permiso denegado para la cámara');
      alert('Se necesita permiso para acceder a la cámara');
    } else if (error.name === 'NotFoundError') {
      console.warn('❌ No se encontró cámara');
      alert('No se encontró ninguna cámara en este dispositivo');
    } else if (error.name === 'NotReadableError') {
      console.warn('❌ Cámara en uso');
      alert('La cámara está siendo usada por otra aplicación');
    } else {
      console.warn('❌ Error desconocido:', error);
      alert('Error accediendo a la cámara: ' + error.message);
    }
  }
}
```
- **Resultado esperado**: Sistema que identifica cada tipo de error y responde con mensajes útiles

---

## Código completo de la fase
```js
// ===== VARIABLES GLOBALES (desde Fase 1) =====
const videoPlayer = document.querySelector('#video-player');
const canvas = document.querySelector('#canvas');
const webcamVideo = document.querySelector('#webcam');
const startStopButton = document.querySelector('#start-stop');
const attentionStatusElement = document.querySelector('#attention-status');

const CHECK_INTERVAL_RANGE = 2000;

let isDetecting = false;
let model = null;
let checkInterval;

// ===== FUNCIÓN DE WEBCAM =====
async function initCamera() {
  const constraints = {
    video: {
      width: 320,
      height: 240,
      facingMode: 'user',
    },
    audio: false,
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  webcamVideo.srcObject = stream;

  webcamVideo.onloadedmetadata = (metadata) => {
    canvas.width = webcamVideo.videoWidth;
    canvas.height = webcamVideo.videoHeight;
    console.log(`📐 Canvas configurado: ${canvas.width}x${canvas.height}`);
  };

  return true;
}

// ===== FUNCIÓN PRINCIPAL CON WEBCAM =====
async function init() {
  try {
    if (isDetecting) {
      console.log('Deteniendo sistema...');
      isDetecting = false;
    } else {
      console.log('Iniciando sistema...');
      await initCamera();
      console.log('✅ Webcam iniciada correctamente');
      isDetecting = true;
    }

    startStopButton.querySelector('span').textContent = isDetecting
      ? 'Parar'
      : 'Iniciar';
  } catch (error) {
    isDetecting = false;
    
    // Clasificar errores con if/else
    if (error.name === 'NotAllowedError') {
      console.warn('❌ Permiso denegado para la cámara');
      alert('Se necesita permiso para acceder a la cámara');
    } else if (error.name === 'NotFoundError') {
      console.warn('❌ No se encontró cámara');
      alert('No se encontró ninguna cámara en este dispositivo');
    } else if (error.name === 'NotReadableError') {
      console.warn('❌ Cámara en uso');
      alert('La cámara está siendo usada por otra aplicación');
    } else {
      console.warn('❌ Error desconocido:', error);
      alert('Error accediendo a la cámara: ' + error.message);
    }
  }
}

// ===== INICIALIZACIÓN =====
startStopButton.addEventListener('click', init);

console.log('🎬 Sistema con webcam listo');
```

## Ejercicios Interactivos (5 min)

### Ejercicio 1: Async/await y APIs
```js
async function obtenerDatos() {
  console.log('Iniciando...');
  
  const response = await fetch('https://api.github.com/users/octocat');
  const data = await response.json();
  
  console.log('Terminado');
  return data.name;
}

console.log('Antes de llamar función');
obtenerDatos().then(nombre => console.log('Nombre:', nombre));
console.log('Después de llamar función');
```
**Pregunta:** ¿En qué orden aparecerán los mensajes?
A) "Antes", "Iniciando", "Terminado", "Después", "Nombre: The Octocat"  
B) "Antes", "Después", "Iniciando", "Terminado", "Nombre: The Octocat"  
C) "Iniciando", "Antes", "Terminado", "Después", "Nombre: The Octocat"

---

### Ejercicio 2: Clasificación de errores con if/else
```js
async function manejarError() {
  try {
    // Simular error de cámara
    const error = new Error('Device not found');
    error.name = 'NotFoundError';
    throw error;
  } catch (e) {
    console.log('Error capturado:', e.name);
    
    if (e.name === 'NotAllowedError') {
      console.log('Acción: Pedir permiso de nuevo');
      return 'retry';
    } else if (e.name === 'NotFoundError') {
      console.log('Acción: Mostrar mensaje de no hay cámara');
      return 'no_camera';
    } else {
      console.log('Acción: Error genérico');
      return 'generic_error';
    }
  }
}

manejarError().then(resultado => console.log('Resultado:', resultado));
```
**Pregunta:** ¿Qué tres líneas aparecerán?
A) `"Error capturado: NotFoundError"`, `"Acción: Mostrar mensaje de no hay cámara"`, `"Resultado: no_camera"`  
B) `"Error capturado: NotAllowedError"`, `"Acción: Pedir permiso de nuevo"`, `"Resultado: retry"`  
C) Solo `"Resultado: generic_error"`

---

### Ejercicio 3: Integración completa con webcam
```js
async function iniciarWebcam() {
  try {
    console.log('Solicitando webcam...');
    
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    
    console.log('Webcam obtenida');
    return 'success';
  } catch (error) {
    console.log('Error:', error.name);
    return 'error';
  }
}

iniciarWebcam().then(resultado => console.log('Resultado:', resultado));
```
**Pregunta:** Si el usuario CONCEDE permiso, ¿qué líneas veremos?
A) `"Solicitando webcam..."`, `"Webcam obtenida"`, `"Resultado: success"`  
B) `"Solicitando webcam..."`, `"Error: NotAllowedError"`, `"Resultado: error"`  
C) Solo `"Resultado: success"`

---

## Troubleshooting rápido
- **"NotAllowedError"** → Usuario denegó permiso. Recargar página y conceder permiso
- **"NotFoundError"** → No hay cámara conectada al dispositivo  
- **"NotReadableError"** → Cámara siendo usada por otra app (Zoom, Teams, etc.)
- **Webcam no se ve** → Verificar que el elemento `<video id="webcam">` existe en el HTML
- **Canvas no se configura** → El evento `onloadedmetadata` puede tardar, verificar en consola

## Checkpoint: ¿Qué deberíamos tener funcionando?
- [ ] El botón sigue alternando entre "Iniciar" y "Parar"
- [ ] Al hacer click en "Iniciar", el navegador pide permiso para la cámara
- [ ] Se ve el video de la webcam en tiempo real
- [ ] El canvas se configura automáticamente con las dimensiones correctas
- [ ] Si denegamos el permiso, aparece un mensaje específico del error
- [ ] El sistema maneja errores sin romperse
- [ ] Resolvimos correctamente los 3 ejercicios interactivos
- [ ] Todas las funcionalidades de la Fase 1 siguen funcionando