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
    const faces = await detectFaces(); // Array de caras detectadas (Concepto 3)

    visualizeFaces(faces); // Dibujar cada cara del array (Concepto 5)

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
