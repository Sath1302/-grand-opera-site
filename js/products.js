// Structure de données produits : centralise nom, catégorie, prix, description et image.
// Utilisée par index.html (aperçu) et carte.html (carte complète filtrable + fiche détail).
const PRODUCTS = [
  // Pains
  { name: "Baguette", category: "Pains", price: "1,20 €", img: "assets/baguettes.png", desc: "La baguette classique, croustillante à l'extérieur, moelleuse à l'intérieur. Cuite plusieurs fois par jour." },
  { name: "Tradition", category: "Pains", price: "1,40 €", img: "assets/baguettes.png", desc: "Baguette de tradition française, à la mie plus alvéolée et au goût plus prononcé que la baguette classique." },
  { name: "Pain Baltik", category: "Pains", price: "3,00 €", img: "assets/baguettes.png", desc: "Un pain de caractère, aux céréales, pour varier des pains blancs classiques." },
  // Pâtisserie
  { name: "Macaron", category: "Pâtisserie", price: "3,80 €", img: "assets/macarons.png", desc: "Coques croustillantes et ganache fondante, plusieurs parfums disponibles en vitrine." },
  { name: "Macaron framboise-vanille", category: "Pâtisserie", price: "5,00 €", img: "assets/patisseries-1.png", desc: "Un macaron généreux garni de crème vanille et de framboises fraîches." },
  { name: "Paris-Brest praliné", category: "Pâtisserie", price: "4,00 €", img: "assets/patisseries-1.png", desc: "Pâte à choux garnie de crème mousseline au praliné, un classique de la pâtisserie française." },
  { name: "Éclair café", category: "Pâtisserie", price: "3,60 €", img: "assets/patisseries-1.png", desc: "Pâte à choux allongée, garnie de crème pâtissière au café et glaçage au café." },
  { name: "Cheesecake framboise", category: "Pâtisserie", price: "4,50 €", img: "assets/patisseries-1.png", desc: "Cheesecake crémeux sur base biscuitée, nappé d'un coulis de framboise." },
  { name: "Trois chocolats", category: "Pâtisserie", price: "4,50 €", img: "assets/patisseries-2.png", desc: "Un entremets en trois couches de mousse au chocolat : noir, lait et blanc." },
  { name: "Éclair fraise", category: "Pâtisserie", price: "4,20 €", img: "assets/patisseries-2.png", desc: "Pâte à choux garnie de crème et surmontée de fraises fraîches." },
  { name: "Tarte aux fraises", category: "Pâtisserie", price: "4,50 €", img: "assets/patisseries-2.png", desc: "Fond de pâte sablée, crème pâtissière et fraises fraîches de saison." },
  { name: "Brownie", category: "Pâtisserie", price: "3,50 €", img: "assets/brownie.png", desc: "Brownie chocolat dense et fondant, préparé maison." },
  { name: "Fraisier", category: "Pâtisserie", price: "5,00 €", img: "assets/patisseries-4.png", desc: "Génoise, crème mousseline et fraises fraîches, un classique généreux." },
  { name: "Tarte au citron", category: "Pâtisserie", price: "4,20 €", img: "assets/patisseries-4.png", desc: "Pâte sablée et crème citron acidulée, pour les amateurs de fraîcheur." },
  { name: "Éclair chocolat", category: "Pâtisserie", price: "3,60 €", img: "assets/patisseries-4.png", desc: "Pâte à choux garnie de crème pâtissière au chocolat et glaçage chocolat." },
  { name: "Muffin", category: "Pâtisserie", price: "3,80 €", img: "assets/muffins.png", desc: "Muffins moelleux, plusieurs variétés en vitrine (chocolat, fruits rouges, pistache...)." },
  { name: "Financier", category: "Pâtisserie", price: "3,50 €", img: "assets/financiers.png", desc: "Petit gâteau moelleux à la poudre d'amande et au beurre noisette." },
  { name: "Tigré", category: "Pâtisserie", price: "3,00 €", img: "assets/financiers.png", desc: "Petit gâteau moelleux garni de pépites de chocolat." },
  { name: "Sablé choco-amandes", category: "Pâtisserie", price: "3,50 €", img: "assets/sables.png", desc: "Biscuit sablé croquant, pépites de chocolat et éclats d'amandes." },
  { name: "Sablé amande fruits rouges", category: "Pâtisserie", price: "3,50 €", img: "assets/sables.png", desc: "Biscuit sablé aux amandes garni de fruits rouges." },
  { name: "Tiramisu", category: "Pâtisserie", price: "4,80 €", img: "assets/patisseries-3.png", desc: "Tiramisu classique, mascarpone et café, préparé en verrine." },
  // Sandwichs
  { name: "Brioché omelette", category: "Sandwichs", price: "6,50 €", img: "assets/brioche-omelette.png", desc: "Pain brioché garni d'omelette, salade, tomate — préparé minute à emporter." },
  { name: "Brioché cheeseburger", category: "Sandwichs", price: "6,50 €", img: "assets/brioche-cheeseburger.png", desc: "Pain brioché, steak haché, cheddar, salade et tomate." },
  { name: "Brioché poisson pané", category: "Sandwichs", price: "6,50 €", img: "assets/brioche-poisson.png", desc: "Pain brioché, poisson pané croustillant, cheddar, salade et tomate." },
];

const CATEGORIES = ["Tous", "Pains", "Pâtisserie", "Sandwichs"];

// Assigne un identifiant unique à chaque produit (basé sur son index).
PRODUCTS.forEach((p, i) => p.id = i);

// Rend les filtres + la grille dans les containers donnés.
// limit: si fourni, n'affiche que les N premiers produits (utilisé pour l'aperçu sur l'accueil).
function initProductGrid(filtersId, gridId, opts = {}){
  const { limit = null, withFilters = true } = opts;
  let activeFilter = "Tous";
  const filtersEl = document.getElementById(filtersId);
  const gridEl = document.getElementById(gridId);

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
        <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
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
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeProductModal(); });
  modal.querySelector('.modal-close').addEventListener('click', closeProductModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProductModal(); });
}

function openProductModal(id){
  ensureModal();
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  document.getElementById('modal-img').src = p.img;
  document.getElementById('modal-img').alt = p.name;
  document.getElementById('modal-cat').textContent = p.category;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-price').textContent = p.price;
  document.getElementById('modal-desc').textContent = p.desc || "";
  document.getElementById('product-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal(){
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
