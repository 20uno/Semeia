// app.js

// ----- Feed de estudios (localStorage prototipo) -----
const form = document.getElementById('form-estudio');
const lista = document.getElementById('lista-estudios');
const storeKey = 'estudios_local';

function getEstudios() {
  return JSON.parse(localStorage.getItem(storeKey) || '[]');
}
function setEstudios(arr) {
  localStorage.setItem(storeKey, JSON.stringify(arr));
}
function renderEstudios() {
  const items = getEstudios();
  lista.innerHTML = items.map(({ titulo, pasajes, enlace }) => `
    <div class="item">
      <h3>${titulo}</h3>
      <p>${pasajes}</p>
      ${enlace ? `<p><a target="_blank" href="${enlace}">Ver más</a></p>` : ''}
    </div>
  `).join('');
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const pasajes = document.getElementById('pasajes').value.trim();
  const enlace = document.getElementById('enlace').value.trim();
  if (!titulo || !pasajes) return;
  const items = getEstudios();
  items.unshift({ titulo, pasajes, enlace, date: Date.now() });
  setEstudios(items);
  renderEstudios();
  form.reset();
});
renderEstudios();

// ----- Música -----
const tracks = [
  // Ejemplos: reemplaza con archivos del repo o enlaces externos
  { name: 'Canto 1 (local)', src: 'musica/canto1.mp3' },
  { name: 'Playlist YouTube', src: 'https://www.youtube.com/watch?v=XXXXXXXX' } // abrirá en navegador
];
const selectTrack = document.getElementById('track');
const player = document.getElementById('player');

function renderTracks() {
  selectTrack.innerHTML = tracks.map((t, i) => `<option value="${i}">${t.name}</option>`).join('');
  selectTrack.value = 0;
  loadTrack(0);
}
function loadTrack(i) {
  const t = tracks[i];
  if (t.src.endsWith('.mp3') || t.src.endsWith('.ogg')) {
    player.src = t.src;
    player.style.display = 'block';
  } else {
    player.style.display = 'none';
    window.open(t.src, '_blank');
  }
}
selectTrack.addEventListener('change', () => loadTrack(Number(selectTrack.value)));
renderTracks();

// ----- Generador de imágenes con versículos (Canvas) -----
const txt = document.getElementById('texto-versiculo');
const ref = document.getElementById('referencia');
const fontSel = document.getElementById('font-select');
const btnGen = document.getElementById('generar');
const btnDown = document.getElementById('descargar');
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

function wrapText(text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach(w => {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width < maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = w;
    }
  });
  if (line) lines.push(line);
  return lines;
}

btnGen.addEventListener('click', () => {
  const verse = txt.value.trim();
  const refText = ref.value.trim();
  const font = fontSel.value || 'serif';
  // Fondo degradado
  const grd = ctx.createLinearGradient(0,0,0,canvas.height);
  grd.addColorStop(0, '#0b1020');
  grd.addColorStop(1, '#0f172a');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Marco y título
  ctx.strokeStyle = '#14b8a6';
  ctx.lineWidth = 8;
  ctx.strokeRect(32,32,canvas.width-64,canvas.height-64);

  // Texto del versículo
  ctx.fillStyle = '#e5e7eb';
  ctx.font = `48px ${font}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const padding = 80;
  const maxWidth = canvas.width - padding*2;
  const lines = wrapText(verse || 'Escribe el versículo aquí...', maxWidth);
  let y = padding + 20;
  lines.forEach(line => {
    ctx.fillText(line, padding, y);
    y += 64; // interlineado
  });

  // Referencia
  ctx.fillStyle = '#9ca3af';
  ctx.font = `36px ${font}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(refText || 'Referencia', canvas.width - padding, canvas.height - padding);

  btnDown.disabled = false;
});

btnDown.addEventListener('click', () => {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'versiculo.png';
  a.click();
});
