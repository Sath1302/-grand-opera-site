// Panier de démonstration : stocké en mémoire pour la session du navigateur.
// Ceci est une simulation de commande à titre pédagogique — aucun paiement réel
// n'est traité, aucune commande n'est transmise à un vrai système de caisse.
function getCart(){
  try {
    return JSON.parse(sessionStorage.getItem('cart') || '[]');
  } catch { return []; }
}

function saveCart(cart){
  sessionStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId){
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productId){
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartQty(productId, qty){
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(productId);
  } else {
    item.qty = qty;
    saveCart(cart);
  }
}

function clearCart(){
  sessionStorage.removeItem('cart');
  updateCartBadge();
}

function cartItemCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// Convertit "3,80 €" en nombre 3.80
function parsePrice(priceStr){
  return parseFloat(priceStr.replace('€', '').replace(',', '.').trim());
}

function cartTotal(){
  const cart = getCart();
  let total = 0;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) total += parsePrice(product.price) * item.qty;
  });
  return total;
}

function updateCartBadge(){
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = cartItemCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
