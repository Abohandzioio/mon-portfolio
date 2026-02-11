const catalogue = [
  {
    nom: "CSS Flexbox & Grid",
    prix: 200,
    description: "Maitrise de la mise en page avec Flexbox et Grid",
  },
  {
    nom: "JavaScript",
    prix: 400,
    description: "Maitrise de la syntaxe et de Vanilla JS",
  },
  { nom: "Git & GitHub", prix: 80, description: "Versionning" },
  { nom: "HTML5", prix: 90, description: "Base web" },
  { nom: "React", prix: 300, description: "Framework Front-End" },
  { nom: "Node.js", prix: 350, description: "Back-End JS" },
  { nom: "SASS", prix: 145, description: "Préprocesseur CSS" },
  { nom: "API REST", prix: 195, description: "Utilisation d'API" },
  { nom: "SEO", prix: 100, description: "Référencement" },
  { nom: "UX Design", prix: 180, description: "Expérience utilisateur" },
];

let credits = parseInt(localStorage.getItem("credits")) || 1000;
let competencesAcquises =
  JSON.parse(localStorage.getItem("competencesAcquises")) || [];
let panier = JSON.parse(localStorage.getItem("panier")) || [];

function sauvegarderEtat() {
  localStorage.setItem("credits", credits);
  localStorage.setItem(
    "competencesAcquises",
    JSON.stringify(competencesAcquises)
  );
  localStorage.setItem("panier", JSON.stringify(panier));
}

function mettreAJourPortefeuille() {
  const creditsEl = document.getElementById("credits");
  if (creditsEl) creditsEl.textContent = credits;

  const listeComp = document.getElementById("competences-acquises");
  if (listeComp) {
    listeComp.innerHTML = "";
    competencesAcquises.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c;
      listeComp.appendChild(li);
    });
  }
}

function mettreAJourPanier() {
  const listePanier = document.getElementById("liste-panier");
  if (listePanier) {
    listePanier.innerHTML = "";
    panier.forEach((a) => {
      const li = document.createElement("li");
      li.textContent = `${a.nom} - ${a.prix} Crédits`;
      listePanier.appendChild(li);
    });
  }
}

const conteneur = document.getElementById("liste-competences");
if (conteneur) {
  catalogue.forEach((c) => {
    const div = document.createElement("div");
    div.className = "carte-competence";
    div.innerHTML = `<h3>${c.nom}</h3><p>${c.description}</p><p>Prix : ${c.prix} Crédits</p><button class="bouton-ajouter">Ajouter</button>`;
    div.querySelector(".bouton-ajouter").addEventListener("click", () => {
      panier.push(c);
      mettreAJourPanier();
      sauvegarderEtat();
    });
    conteneur.appendChild(div);
  });
}

const boutonAchat = document.getElementById("bouton-achat");
if (boutonAchat) {
  boutonAchat.addEventListener("click", () => {
    const total = panier.reduce((acc, a) => acc + a.prix, 0);
    if (total > credits) {
      document.getElementById("erreur-panier").textContent =
        "Solde insuffisant !";
      return;
    }
    credits -= total;
    competencesAcquises.push(...panier.map((a) => a.nom));
    panier = [];
    mettreAJourPanier();
    mettreAJourPortefeuille();
    sauvegarderEtat();
    document.getElementById("erreur-panier").textContent = "";
  });
}

const formulaireProduction = document.getElementById("formulaire-production");
if (formulaireProduction) {
  formulaireProduction.addEventListener("submit", (e) => {
    e.preventDefault();
    const heures = parseInt(document.getElementById("heures").value);
    const btn = document.getElementById("bouton-production");
    credits += heures * 20;
    mettreAJourPortefeuille();
    sauvegarderEtat();
    btn.disabled = true;
    setTimeout(() => (btn.disabled = false), 3000);
  });
}

const bonusContainer = document.getElementById("bonus");
if (bonusContainer) {
  setInterval(() => {
    const bonus = document.createElement("div");
    bonus.textContent = "+10 Crédits !";
    bonus.className = "bonus";
    bonusContainer.appendChild(bonus);
    bonus.addEventListener("click", () => {
      credits += 10;
      mettreAJourPortefeuille();
      sauvegarderEtat();
      bonus.remove();
    });
    setTimeout(() => bonus.remove(), 5000);
  }, Math.random() * (60000 - 30000) + 30000);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "c") {
    panier = [];
    mettreAJourPanier();
    sauvegarderEtat();
  }
  if (e.key === "p") {
    const panierSection = document.getElementById("panier");
    if (panierSection) panierSection.classList.toggle("cache");
  }
});

mettreAJourPortefeuille();
mettreAJourPanier();

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
