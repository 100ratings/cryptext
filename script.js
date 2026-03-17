function updatePreviews() {
  const text = document.getElementById('textInput').value || '';
  document.getElementById('preview1').innerText = text;
  document.getElementById('preview2').innerText = text;
  document.getElementById('preview3').innerText = text;
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
    // Apenas a primeira letra da frase em maiúscula
    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  input.value = text;
  updatePreviews();
}

// Mapa de configurações de fontes
const fontConfigs = {
  'preview1': { family: 'Cryptext1', size: 65 },
  'preview2': { family: 'Cryptext2', size: 80 },
  'preview3': { family: 'Cryptext2.5', size: 70 }
};

// Função genérica para gerar imagens com diferentes configurações
function generateImage(elementId, fontName, options = {}) {
  const element = document.getElementById(elementId);
  
  if (!element.innerText.trim()) {
    alert("Digite algum texto para salvar a imagem.");
    return;
  }

  const defaults = {
    resolutionMultiplier: 3,
    transparent: false,
    padding: 15 // Padding reduzido em pixels
  };

  const config = { ...defaults, ...options };
  
  try {
    const text = element.innerText;
    const fontConfig = fontConfigs[elementId];

    if (!fontConfig) {
      throw new Error('Configuração de fonte não encontrada');
    }

    // Criar canvas temporário para medir
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const fontSize = fontConfig.size * 12 * config.resolutionMultiplier;
    const fontFamily = fontConfig.family;
    tempCtx.font = `${fontSize}px "${fontFamily}", sans-serif`;

    // Medir linhas e obter dimensões precisas
    const lines = text.split('\n');
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = tempCtx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });

    // Calcular altura com baseline preciso
    const lineHeight = fontSize * 1.2;
    const totalHeight = lineHeight * Math.max(lines.length, 1);
    
    // Padding em pixels (já escalado)
    const paddingPixels = config.padding * config.resolutionMultiplier;

    // Dimensões do canvas com padding mínimo
    const canvasWidth = Math.ceil(maxWidth + paddingPixels * 2);
    const canvasHeight = Math.ceil(totalHeight + paddingPixels * 2);

    // Criar canvas final
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');

    // Fundo (branco ou transparente)
    if (config.transparent) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Desenhar texto centralizado
    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calcular Y inicial para centralizar verticalmente
    const totalTextHeight = (lines.length - 1) * lineHeight + fontSize;
    const startY = (canvasHeight - totalTextHeight) / 2;

    let y = startY;
    lines.forEach(line => {
      ctx.fillText(line, canvasWidth / 2, y);
      y += lineHeight;
    });

    // Converter para blob com máxima qualidade
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

function saveImageUltraHD(elementId, fontName) {
  generateImage(elementId, fontName, { resolutionMultiplier: 4, transparent: false });
}

function saveImageTransparent(elementId, fontName) {
  generateImage(elementId, fontName, { resolutionMultiplier: 3, transparent: true });
}

function downloadImage(blob, fontName, options = {}) {
  try {
    let fileName = fontName;
    
    if (options.resolutionMultiplier === 4) {
      fileName += '_UltraHD';
    } else if (options.transparent) {
      fileName += '_Transparent';
    }
    
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

    // Adicionar ao DOM
    document.body.appendChild(link);

    // Clicar para baixar
    link.click();

    // Remover do DOM
    document.body.removeChild(link);

    // Liberar URL
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

    console.log('Arquivo salvo:', fileName);
  } catch (err) {
    console.error('Erro ao fazer download:', err);
    alert('Erro ao salvar a imagem. Tente novamente.');
  }
}

// Restaura a funcionalidade de girar ao clicar UMA VEZ
document.addEventListener('DOMContentLoaded', () => {
  const previews = document.querySelectorAll('.preview-text');
  previews.forEach(preview => {
    preview.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('rotated');
    });
    // Previne o menu de contexto
    preview.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  });
});
