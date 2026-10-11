/* ===== Projets : fetch + affichage (CM4 §4.4 et §4.5) ===== */
const conteneur = document.querySelector("#liste-projets");
let tousLesProjets = [];

function creerCarte(p) {
  return `
    <article class="col">
      <div class="card carte-projet h-100">
        <img src="${p.image}" class="card-img-top" alt="Capture de ${p.titre}">
        <div class="card-body">
          <h3 class="card-title h5">${p.titre}</h3>
          <p class="card-text">${p.description}</p>
          <a href="${p.lien}" class="btn btn-primary">Voir le projet</a>
        </div>
      </div>
    </article>`;
}

function afficherProjets(liste) {
  conteneur.innerHTML = liste.map(creerCarte).join("");
}

async function chargerProjets() {
  try {
    const reponse = await fetch("data/projets.json");
    const donnees = await reponse.json();
    tousLesProjets = donnees;
    afficherProjets(tousLesProjets);
  } catch (erreur) {
    console.error("Erreur de chargement :", erreur);
    conteneur.innerHTML = `<p class="text-danger">Impossible de charger les projets.</p>`;
  }
}

chargerProjets();

/* ===== Filtres par délégation d'événements (CM4 §4.1) ===== */
document.querySelector("#filtres").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const categorie = btn.dataset.categorie;
  if (categorie === "tous") {
    afficherProjets(tousLesProjets);
  } else {
    afficherProjets(tousLesProjets.filter(p => p.categorie === categorie));
  }

  document.querySelectorAll("#filtres button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
});

/* ===== Mode sombre mémorisé (CM4 §4.3) ===== */
const btnTheme = document.querySelector("#btn-theme");

function appliquerTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  btnTheme.textContent = theme === "dark" ? "Mode clair" : "Mode sombre";
  localStorage.setItem("theme", theme);
}

appliquerTheme(localStorage.getItem("theme") || "light");

btnTheme.addEventListener("click", () => {
  const actuel = document.documentElement.getAttribute("data-bs-theme");
  appliquerTheme(actuel === "dark" ? "light" : "dark");
});

/* ===== Bouton « retour en haut » ===== */
window.addEventListener("scroll", () => {
  document.querySelector("#btn-top").classList.toggle("d-none", window.scrollY <= 300);
});

document.querySelector("#btn-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== Validation du formulaire (CM4 §4.2) ===== */
const form = document.querySelector("#form-contact");
const zoneMessage = document.querySelector("#form-message");

function marquer(champ, estValide) {
  champ.classList.toggle("is-valid", estValide);
  champ.classList.toggle("is-invalid", !estValide);
  return estValide;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const champNom = document.querySelector("#nom");
  const champEmail = document.querySelector("#email");
  const champMessage = document.querySelector("#message");
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nomOk = marquer(champNom, champNom.value.trim().length >= 2);
  const emailOk = marquer(champEmail, regexEmail.test(champEmail.value.trim()));
  const messageOk = marquer(champMessage, champMessage.value.trim().length >= 10);

  if (nomOk && emailOk && messageOk) {
    const nom = champNom.value.trim(); // gardé AVANT form.reset()
    form.reset();
    zoneMessage.innerHTML = `<div class="alert alert-success" role="alert">Merci <span id="nom-envoye"></span>, votre message a bien été envoyé.</div>`;
    document.querySelector("#nom-envoye").textContent = nom; // textContent : pas d'injection HTML (CM4 §4.2)
    [champNom, champEmail, champMessage].forEach(c => c.classList.remove("is-valid"));
  } else {
    zoneMessage.innerHTML = "";
  }
});