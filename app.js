// ----- Feed de estudios (localStorage prototipo) -----
const form = document.getElementById('form-estudio');
const lista = document.getElementById('lista-estudios');
const storeKey = 'estudios_local';

// Precarga de ejemplos iniciales
if (!localStorage.getItem(storeKey)) {
  const iniciales = [
    { titulo: "Bienaventuranzas", pasajes: "Mateo 5:1-12", enlace: "" },
    { titulo: "El amor verdadero", pasajes: "1 Corintios 13", enlace: "" }
  ];
  localStorage.setItem(storeKey, JSON.stringify(iniciales));
}

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
  { name: 'Canto instrumental', src: 'musica/canto1.mp3' }
];
const select
