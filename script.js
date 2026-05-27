// Mapa de configurações de fontes
const fontConfigs = {
  'preview1': { family: 'Cryptext1', size: 65, countId: 'count1' },
  'preview2': { family: 'Cryptext2', size: 80, countId: 'count2' },
  'preview3': { family: 'Cryptext2.5', size: 70, countId: 'count3' }
};

// Mapa de pesos de caracteres por fonte (baseado na análise do usuário)
const characterWeights = {
  'preview1': {
    'M': 2, 'm': 2,
    'R': 2, 'r': 2,
    'W': 2, 'w': 2
  },
  'preview2': {
    'K': 2, 'k': 2,
    'M': 2, 'm': 2,
    'P': 2, 'p': 2,
    'R': 2, 'r': 2,
    'W': 2, 'w': 2,
    'D': 2, 'd': 2
  },
  'preview3': {
    'M': 2, 'm': 2,
    'R': 2, 'r': 2,
    'W': 2, 'w': 2,
    'K': 2, 'k': 2,
    'P': 2, 'p': 2
  }
};

// Função para contar letras visuais com base nos pesos definidos
function countLetters(text, previewId) {
  const weights = characterWeights[previewId] || {};
  let count = 0;
  
  for (let char of text) {
    // Se o caractere está no mapa de pesos, usa o peso; caso contrário, assume 1
    count += weights[char] || 1;
  }
  
  return count;
}

// Função para atualizar contadores de letras
function updateLetterCounts() {
  const text = document.getElementById('textInput').value || '';
  
  Object.entries(fontConfigs).forEach(([previewId, config]) => {
    const countElement = document.getElementById(config.countId);
    const letterCount = countLetters(text, previewId);
    
    // Mostrar aviso se tiver mais de 9 letras
    const warning = letterCount > 9 ? ' ⚠️' : '';
    countElement.textContent = `${letterCount}${warning}`;
  });
}

function updatePreviews() {
  const text = document.getElementById('textInput').value || '';
  document.getElementById('preview1').innerText = text;
  document.getElementById('preview2').innerText = text;
  document.getElementById('preview3').innerText = text;
  
  // Atualizar contadores de letras
  updateLetterCounts();
}

function setCaseMode(mode) {
  const input = document.getElementById('textInput');
  let text = input.value;

  if (!text) return;

  if (mode === 'upper') {
    text = text.toUpperCase();
  } else if (mode === 'lower') {
    text = text.toLowerCase();
  } else if (mode === 'capital') {
    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  input.value = text;
  updatePreviews();
}

// Geração de imagens
function generateImage(elementId, fontName, options = {}) {
  const element = document.getElementById(elementId);
  
  if (!element.innerText.trim()) {
    alert("Digite algum texto para salvar a imagem.");
    return;
  }

  const defaults = {
    resolutionMultiplier: 3,
    transparent: false,
    padding: 15
  };

  const config = { ...defaults, ...options };
  
  try {
    const text = element.innerText;
    const fontConfig = fontConfigs[elementId];

    if (!fontConfig) {
      throw new Error('Configuração de fonte não encontrada');
    }

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const fontSize = fontConfig.size * 12 * config.resolutionMultiplier;
    const fontFamily = fontConfig.family;
    tempCtx.font = `${fontSize}px "${fontFamily}", sans-serif`;

    const lines = text.split('\n');
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = tempCtx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });

    const lineHeight = fontSize * 1.2;
    const totalHeight = lineHeight * Math.max(lines.length, 1);
    const paddingPixels = config.padding * config.resolutionMultiplier;

    const canvasWidth = Math.ceil(maxWidth + paddingPixels * 2);
    const canvasHeight = Math.ceil(totalHeight + paddingPixels * 2);

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');

    if (config.transparent) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const totalTextHeight = (lines.length - 1) * lineHeight + fontSize;
    const startY = (canvasHeight - totalTextHeight) / 2;

    let y = startY;
    lines.forEach(line => {
      ctx.fillText(line, canvasWidth / 2, y);
      y += lineHeight;
    });

    canvas.toBlob((blob) => {
      if (blob && blob.size > 0) {
        downloadImage(blob, fontName, options);
      } else {
        alert('Erro ao gerar a imagem. Tente novamente.');
      }
    }, 'image/png', 1.0);
  } catch (err) {
    console.error('Erro ao criar imagem:', err);
    alert('Erro ao salvar a imagem: ' + err.message);
  }
}

function saveImage(elementId, fontName) {
  generateImage(elementId, fontName, { resolutionMultiplier: 3, transparent: false });
}

function saveImageTransparent(elementId, fontName) {
  generateImage(elementId, fontName, { resolutionMultiplier: 3, transparent: true });
}

function downloadImage(blob, fontName, options = {}) {
  try {
    let fileName = fontName;
    if (options.transparent) fileName += '_Transparent';
    fileName += `_${Date.now()}.png`;
    downloadAsFile(blob, fileName);
  } catch (err) {
    console.error('Erro ao fazer download:', err);
    downloadAsFile(blob, `${fontName}_${Date.now()}.png`);
  }
}

function downloadAsFile(blob, fileName) {
  try {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => { URL.revokeObjectURL(url); }, 100);
  } catch (err) {
    console.error('Erro ao fazer download:', err);
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  const previews = document.querySelectorAll('.preview-text');
  previews.forEach(preview => {
    preview.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('rotated');
    });
    preview.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  });
  
  // Inicializar contadores
  updateLetterCounts();
});
