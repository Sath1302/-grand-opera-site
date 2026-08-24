// Structure de données produits : centralise nom, catégorie, prix et image.
// Utilisée par index.html (aperçu) et carte.html (carte complète filtrable).
const PRODUCTS = [
  // Pains
  { name: "Baguette", category: "Pains", price: "1,20 €", img: "assets/baguettes.png" },
  { name: "Tradition", category: "Pains", price: "1,40 €", img: "assets/baguettes.png" },
  { name: "Pain Baltik", category: "Pains", price: "3,00 €", img: "assets/baguettes.png" },
  // Pâtisserie
  { name: "Macaron", category: "Pâtisserie", price: "3,80 €", img: "assets/macarons.png" },
  { name: "Macaron framboise-vanille", category: "Pâtisserie", price: "5,00 €", img: "assets/patisseries-1.png" },
  { name: "Paris-Brest praliné", category: "Pâtisserie", price: "4,00 €", img: "assets/patisseries-1.png" },
  { name: "Éclair café", category: "Pâtisserie", price: "3,60 €", img: "assets/patisseries-1.png" },
  { name: "Cheesecake framboise", category: "Pâtisserie", price: "4,50 €", img: "assets/patisseries-1.png" },
  { name: "Trois chocolats", category: "Pâtisserie", price: "4,50 €", img: "assets/patisseries-2.png" },
  { name: "Éclair fraise", category: "Pâtisserie", price: "4,20 €", img: "assets/patisseries-2.png" },
  { name: "Tarte aux fraises", category: "Pâtisserie", price: "4,50 €", img: "assets/patisseries-2.png" },
  { name: "Brownie", category: "Pâtisserie", price: "3,50 €", img: "assets/brownie.png" },
  { name: "Fraisier", category: "Pâtisserie", price: "5,00 €", img: "assets/patisseries-4.png" },
  { name: "Tarte au citron", category: "Pâtisserie", price: "4,20 €", img: "assets/patisseries-4.png" },
  { name: "Éclair chocolat", category: "Pâtisserie", price: "3,60 €", img: "assets/patisseries-4.png" },
  { name: "Muffin", category: "Pâtisserie", price: "3,80 €", img: "assets/muffins.png" },
  { name: "Financier", category: "Pâtisserie", price: "3,50 €", img: "assets/financiers.png" },
  { name: "Tigré", category: "Pâtisserie", price: "3,00 €", img: "assets/financiers.png" },
  { name: "Sablé choco-amandes", category: "Pâtisserie", price: "3,50 €", img: "assets/sables.png" },
  { name: "Sablé amande fruits rouges", category: "Pâtisserie", price: "3,50 €", img: "assets/sables.png" },
  { name: "Tiramisu", category: "Pâtisserie", price: "4,80 €", img: "assets/patisseries-3.png" },
  // Sandwichs
  { name: "Brioché omelette", category: "Sandwichs", price: "6,50 €", img: "assets/brioche-omelette.png" },
  { name: "Brioché cheeseburger", category: "Sandwichs", price: "6,50 €", img: "assets/brioche-cheeseburger.png" },
  { name: "Brioché poisson pané", category: "Sandwichs", price: "6,50 €", img: "assets/brioche-poisson.png" },
];

const CATEGORIES = ["Tous", "Pains", "Pâtisserie", "Sandwichs"];

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
      <div class="p-card">
        <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
        <div class="body">
          <span class="cat">${p.category}</span>
          <h3>${p.name}</h3>
          <div class="price">${p.price}</div>
          <div class="note">à emporter</div>
        </div>
      </div>
    `).join('');
  }

  renderFilters();
  renderGrid();
}
