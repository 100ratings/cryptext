let caseMode = 'upper';
let flipped = false;

// Define o modo de capitalização
function setCaseMode(mode) {
  caseMode = mode;
  updatePreviews();
}

// Alterna o estado de inversão visual (de cabeça pra baixo)
function toggleFlip() {
  flipped = !flipped;
  updatePreviews();
}

// Remove acentos do texto (ex: É → E)
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Aplica a capitalização escolhida
function formatText(text) {
  text = removeAccents(text);

  if (caseMode === 'upper') {
    return text.toUpperCase();
  }
  if (caseMode === 'lower') {
    return text.toLowerCase();
  }
  if (caseMode === 'capital') {
    return text
      .toLowerCase()
      .replace(/(^\w{1})|(\.\s*\w{1})/g, letter => letter.toUpperCase());
  }

  return text;
}

// Atualiza as pré-visualizações das fontes
function updatePreviews() {
  const input = document.getElementById('textInput').value;
  const formatted = formatText(input);

  const previews = [
    document.getElementById('preview1'),
    document.getElementById('preview2'),
    document.getElementById('preview3'),
  ];

  previews.forEach(preview => {
    preview.textContent = formatted;

    if (flipped) {
      preview.classList.add('flipped');
    } else {
      preview.classList.remove('flipped');
    }
  });
}

.flipped {
  transform: rotate(180deg);
  display: inline-block;
  transition: transform 0.4s ease-in-out;
}

