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
  let searchTerm = "";
  const filtersEl = document.getElementById(filtersId);
  const gridEl = document.getElementById(gridId);
  const searchEl = document.getElementById('product-search');

  gridEl.innerHTML = `<p style="grid-column:1/-1; color:rgba(247,242,231,0.5); font-size:14px;">Chargement de la carte…</p>`;
  PRODUCTS = await loadProducts();

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      searchTerm = searchEl.value.trim().toLowerCase();
      renderGrid();
    });
  }

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
    if (searchTerm) items = items.filter(p => p.name.toLowerCase().includes(searchTerm));
    if (limit) items = items.slice(0, limit);
    if (items.length === 0) {
      gridEl.innerHTML = `<p style="grid-column:1/-1; color:rgba(247,242,231,0.5); font-size:14px;">Aucun produit ne correspond à ta recherche.</p>`;
      return;
    }
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
        <div id="modal-reviews" style="margin-top:26px; border-top:1px solid var(--line); padding-top:20px;"></div>
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

  loadReviews(id);
}

async function loadReviews(productId){
  const container = document.getElementById('modal-reviews');
  container.innerHTML = `<p style="font-size:12.5px; color:rgba(43,29,20,0.4);">Chargement des avis…</p>`;

  const { data: reviews } = await sb.from('reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false });
  const user = await getCurrentUser();

  let avgHtml = '';
  if (reviews && reviews.length > 0) {
    const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    avgHtml = `<div style="font-size:14px; font-weight:600; margin-bottom:12px;">★ ${avg} <span style="font-weight:400; color:rgba(43,29,20,0.5); font-size:12.5px;">(${reviews.length} avis)</span></div>`;
  }

  let listHtml = (reviews || []).map(r => `
    <div style="padding:10px 0; border-bottom:1px solid var(--line); font-size:13px;">
      <div style="color:var(--ble);">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      ${r.comment ? `<p style="margin-top:4px; color:rgba(43,29,20,0.7);">${r.comment}</p>` : ''}
      <div style="font-size:11px; color:rgba(43,29,20,0.4); margin-top:3px;">${r.user_email.split('@')[0]}</div>
    </div>
  `).join('');

  let formHtml = '';
  if (user) {
    formHtml = `
      <div style="margin-top:14px;">
        <select id="review-rating" style="padding:8px; border-radius:5px; border:1px solid var(--line); font-size:13px;">
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>
        <input type="text" id="review-comment" placeholder="Ton avis (optionnel)" style="width:100%; margin-top:8px; padding:9px 12px; border-radius:5px; border:1px solid var(--line); font-size:13px; font-family:'Work Sans';">
        <button id="submit-review" style="margin-top:8px; background:var(--croute); color:var(--mie); border:none; padding:9px 16px; border-radius:4px; font-size:12.5px; cursor:pointer;">Publier l'avis</button>
      </div>`;
  } else {
    formHtml = `<p style="font-size:12px; color:rgba(43,29,20,0.45); margin-top:10px;"><a href="compte.html" style="color:var(--confiture); font-weight:600;">Connecte-toi</a> pour laisser un avis.</p>`;
  }

  container.innerHTML = `<h4 style="font-size:13px; text-transform:uppercase; letter-spacing:.04em; color:var(--confiture); margin-bottom:10px;">Avis clients</h4>` + avgHtml + (listHtml || `<p style="font-size:12.5px; color:rgba(43,29,20,0.45);">Aucun avis pour l'instant.</p>`) + formHtml;

  if (user) {
    document.getElementById('submit-review').addEventListener('click', async () => {
      const rating = Number(document.getElementById('review-rating').value);
      const comment = document.getElementById('review-comment').value;
      await sb.from('reviews').insert({ product_id: productId, user_id: user.id, user_email: user.email, rating, comment });
      loadReviews(productId);
    });
  }
}

function closeProductModal(){
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
