// Les produits sont stockés dans une vraie table Supabase (PostgreSQL) et chargés ici
// au lancement de chaque page — plus de données codées en dur dans le JS.
let PRODUCTS = [];
const CATEGORIES = ["Tous", "Pains", "Pâtisserie", "Sandwichs"];

async function loadProducts(){
  const { data, error } = await sb.from('products').select('*').order('id');
  if (error) {
    console.error('Erreur de chargement des produits :', error.message);
    return [];
  }
  // Convertit le prix numérique (ex: 3.80) en format d'affichage français (ex: "3,80 €")
  return data.map(p => ({
    ...p,
    price: p.price.toFixed(2).replace('.', ',') + ' €'
  }));
}

// Rend les filtres + la grille dans les containers donnés.
// limit: si fourni, n'affiche que les N premiers produits (utilisé pour l'aperçu sur l'accueil).
async function initProductGrid(filtersId, gridId, opts = {}){
  const { limit = null, withFilters = true } = opts;
  let activeFilter = "Tous";
  const filtersEl = document.getElementById(filtersId);
  const gridEl = document.getElementById(gridId);

  gridEl.innerHTML = `<p style="grid-column:1/-1; color:rgba(247,242,231,0.5); font-size:14px;">Chargement de la carte…</p>`;
  PRODUCTS = await loadProducts();

  function renderFilters(){
    if (!withFilters || !filtersEl) return;
    filtersEl.innerHTML = CATEGORIES.map(cat =>
      `<button class="filter-btn${cat===activeFilter?' active':''}" data-cat="${cat}">${cat}</button>`
    ).join('');
    filtersEl.querySelectorAll('.filter-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        activeFilter = btn.dataset.cat;
        renderFilters();
        renderGrid();
      });
    });
  }

  function renderGrid(){
    let items = activeFilter === "Tous" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
    if (limit) items = items.slice(0, limit);
    gridEl.innerHTML = items.map(p => `
      <div class="p-card" data-id="${p.id}" role="button" tabindex="0">
        <div class="thumb"><img src="${p.image}" alt="${p.name}"></div>
        <div class="body">
          <span class="cat">${p.category}</span>
          <h3>${p.name}</h3>
          <div class="price">${p.price}</div>
          <div class="note">à emporter</div>
        </div>
      </div>
    `).join('');
    gridEl.querySelectorAll('.p-card').forEach(card => {
      card.addEventListener('click', () => openProductModal(Number(card.dataset.id)));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProductModal(Number(card.dataset.id)); }
      });
    });
  }

  renderFilters();
  renderGrid();
}

// Fiche détail : injecte la modale une seule fois par page, la remplit au clic.
function ensureModal(){
  if (document.getElementById('product-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'product-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Fermer">&times;</button>
      <div class="modal-img"><img id="modal-img" src="" alt=""></div>
      <div class="modal-content">
        <span class="cat" id="modal-cat"></span>
        <h3 id="modal-name"></h3>
        <div class="price" id="modal-price"></div>
        <p id="modal-desc"></p>
        <button class="btn-primary" id="modal-add-cart" style="margin-top:20px; width:100%; background:var(--confiture); color:var(--mie);">Ajouter au panier</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeProductModal(); });
  modal.querySelector('.modal-close').addEventListener('click', closeProductModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProductModal(); });
}

let currentModalProductId = null;

function openProductModal(id){
  ensureModal();
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  currentModalProductId = id;
  document.getElementById('modal-img').src = p.image;
  document.getElementById('modal-img').alt = p.name;
  document.getElementById('modal-cat').textContent = p.category;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-price').textContent = p.price;
  document.getElementById('modal-desc').textContent = p.description || "";
  document.getElementById('product-modal').classList.add('open');
  document.body.style.overflow = 'hidden';

  const addBtn = document.getElementById('modal-add-cart');
  addBtn.onclick = () => {
    addToCart(currentModalProductId);
    addBtn.textContent = 'Ajouté ✓';
    setTimeout(() => { addBtn.textContent = 'Ajouter au panier'; }, 1200);
  };
}

function closeProductModal(){
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
