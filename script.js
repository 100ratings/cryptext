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

function saveImage(elementId, fontName) {
  console.log('saveImage chamado:', elementId, fontName);
  const element = document.getElementById(elementId);
  
  if (!element.innerText.trim()) {
    alert("Digite algum texto para salvar a imagem.");
    return;
  }

  console.log('Iniciando createImageWithCanvasAPI...');
  // Usar Canvas API diretamente (mais confiável)
  createImageWithCanvasAPI(elementId, fontName);
}

function createImageWithCanvasAPI(elementId, fontName) {
  try {
    const element = document.getElementById(elementId);
    const text = element.innerText;
    const config = fontConfigs[elementId];

    console.log('createImageWithCanvasAPI:', elementId, fontName, 'Texto:', text);

    if (!config) {
      throw new Error('Configuração de fonte não encontrada');
    }

    // Criar canvas temporário para medir
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const fontSize = config.size * 12;
    const fontFamily = config.family;
    tempCtx.font = `${fontSize}px "${fontFamily}", sans-serif`;

    // Medir linhas
    const lines = text.split('\n');
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = tempCtx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });

    const lineHeight = fontSize * 1.2;
    const totalHeight = lineHeight * Math.max(lines.length, 1);
    const padding = 20 * 12;

    const canvasWidth = Math.ceil(Math.max(maxWidth + padding * 2, 100));
    const canvasHeight = Math.ceil(Math.max(totalHeight + padding * 2, 100));

    // Criar canvas final
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');

    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto preto
    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    let y = padding;
    lines.forEach(line => {
      ctx.fillText(line, canvasWidth / 2, y);
      y += lineHeight;
    });

    // Converter para blob
    canvas.toBlob((blob) => {
      if (blob && blob.size > 0) {
        downloadImage(blob, fontName);
      } else {
        alert('Erro ao gerar a imagem. Tente novamente.');
      }
    }, 'image/png', 0.95);
  } catch (err) {
    console.error('Erro ao criar imagem:', err);
    alert('Erro ao salvar a imagem: ' + err.message);
  }
}

function downloadImage(blob, fontName) {
  try {
    const fileName = `${fontName}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    // Tentar compartilhamento nativo (Android/iOS)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Salvar Imagem',
        text: 'Imagem gerada pelo Cryptext'
      }).catch(() => {
        // Se compartilhamento falhar, fazer download
        downloadAsFile(blob, fileName);
      });
    } else {
      // Download direto (PC)
      downloadAsFile(blob, fileName);
    }
  } catch (err) {
    console.error('Erro ao compartilhar:', err);
    downloadAsFile(blob, fileName);
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
