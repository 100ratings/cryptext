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

function saveImage(elementId, fontName) {
  const element = document.getElementById(elementId);
  
  if (!element.innerText.trim()) {
    alert("Digite algum texto para salvar a imagem.");
    return;
  }

  // Configurações para alta definição
  const options = {
    scale: 12, // Aumenta a escala para ultra resolução (aprox. 3500px+)
    backgroundColor: '#ffffff', // Fundo branco
    logging: false,
    useCORS: true,
    onclone: (clonedDoc) => {
      const el = clonedDoc.getElementById(elementId);
      el.style.color = '#000000'; // Define a cor do texto para preto
      el.style.background = '#ffffff'; // Garante fundo branco
      el.style.display = 'inline-block'; // Ajusta a largura ao conteúdo (remove espaços laterais)
      el.style.width = 'auto';
      el.style.padding = '20px'; // Adiciona margem para evitar cortes na fonte
      el.style.textAlign = 'center'; // Centraliza o texto caso haja quebra de linha
    }
  };

  html2canvas(element, options).then(canvas => {
    canvas.toBlob((blob) => {
      const fileName = `${fontName}_${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Tenta abrir o menu de compartilhamento nativo (permite "Salvar Imagem" na galeria)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'Salvar Imagem',
          text: 'Imagem gerada pelo Cryptext'
        }).catch(() => console.log('Compartilhamento fechado'));
      } else {
        // Fallback para download direto (Salva em Arquivos caso o share não funcione)
        const link = document.createElement('a');
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }
    }, 'image/png');
  }).catch(err => {
    console.error("Erro ao salvar imagem:", err);
    alert("Ocorreu um erro ao gerar a imagem.");
  });
}

// Restaura a funcionalidade de girar ao clicar duas vezes
document.addEventListener('DOMContentLoaded', () => {
  const previews = document.querySelectorAll('.preview-text');
  previews.forEach(preview => {
    preview.addEventListener('dblclick', function() {
      this.classList.toggle('rotated');
    });
    // Previne o menu de contexto (segurar o clique) para não selecionar
    preview.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  });
});