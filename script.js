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
    scale: 5, // Aumenta a escala em 5x para alta resolução
    backgroundColor: null, // Fundo transparente
    logging: false,
    useCORS: true
  };

  html2canvas(element, options).then(canvas => {
    const link = document.createElement('a');
    link.download = `${fontName}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    console.error("Erro ao salvar imagem:", err);
    alert("Ocorreu um erro ao gerar a imagem.");
  });
}