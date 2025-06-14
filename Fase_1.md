# FASE 1: Base del Sistema + Control por Botón

## Objetivo de la fase

Crear las variables globales del sistema y la función `init()` que controla el botón de inicio/parada.

## Timing estimado: 30 minutos

---

### Concepto 1: Variables globales + Tipos de datos

- **Explicación**: Antes de programar, necesitamos "agarrar/seleccionar" elementos HTML y guardarlos en algún lugar. Ese lugar se llama "variable", un espacio en memoria dondo almacenar datos. Cada variable guarda un **tipo** de información: texto (strings), números (numbers), verdadero/falso (booleans), objetos, etc.
- **Demo RunJS**:

```js
// Simular selección de elementos
document.body.innerHTML = '<button id="test">Test</button>';
const testButton = document.querySelector('#test'); // object

// Diferentes tipos de datos
const nombre = 'Laura'; // string (texto)
const edad = 25; // number (número)
const estaActivo = true; // boolean (verdadero/falso)
let sinValor; // undefined (sin valor)

console.log(
  'Tipos:',
  typeof testButton,
  typeof nombre,
  typeof edad,
  typeof estaActivo,
  typeof sinValor
);
```

- **Aplicación a la fase**: Declaramos todas las variables del sistema con sus tipos

```js
// Objetos (elementos HTML)
const videoPlayer = document.querySelector('#video-player');
const canvas = document.querySelector('#canvas');
const webcamVideo = document.querySelector('#webcam');
const startStopButton = document.querySelector('#start-stop');
const attentionStatusElement = document.querySelector('#attention-status');

// Number (configuración)
const CHECK_INTERVAL_RANGE = 2000;

// Boolean (estado del sistema)
let isDetecting = false;

// Objects/null (objetos que crearemos después)
let model = null;
let checkInterval;
```

- **Resultado esperado**: Todas las variables están declaradas con tipos correctos

---

### Concepto 2: Funciones + return

- **Explicación**: Las funciones son "recetas" reutilizables que hacen algo específico. Pueden recibir información (parámetros) y **devolver** un resultado usando `return`. Es como una máquina: le das algo, hace un proceso, te devuelve algo.
- **Demo RunJS**:

```js
// Función simple sin return
function saludar() {
  console.log('¡Hola!');
}

// Función con parámetros y return
function sumar(a, b) {
  return a + b; // return devuelve el resultado
}

// Función que return diferentes tipos
function analizarNumero(num) {
  if (num > 0) {
    return 'positivo'; // return string
  } else if (num < 0) {
    return 'negativo'; // return string
  } else {
    return true; // return boolean
  }
}

// Usar las funciones
saludar(); // No devuelve nada
const resultado = sumar(5, 3); // Devuelve 8
const analisis = analizarNumero(-2); // Devuelve 'negativo'

console.log('Suma:', resultado);
console.log('Análisis:', analisis);
```

- **Aplicación a la fase**: Creamos la función principal `init()`

```js
// Función principal que controla el sistema
function init() {
  if (isDetecting) {
    console.log('Deteniendo sistema...');
    isDetecting = false;
  } else {
    console.log('Iniciando sistema...');
    isDetecting = true;
  }

  // Esta función no necesita return porque solo cambia estados
  console.log('Estado actual:', isDetecting);
}
```

- **Resultado esperado**: Tenemos la función que controla el estado del sistema

---

### Concepto 3: Objetos + métodos

- **Explicación**: Los objetos son "cajas" con propiedades (características) y métodos (acciones). Representan entidades a nivel de datos. Los elementos HTML son objetos con propiedades como `.textContent` y métodos como `.play()` o `.addEventListener()`.
- **Demo RunJS**:

```js
// Crear objeto simple
const persona = {
  nombre: 'Ana', // propiedad
  edad: 25, // propiedad
  saludar: function () {
    // método
    return 'Hola, soy ' + this.nombre;
  },
};

// Usar propiedades y métodos
console.log('Nombre:', persona.nombre); // acceder propiedad
console.log('Saludo:', persona.saludar()); // llamar método
```

- **Aplicación a la fase**: Usamos objetos y métodos para actualizar la interfaz

```js
function init() {
  if (isDetecting) {
    console.log('Deteniendo sistema...');
    isDetecting = false;
  } else {
    console.log('Iniciando sistema...');
    isDetecting = true;
  }

  // Usar propiedad y método del objeto startStopButton
  startStopButton.querySelector('span').textContent = isDetecting
    ? 'Parar'
    : 'Iniciar';
}
```

- **Resultado esperado**: La función actualiza la interfaz usando objetos

---

### Concepto 4: Event listeners + Sistema completo

- **Explicación**: Los event listeners permiten que objetos (como botones) ejecuten funciones cuando pasa algo (como un click). Para poder conectar todo necesitamos un elemento, un evento y a acción en diferido (función callback) a ejectutar. Esta se invocará si sucede ese evento sobre ese elemento. Pero no hay garantía.
- **Demo RunJS**:

```js
// Simular sistema completo
document.body.innerHTML = '<button id="toggle">Estado: OFF</button>';
const toggleBtn = document.querySelector('#toggle');

let systemRunning = false;

function toggleSystem() {
  systemRunning = !systemRunning; // Cambiar estado boolean

  // Actualizar interfaz usando objeto + propiedad
  toggleBtn.textContent = systemRunning ? 'Estado: ON' : 'Estado: OFF';

  console.log('Sistema:', systemRunning ? 'FUNCIONANDO' : 'DETENIDO');
}

// Conectar evento con función
toggleBtn.addEventListener('click', toggleSystem);

console.log('Sistema listo - haz click para probar');
```

- **Aplicación a la fase**: Sistema completo funcionando

```js
// Conectar el botón con nuestra función
startStopButton.addEventListener('click', init);

console.log('🎬 Sistema básico listo - haz click para probar');
```

- **Resultado esperado**: Al hacer click, el botón cambia entre "Iniciar" y "Parar"

---

## Código completo de la fase

```js
// ===== VARIABLES GLOBALES + TIPOS =====
const videoPlayer = document.querySelector('#video-player'); // object
const canvas = document.querySelector('#canvas'); // object
const webcamVideo = document.querySelector('#webcam'); // object
const startStopButton = document.querySelector('#start-stop'); // object
const attentionStatusElement = document.querySelector('#attention-status'); // object

const CHECK_INTERVAL_RANGE = 2000; // number

let isDetecting = false; // boolean
let model = null; // object (null)
let checkInterval; // undefined

// ===== FUNCIÓN PRINCIPAL =====
function init() {
  if (isDetecting) {
    console.log('Deteniendo sistema...');
    isDetecting = false;
  } else {
    console.log('Iniciando sistema...');
    isDetecting = true;
  }

  // Usar objeto + método + propiedad
  startStopButton.querySelector('span').textContent = isDetecting
    ? 'Parar'
    : 'Iniciar';
}

// ===== EVENT LISTENER =====
startStopButton.addEventListener('click', init);

console.log('🎬 Sistema básico listo');
```

## Ejercicios Interactivos (5 min)

### Ejercicio 1: Tipos de datos

```js
const mensaje = 'Hola';
const numero = 42;
const activo = true;

console.log(typeof mensaje + ' ' + typeof numero + ' ' + typeof activo);
```

**Pregunta:** ¿Qué aparecerá en consola?
A) `"string number boolean"` B) `"texto numero boolean"` C) `"Hola 42 true"`

---

### Ejercicio 2: Objetos y métodos

```js
const usuario = {
  nombre: 'Carlos',
  saludar: function () {
    return 'Hola ' + this.nombre;
  },
};

console.log(usuario.saludar());
console.log(usuario.nombre);
```

**Pregunta:** ¿Qué dos líneas aparecerán?
A) `"Hola Carlos"` y `"Carlos"` B) `"Carlos"` y `"Hola"` C) `"Hola undefined"` y `"Carlos"`

---

### Ejercicio 3: Estados y funciones

```js
let contador = 0;

function incrementar() {
  contador = contador + 1;
  return contador;
}

incrementar();
incrementar;
console.log(contador);
```

**Pregunta:** ¿Qué tres números aparecerán?
A) `0` B) `2` C) `1`

---

## Troubleshooting rápido

- **querySelector devuelve null** → Verificar que los IDs en HTML coincidan exactamente
- **Botón no responde** → Verificar en DevTools que el event listener se añadió correctamente
- **startStopButton.querySelector('span') error** → Verificar que hay un `<span>` dentro del botón

## Checkpoint: ¿Qué deberíamos tener funcionando?

- [ ] El botón alterna entre "Iniciar" y "Parar"
- [ ] Vemos mensajes en consola cuando hacemos click
- [ ] La variable `isDetecting` cambia entre true/false correctamente
- [ ] Entendemos los tipos de nuestras variables
- [ ] Sabemos que `.addEventListener()` es un método de objeto
- [ ] Resolvimos correctamente los 3 ejercicios
- [ ] No hay errores en la consola del navegador
