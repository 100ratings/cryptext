// Carrega as fontes dinamicamente
const fontes = [
  { nome: 'Cryptext1', arquivo: 'Cryptext1.ttf' },
  { nome: 'Cryptext2', arquivo: 'Cryptext2.ttf' },
  { nome: 'Cryptext2.5', arquivo: 'Cryptext2.5.ttf' }
];

// Função para remover acentos e cedilha
function removeAcentos(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/ç/g, "c").replace(/Ç/g, "C");
}

// Função para aplicar transformação de texto
function transformarTexto(tipo) {
  let texto = removeAcentos(document.getElementById('text-input').value);

  if (tipo === 'upper') {
    texto = texto.toUpperCase();
  } else if (tipo === 'lower') {
    texto = texto.toLowerCase();
  } else if (tipo === 'capitalize') {
    texto = texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  atualizarVisualizacao(texto);
}

// Atualiza o preview das fontes
function atualizarVisualizacao(texto) {
  fontes.forEach(fonte => {
    const preview = document.getElementById(`preview-${fonte.nome}`);
    if (preview) {
      preview.textContent = texto;
    }
  });
}

// Ao digitar no input
document.getElementById('text-input').addEventListener('input', () => {
  transformarTexto('none');
});

// Carrega as fontes no CSS dinamicamente e gera os cards
function carregarFontes() {
  const style = document.createElement('style');
  const container = document.getElementById('font-container');

  fontes.forEach(fonte => {
    // Define a fonte via @font-face
    style.innerHTML += `
      @font-face {
        font-family: '${fonte.nome}';
        src: url('${fonte.arquivo}') format('truetype');
      }
    `;

    // Cria o card
    const card = document.createElement('div');
    card.className = 'font-card';

    const label = document.createElement('div');
    label.className = 'font-name';
    label.textContent = fonte.nome;

    const preview = document.createElement('div');
    preview.className = 'font-sample';
    preview.id = `preview-${fonte.nome}`;
    preview.style.fontFamily = fonte.nome;
    preview.textContent = '';

    card.appendChild(label);
    card.appendChild(preview);
    container.appendChild(card);
  });

  document.head.appendChild(style);
}

carregarFontes();
