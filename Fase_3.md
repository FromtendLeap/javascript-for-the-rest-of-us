# FASE 3: Sistema Completo de Detección Facial

## Objetivo de la fase
Integrar TensorFlow.js para detección facial y completar el sistema automático que pausa/reproduce el video según la atención del usuario.

## Timing estimado: 55 minutos

---

### Concepto 1: Carga de modelos de IA
- **Explicación**: TensorFlow.js nos permite cargar modelos pre-entrenados como BlazeFace. Es como descargar un "cerebro especializado" que ya sabe detectar caras.
- **Demo RunJS**:
```js
// Simular la carga de un modelo de IA
async function simularCargaModelo() {
  console.log('🧠 Iniciando carga del modelo...');
  
  // Simular tiempo de descarga
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('✅ Modelo cargado y listo para usar');
  
  return {
    name: 'BlazeFace',
    loaded: true,
    detect: function() { return 'detectando...'; }
  };
}

const modelo = await simularCargaModelo();
console.log('Modelo disponible:', modelo.name);
```
- **Aplicación a la fase**: Creamos la función `loadModel()` del código original
```js
async function loadModel() {
  const model = await blazeface.load();
  return model;
}
```
- **Resultado esperado**: Tenemos la función que carga el modelo BlazeFace

---

### Concepto 2: setInterval para detección continua
- **Explicación**: Para saber si el usuario está atento, necesitamos verificar continuamente. `setInterval` ejecuta una función cada X milisegundos automáticamente.
- **Demo RunJS**:
```js
let verificaciones = 0;

function verificarEstado() {
  verificaciones++;
  const timestamp = new Date().toLocaleTimeString();
  console.log(`Verificación #${verificaciones} a las ${timestamp}`);
  
  if (verificaciones >= 5) {
    clearInterval(intervalId);
    console.log('🛑 Detección detenida');
  }
}

console.log('🎬 Iniciando detección cada 1.5 segundos...');
const intervalId = setInterval(verificarEstado, 1500);
```
- **Aplicación a la fase**: Creamos las funciones `startDetecting()` y `stopDetecting()`
```js
async function startDetecting() {
  await initCamera();
  model = await loadModel();
  
  // Sistema de detección básico (iremos completando paso a paso)
  checkInterval = setInterval(async () => {
    console.log('🔍 Verificando atención cada 2 segundos...');
    // Aquí añadiremos detectFaces(), visualizeFaces() y handleAttentionState()
    // en los conceptos siguientes
  }, CHECK_INTERVAL_RANGE);
}

function stopDetecting() {
  clearInterval(checkInterval);
  console.log('🛑 Detección detenida');
}
```
- **Resultado esperado**: Tenemos las funciones que controlan la detección automática

---

### Concepto 3: Detección facial + Arrays
- **Explicación**: Usamos el modelo para analizar la webcam, pero primero necesitamos entender **arrays** porque `detectFaces()` devuelve una "lista de caras detectadas". Un array es como una "lista de la compra" - puede tener varios elementos en orden.
- **Demo RunJS**:
```js
// Primero entendemos arrays
const frutasVacio = [];
const frutas = ['manzana', 'banana', 'naranja'];

console.log('Frutas:', frutas);
console.log('¿Cuántas frutas?', frutas.length);

// Comprobar si hay elementos
if (frutas.length > 0) {
  console.log('Tenemos frutas disponibles');
} else {
  console.log('No hay frutas');
}

// Recorrer todos los elementos
frutas.forEach((fruta, index) => {
  console.log(`Fruta ${index + 1}: ${fruta}`);
});

// Ahora simulamos detección facial
const carasSimuladas = [
  { topLeft: [50, 60], bottomRight: [150, 180] },
  { topLeft: [200, 80], bottomRight: [280, 160] }
];

console.log('Caras detectadas:', carasSimuladas.length);
console.log('¿Hay caras?', carasSimuladas.length > 0);
```
- **Aplicación a la fase**: Creamos `detectFaces()` que devuelve un array + lo integramos
```js
async function detectFaces() {
  if (!model) throw TypeError('Model not loaded');

  const predictions = await model.estimateFaces(webcamVideo, false);

  return predictions; // ¡Devuelve un array de caras detectadas!
}

// Actualizamos startDetecting() para usar detectFaces()
async function startDetecting() {
  await initCamera();
  model = await loadModel();
  
  checkInterval = setInterval(async () => {
    console.log('🔍 Detectando caras...');
    const faces = await detectFaces(); // ¡Array de caras!
    console.log('Caras encontradas:', faces.length); // Usar .length del array
    console.log('¿Hay caras?', faces.length > 0); // Comprobar si array tiene elementos
    // Seguiremos añadiendo más funciones paso a paso
  }, CHECK_INTERVAL_RANGE);
}
```
- **Resultado esperado**: El sistema detecta caras (array) y muestra información sobre ellas

---

### Concepto 4: Control automático del video según atención
- **Explicación**: Usamos el modelo para analizar el frame actual de la webcam. Devuelve un array con información sobre las caras detectadas.
- **Demo RunJS**:
```js
// Simular el proceso de detección facial
async function simularDeteccionFacial() {
  console.log('🔍 Analizando frame de video...');
  
  // Simular tiempo de procesamiento
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simular resultados variables
  const scenarios = [
    [], // Sin caras
    [{ // Una cara detectada
      topLeft: [50, 60], 
      bottomRight: [150, 180]
    }]
  ];
  
  const result = scenarios[Math.floor(Math.random() * scenarios.length)];
  console.log(`📊 Resultado: ${result.length} cara(s) detectada(s)`);
  
  return result;
}

const caras = await simularDeteccionFacial();
console.log('Caras:', caras);
```
- **Aplicación a la fase**: Creamos `detectFaces()` y la añadimos al sistema
```js
async function detectFaces() {
  if (!model) throw TypeError('Model not loaded');

  const predictions = await model.estimateFaces(webcamVideo, false);

  return predictions; // ¡Devuelve un array de caras detectadas!
}

// Ahora actualizamos startDetecting() para usar detectFaces()
async function startDetecting() {
  await initCamera();
  model = await loadModel();
  
  checkInterval = setInterval(async () => {
    console.log('🔍 Detectando caras...');
    const faces = await detectFaces(); // ¡Ahora sí existe!
    console.log('Caras encontradas:', faces.length);
    // Seguiremos añadiendo más funciones paso a paso
  }, CHECK_INTERVAL_RANGE);
}
```
- **Resultado esperado**: El sistema detecta caras y muestra cuántas encuentra

---

### Concepto 5: Control automático del video según atención
- **Explicación**: Según si detectamos caras o no, decidimos automáticamente si pausar o reproducir el video. También actualizamos la interfaz.
- **Demo RunJS**:
```js
// Simular el control automático del video
const mockVideo = {
  paused: false,
  play: () => console.log('▶️ Video reproducido automáticamente'),
  pause: () => console.log('⏸️ Video pausado automáticamente')
};

function simularControlAutomatico(hayCaras) {
  console.log(`🎯 Procesando: ${hayCaras ? 'CARA DETECTADA' : 'SIN CARA'}`);
  
  if (hayCaras) {
    console.log('🟢 Usuario atento - reproducir video');
    mockVideo.play();
  } else {
    console.log('🔴 Usuario no atento - pausar video');
    mockVideo.pause();
  }
}

// Simular diferentes escenarios
simularControlAutomatico(true);
setTimeout(() => simularControlAutomatico(false), 2000);
```
- **Aplicación a la fase**: Creamos `handleAttentionState()` y la añadimos al sistema
```js
function handleAttentionState(areFacesDetected) {
  if (areFacesDetected) {
    attentionStatusElement.textContent = '✅ Atento';
    attentionStatusElement.className = 'paying-attention';
    document.body.classList.remove('not-paying-attention');

    return videoPlayer.play();
  }

  attentionStatusElement.textContent = '❌ No atento';
  attentionStatusElement.className = 'not-paying-attention';
  document.body.classList.add('not-paying-attention');

  videoPlayer.pause();
}

// Actualizamos startDetecting() para usar handleAttentionState()
async function startDetecting() {
  await initCamera();
  model = await loadModel();
  
  checkInterval = setInterval(async () => {
    const faces = await detectFaces();
    console.log('Caras encontradas:', faces.length);
    handleAttentionState(faces.length > 0); // ¡Control automático del video!
    // Aún falta añadir la visualización
  }, CHECK_INTERVAL_RANGE);
}
```
- **Resultado esperado**: El video se controla automáticamente según las caras detectadas

---

### Concepto 5: Visualización con Canvas
- **Explicación**: Para entender mejor cómo funciona la detección, dibujamos rectángulos alrededor de las caras detectadas usando Canvas.
- **Demo RunJS**:
```js
// Simular el dibujo de detecciones
function simularVisualizacion() {
  const carasDetectadas = [
    { topLeft: [50, 60], bottomRight: [150, 180] }
  ];
  
  console.log('🎨 Dibujando visualización:');
  
  if (carasDetectadas.length === 0) {
    console.log('🔴 Overlay rojo: sin caras detectadas');
    return;
  }
  
  carasDetectadas.forEach((cara, index) => {
    const ancho = cara.bottomRight[0] - cara.topLeft[0];
    const alto = cara.bottomRight[1] - cara.topLeft[1];
    
    console.log(`🟢 Rectángulo ${index + 1}: ${ancho}x${alto}`);
  });
}

simularVisualizacion();
```
- **Aplicación a la fase**: Creamos `visualizeFaces()` y completamos el sistema de detección
```js
function visualizeFaces(faces) {
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.drawImage(webcamVideo, 0, 0);

  if (faces.length === 0) { // Si el array está vacío
    context.fillStyle = 'rgba(255,0,0,0.3)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // Recorrer cada elemento del array (como hicimos en el demo)
  faces.forEach((face) => {
    context.strokeStyle = 'green';
    context.lineWidth = 2;
    context.strokeRect(
      face.topLeft[0],
      face.topLeft[1],
      face.bottomRight[0] - face.topLeft[0],
      face.bottomRight[1] - face.topLeft[1]
    );
  });
}

// ¡Completamos startDetecting() con todas las funciones!
async function startDetecting() {
  await initCamera();
  model = await loadModel();
  
  checkInterval = setInterval(async () => {
    const faces = await detectFaces();         // Detectar caras
    visualizeFaces(faces);                     // Dibujar detección ¡NUEVO!
    handleAttentionState(faces.length > 0);    // Controlar video
  }, CHECK_INTERVAL_RANGE);
}
```
- **Resultado esperado**: Vemos rectángulos verdes alrededor de las caras + sistema completo

---

### Concepto 6: Integración final del sistema
- **Explicación**: Actualizamos la función `init()` para usar todas las funciones que hemos creado y completar el sistema.
- **Demo RunJS**:
```js
// Simular la integración final
let systemRunning = false;

async function finalSystemToggle() {
  try {
    if (systemRunning) {
      console.log('🛑 Deteniendo sistema completo...');
      // stopDetecting();
      systemRunning = false;
    } else {
      console.log('🚀 Iniciando sistema completo...');
      // await startDetecting();
      systemRunning = true;
    }
    
    console.log(`Estado final: ${systemRunning ? 'FUNCIONANDO' : 'DETENIDO'}`);
  } catch (error) {
    console.log('❌ Error:', error);
    systemRunning = false;
  }
}

await finalSystemToggle();
```
- **Aplicación a la fase**: Actualizamos `init()` para usar el sistema completo de detección
```js
async function init() {
  try {
    if (isDetecting) {
      stopDetecting();      // Usar función que ya creamos
      isDetecting = false;
    } else {
      await startDetecting();  // Usar función completa que ya creamos
      isDetecting = true;
    }

    startStopButton.querySelector('span').textContent = isDetecting
      ? 'Parar'
      : 'Iniciar';
  } catch (error) {
    isDetecting = false;
    console.warn('Hey we fucked up ', error);
  }
}

// El event listener sigue igual
startStopButton.addEventListener('click', init);
```
- **Resultado esperado**: El sistema completo funciona con un solo click del botón

---

## Código completo de la fase (SISTEMA FINAL)
```js
// ===== VARIABLES GLOBALES =====
const videoPlayer = document.querySelector('#video-player');
const canvas = document.querySelector('#canvas');
const webcamVideo = document.querySelector('#webcam');
const startStopButton = document.querySelector('#start-stop');
const attentionStatusElement = document.querySelector('#attention-status');

const CHECK_INTERVAL_RANGE = 2000;

let isDetecting = false;
let model = null;
let checkInterval;

// ===== FUNCIONES DEL SISTEMA =====
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
  };

  return true;
}

async function loadModel() {
  const model = await blazeface.load();
  return model;
}

async function detectFaces() {
  if (!model) throw TypeError('Model not loaded');

  const predictions = await model.estimateFaces(webcamVideo, false);

  return predictions;
}

function handleAttentionState(areFacesDetected) {
  if (areFacesDetected) {
    attentionStatusElement.textContent = '✅ Atento';
    attentionStatusElement.className = 'paying-attention';
    document.body.classList.remove('not-paying-attention');

    return videoPlayer.play();
  }

  attentionStatusElement.textContent = '❌ No atento';
  attentionStatusElement.className = 'not-paying-attention';
  document.body.classList.add('not-paying-attention');

  videoPlayer.pause();
}

function visualizeFaces(faces) {
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.drawImage(webcamVideo, 0, 0);

  if (faces.length === 0) {
    context.fillStyle = 'rgba(255,0,0,0.3)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  faces.forEach((face) => {
    context.strokeStyle = 'green';
    context.lineWidth = 2;
    context.strokeRect(
      face.topLeft[0],
      face.topLeft[1],
      face.bottomRight[0] - face.topLeft[0],
      face.bottomRight[1] - face.topLeft[1]
    );
  });
}

async function startDetecting() {
  await initCamera();

  model = await loadModel();

  checkInterval = setInterval(async () => {
    const faces = await detectFaces();      // Array de caras detectadas (Concepto 3)

    visualizeFaces(faces);                  // Dibujar cada cara del array (Concepto 5)

    handleAttentionState(faces.length > 0); // ¿El array tiene elementos? (Concepto 4)
  }, CHECK_INTERVAL_RANGE);
}

function stopDetecting() {
  clearInterval(checkInterval);
}

// ===== FUNCIÓN PRINCIPAL FINAL =====
async function init() {
  try {
    if (isDetecting) {
      stopDetecting();

      isDetecting = false;
    } else {
      await startDetecting();

      isDetecting = true;
    }

    startStopButton.querySelector('span').textContent = isDetecting
      ? 'Parar'
      : 'Iniciar';
  } catch (error) {
    isDetecting = false;
    console.warn('Hey we fucked up ', error);
  }
}

// ===== INICIALIZACIÓN =====
startStopButton.addEventListener('click', init);
```

## Ejercicios Interactivos (5 min)

### Ejercicio 1: Arrays y detección facial
```js
// Simular resultado de detectFaces()
const resultadoDeteccion = [
  { topLeft: [10, 20], bottomRight: [100, 120] },
  { topLeft: [200, 50], bottomRight: [280, 130] }
];

console.log('Número de caras:', resultadoDeteccion.length);
console.log('¿Hay caras?', resultadoDeteccion.length > 0);
console.log('Primera cara:', resultadoDeteccion[0].topLeft);
```
**Pregunta:** ¿Qué tres valores aparecerán?
A) `2`, `true`, `[10, 20]`  B) `1`, `false`, `undefined`  C) `2`, `true`, `10`

---

### Ejercicio 2: setInterval y detección continua
```js
let contador = 0;

const intervalo = setInterval(() => {
  contador++;
  console.log('Verificación:', contador);
  
  if (contador >= 3) {
    clearInterval(intervalo);
    console.log('Detección detenida');
  }
}, 1000);
```
**Pregunta:** ¿Cuántas líneas veremos y en cuánto tiempo?
A) 3 líneas en 3 segundos  B) 4 líneas en 3 segundos  C) 4 líneas en 4 segundos

---

### Ejercicio 3: Sistema completo
```js
async function sistemaCompleto() {
  try {
    console.log('Iniciando...');
    
    const caras = []; // Simular sin caras detectadas
    
    if (caras.length > 0) {
      console.log('✅ Usuario atento');
      return 'video_play';
    } else {
      console.log('❌ Usuario no atento');  
      return 'video_pause';
    }
  } catch (error) {
    console.log('Error:', error);
    return 'error';
  }
}

sistemaCompleto().then(resultado => console.log('Acción:', resultado));
```
**Pregunta:** ¿Qué tres líneas aparecerán?
A) `"Iniciando..."`, `"✅ Usuario atento"`, `"Acción: video_play"`  B) `"Iniciando..."`, `"❌ Usuario no atento"`, `"Acción: video_pause"`  C) Solo `"Error:"` y `"Acción: error"`

---

## Troubleshooting rápido
- **"Model not loaded"** → TensorFlow.js no está incluido o hay problemas de conexión
- **Detección muy lenta** → Es normal, el modelo tarda en procesar cada frame
- **Muchos falsos negativos** → Mejorar iluminación, asegurar que la cara sea visible
- **Canvas no muestra video** → Verificar que initCamera() configuró las dimensiones
- **Error "Hey we fucked up"** → Revisar consola para error específico

## Checkpoint: ¿Qué deberíamos tener funcionando?
- [ ] Al hacer click en "Iniciar", se carga el modelo de IA
- [ ] La detección facial funciona automáticamente cada 2 segundos
- [ ] El video se pausa cuando no detecta caras
- [ ] El video se reproduce cuando detecta caras  
- [ ] El estado "✅ Atento" / "❌ No atento" se actualiza en tiempo real
- [ ] Se ven rectángulos verdes alrededor de las caras detectadas
- [ ] El sistema completo funciona de principio a fin sin errores
- [ ] Resolvimos correctamente los 3 ejercicios interactivos
- [ ] **TODO el código original está implementado y funcional**