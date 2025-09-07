  fetch('../includes/header_list.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    });

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".grille-cookies");
  const rechercheInput = document.getElementById("recherche");
  const filtreObtenu = document.getElementById("filtre-obtenu");
  const filtreNonObtenu = document.getElementById("filtre-non-obtenu");
  let tousLesCookies = [];

  let rareteActive = "";
  let roleActif = "";
  let elementActif = "";

  fetch("../assets/data/cookies.json")
    .then(response => response.json())
    .then(data => {
      tousLesCookies = data;
      afficherCookies(data);
    });

  function afficherCookies(liste) {
    container.innerHTML = "";

    liste.forEach(cookie => {
      const carte = document.createElement("a");
      carte.href = "pages/" + cookie.lien;
      carte.className = "carte-cookie";

      // Opacité si obtenu
      const estObtenu = localStorage.getItem(cookie.id) === "true";
      if (estObtenu) {
        carte.classList.add("obtenu");
      }

      let multiElementsClass = Array.isArray(cookie.element) && cookie.element.length > 1 ? "multi-elements" : "";
      let blocCentreHTML = `<div class="bloc-centre ${multiElementsClass}"><img src="../assets/images/${cookie.role}" alt="Rôle" class="badge-icon">`;

      if (Array.isArray(cookie.element)) {
        cookie.element.forEach(elem => {
          blocCentreHTML += `<img src="../assets/images/${elem}" alt="Élément" class="badge-icon">`;
        });
      } else if (cookie.element && cookie.element !== "") {
        blocCentreHTML += `<img src="../assets/images/${cookie.element}" alt="Élément" class="badge-icon">`;
      }

      blocCentreHTML += `</div>`;

      carte.innerHTML = `
        <div class="bloc-gauche">
          <div class="fond-img">
            <img src="../assets/images/${cookie.image}" alt="${cookie.nom}" class="cookie-head">
          </div>
          <div class="fond-img">
            <img src="../assets/images/${cookie.rarete}" alt="rarete" class="badge-epique">
          </div>
        </div>
        ${blocCentreHTML}
        <div class="bloc-droite">
          <h3 class="nom-cookie">${cookie.nom}</h3>
        </div>
        <div class="bloc-obtenu">
          <button class="btn-obtenu" data-cookie-id="${cookie.id}" aria-label="Cookie obtenu">
            <svg class="checkmark-svg" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" fill="none" stroke="#FFF0DC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;

      container.appendChild(carte);
    });

    activerBoutonsObtenu();
  }

  function appliquerFiltres() {
    let resultats = tousLesCookies;

    const recherche = rechercheInput.value.toLowerCase();
    resultats = resultats.filter(cookie => cookie.nom.toLowerCase().includes(recherche));

    if (rareteActive !== "") {
      resultats = resultats.filter(cookie => cookie.rarete.includes(rareteActive));
    }

    if (roleActif !== "") {
      resultats = resultats.filter(cookie => cookie.role.includes(roleActif));
    }

    if (elementActif !== "") {
      resultats = resultats.filter(cookie => {
        if (Array.isArray(cookie.element)) {
          return cookie.element.some(e => e.includes(elementActif));
        } else {
          return cookie.element.includes(elementActif);
        }
      });
    }

    resultats = resultats.filter(cookie => {
      const estObtenu = localStorage.getItem(cookie.id) === "true";
      if (filtreObtenu.checked && !filtreNonObtenu.checked) return estObtenu;
      if (!filtreObtenu.checked && filtreNonObtenu.checked) return !estObtenu;
      return true;
    });

    afficherCookies(resultats);
  }

  rechercheInput.addEventListener("input", appliquerFiltres);
  filtreObtenu.addEventListener("change", appliquerFiltres);
  filtreNonObtenu.addEventListener("change", appliquerFiltres);

  function activerBoutonsObtenu() {
    const boutons = document.querySelectorAll(".btn-obtenu");
    boutons.forEach(bouton => {
      const id = bouton.dataset.cookieId;
      const carte = bouton.closest(".carte-cookie");

      if (localStorage.getItem(id) === "true") {
        bouton.classList.add("obtenu");
        carte.classList.add("obtenu");
      }

      bouton.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        bouton.classList.toggle("obtenu");

        const estObtenu = bouton.classList.contains("obtenu");
        localStorage.setItem(id, estObtenu);
        if (estObtenu) {
          carte.classList.add("obtenu");
        } else {
          carte.classList.remove("obtenu");
        }

        appliquerFiltres();
      });
    });
  }

  // Rarete
  window.toggleRareteOptions = function () {
    const options = document.getElementById("rareteOptions");
    options.style.display = options.style.display === "flex" ? "none" : "flex";
  };

  document.querySelectorAll("#rareteOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      rareteActive = rareteActive === valeur ? "" : valeur;
      document.getElementById("rareteOptions").style.display = "none";
      appliquerFiltres();
    });
  });

  // Rôle
  window.toggleRoleOptions = function () {
    const options = document.getElementById("roleOptions");
    options.style.display = options.style.display === "flex" ? "none" : "flex";
  };

  document.querySelectorAll("#roleOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      roleActif = roleActif === valeur ? "" : valeur;
      document.getElementById("roleOptions").style.display = "none";
      appliquerFiltres();
    });
  });

  // Élément
  window.toggleElementOptions = function () {
    const options = document.getElementById("elementOptions");
    options.style.display = options.style.display === "flex" ? "none" : "flex";
  };

  document.querySelectorAll("#elementOptions li").forEach(option => {
    option.addEventListener("click", () => {
      const valeur = option.getAttribute("data-value");
      elementActif = elementActif === valeur ? "" : valeur;
      document.getElementById("elementOptions").style.display = "none";
      appliquerFiltres();
    });
  });
});
