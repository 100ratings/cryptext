let caseMode = 'upper';

// Remove acentos (acentuação e cedilha)
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c").replace(/Ç/g, "C");
}

// Formata o texto conforme o modo selecionado
function formatText(text) {
  const noAccents = removeAccents(text);

  if (caseMode === 'upper') return noAccents.toUpperCase();
  if (caseMode === 'lower') return noAccents.toLowerCase();

  if (caseMode === 'capital') {
    return noAccents
      .toLowerCase()
      .replace(/(^\w|\.\s*\w|\!\s*\w|\?\s*\w)/g, match => match.toUpperCase());
  }

  return noAccents;
}

// Aplica a transformação nas três visualizações
function updatePreviews() {
  const input = document.getElementById('textInput').value;
  const transformed = formatText(input);

  document.getElementById('preview1').textContent = transformed;
  document.getElementById('preview2').textContent = transformed;
  document.getElementById('preview3').textContent = transformed;
}

// Define o modo (upper/lower/capital) e atualiza previews
function setCaseMode(mode) {
  caseMode = mode;
  updatePreviews();
}

// Ativa rotação ao clicar nos previews
document.querySelectorAll('.preview-text').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.toggle('rotated');
  });
});


