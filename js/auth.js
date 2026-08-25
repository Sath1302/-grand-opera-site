// Connexion à Supabase (base de données + authentification).
// La clé "publishable" est faite pour être exposée côté client, ce n'est pas un secret :
// la sécurité réelle des données repose sur les règles RLS côté serveur Supabase.
const SUPABASE_URL = "https://xpngyfczptzyxokuodrw.supabase.co";
const SUPABASE_KEY = "sb_publishable_BZCj24P97-VAjqfiKzJmCQ_dcAFRoSm";

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// Inscription
async function signUp(email, password) {
  const { data, error } = await sb.auth.signUp({ email, password });
  return { data, error };
}

// Connexion
async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Déconnexion
async function signOut() {
  await sb.auth.signOut();
  window.location.href = "index.html";
}

// Récupère l'utilisateur actuellement connecté (ou null)
async function getCurrentUser() {
  const { data } = await sb.auth.getUser();
  return data?.user || null;
}

// Met à jour le lien "Mon compte" de la nav en fonction de l'état de connexion.
// À appeler sur chaque page (voir nav-auth-slot dans le HTML).
async function updateNavAuthState() {
  const slot = document.getElementById('nav-auth-slot');
  if (!slot) return;
  const user = await getCurrentUser();
  if (user) {
    slot.innerHTML = `<a href="compte.html" class="navcta">${user.email.split('@')[0]}</a>`;
  } else {
    slot.innerHTML = `<a href="compte.html" class="navcta">Se connecter</a>`;
  }
}

document.addEventListener('DOMContentLoaded', updateNavAuthState);
