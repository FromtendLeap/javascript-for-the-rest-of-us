# FASE 2: Añadir Webcam al Sistema

## Objetivo de la fase

Integrar acceso a la webcam en nuestro sistema, convirtiendo `init()` en función asíncrona y añadiendo `initCamera()`.

## Timing estimado: 40 minutos

---

### Concepto 1: APIs del navegador + Promesas (necesidad inmediata)

- **Explicación**: Para acceder a la webcam necesitamos una **API** (menú de opciones del navegador). `navigator.mediaDevices.getUserMedia()` nos da acceso, pero como tarda tiempo (pedir permiso al usuario), devuelve una **promesa** - un "vale" que nos dice "el resultado llegará más tarde".
- **Demo RunJS**:

```js
// Verificar si tenemos la API
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('✅ Podemos acceder a la webcam');

  // Crear una promesa simple para entender el concepto
  const promesaSimple = new Promise((resolve) => {
    setTimeout(() => resolve('¡Listo!'), 2000);
  });

  console.log('Promesa creada:', promesaSimple);

  // Usar la promesa con .then()
  promesaSimple.then((resultado) => {
    console.log('Resultado:', resultado);
  });

  console.log('Esta línea aparece antes del resultado');
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
    console.log(`📐 Canvas configurado: ${canvas.width}x${canvas.height}`);
  };

  return true;
}
```

- **Resultado esperado**: Tenemos la función que accede a la webcam usando APIs y promesas

---

### Concepto 2: Async/await + Try/catch (solución inmediata)

- **Explicación**: Las promesas con `.then()` pueden parecer más complicadas. **Async/await** nos permite escribir código asíncrono como si fuera normal (síncrono). **Try/catch** maneja errores - "intenta esto, si falla haz esto otro".
- **Demo RunJS**:

```js
// Comparar .then() vs async/await
function conThen() {
  fetch('https://api.github.com/users/octocat')
    .then((response) => response.json())
    .then((data) => console.log('Con .then():', data.name))
    .catch((error) => console.log('Error:', error));
}

async function conAsyncAwait() {
  try {
    console.log('🔄 Empezando...');
    const response = await fetch('https://api.github.com/users/octocat');
    const data = await response.json();
    console.log('Con async/await:', data.name);
  } catch (error) {
    console.log('❌ Error capturado:', error.message);
  }
}

// Probar ambos
conThen();
conAsyncAwait();
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

### Concepto 3: Sistema completo con webcam funcionando

- **Explicación**: Ahora juntamos todo - variables globales, funciones, objetos, async/await, APIs y manejo de errores. El sistema detecta errores comunes y nos informa qué pasó.
- **Demo RunJS**:

```js
// Simular diferentes tipos de errores de webcam
async function simularErrores() {
  const errores = [
    { name: 'NotAllowedError', message: 'Permiso denegado' },
    { name: 'NotFoundError', message: 'No hay cámara' },
    { name: 'NotReadableError', message: 'Cámara en uso por otra app' },
  ];

  for (const error of errores) {
    try {
      throw error;
    } catch (e) {
      console.log(`❌ ${e.name}: ${e.message}`);

      switch (e.name) {
        case 'NotAllowedError':
          console.log('💡 Solución: Recargar y dar permiso');
          break;
        case 'NotFoundError':
          console.log('💡 Solución: Conectar una cámara');
          break;
        case 'NotReadableError':
          console.log('💡 Solución: Cerrar otras apps que usen la cámara');
          break;
      }
    }
  }
}

simularErrores();
```

- **Aplicación a la fase**: Sistema completo con detección de errores específicos

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

    // Mensajes específicos según el tipo de error
    switch (error.name) {
      case 'NotAllowedError':
        console.warn('❌ Permiso denegado para la cámara');
        alert('Se necesita permiso para acceder a la cámara');
        break;
      case 'NotFoundError':
        console.warn('❌ No se encontró cámara');
        alert('No se encontró ninguna cámara en este dispositivo');
        break;
      case 'NotReadableError':
        console.warn('❌ Cámara en uso');
        alert('La cámara está siendo usada por otra aplicación');
        break;
      default:
        console.warn('❌ Error desconocido:', error);
        alert('Error accediendo a la cámara: ' + error.message);
    }
  }
}
```

- **Resultado esperado**: Sistema robusto que maneja todos los errores posibles

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

    switch (error.name) {
      case 'NotAllowedError':
        console.warn('❌ Permiso denegado para la cámara');
        alert('Se necesita permiso para acceder a la cámara');
        break;
      case 'NotFoundError':
        console.warn('❌ No se encontró cámara');
        alert('No se encontró ninguna cámara en este dispositivo');
        break;
      case 'NotReadableError':
        console.warn('❌ Cámara en uso');
        alert('La cámara está siendo usada por otra aplicación');
        break;
      default:
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

### Ejercicio 1: Promesas vs Async/await

```js
// Opción A: Con promesas
function conPromesas() {
  return fetch('https://api.github.com/users/octocat')
    .then((response) => response.json())
    .then((data) => data.name);
}

// Opción B: Con async/await
async function conAsyncAwait() {
  const response = await fetch('https://api.github.com/users/octocat');
  const data = await response.json();
  return data.name;
}

console.log('¿Son equivalentes estas dos funciones?');
```

**Pregunta:** ¿Hacen lo mismo estas dos funciones?
A) Sí, son equivalentes B) No, async/await es más rápido C) No, promesas devuelven más datos

---

### Ejercicio 2: Try/catch y errores

```js
async function probarError() {
  try {
    const resultado = await navigator.mediaDevices.getUserMedia({
      video: false,
    });
    console.log('Éxito');
    return true;
  } catch (error) {
    console.log('Error:', error.name);
    return false;
  }
}

probarError();
```

**Pregunta:** Si no hay cámara disponible, ¿qué se ejecutará?
A) Solo "Éxito" y return true B) Solo el catch con error.name C) Ambos bloques try y catch

---

### Ejercicio 3: APIs del navegador

```js
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('API disponible');
} else {
  console.log('API no disponible');
}

console.log('Tipo de navigator:', typeof navigator);
console.log(
  'Tipo de getUserMedia:',
  typeof navigator.mediaDevices.getUserMedia
);
```

**Pregunta:** En un navegador moderno, ¿qué tres líneas veremos?
A) `"API disponible"`, `"object"`, `"function"` B) `"API no disponible"`, `"undefined"`, `"undefined"` C) `"API disponible"`, `"function"`, `"object"`

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
