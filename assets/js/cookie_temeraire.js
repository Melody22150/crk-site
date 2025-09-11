fetch('../includes/header_cookie.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    });

// Fenêtre costume
const btnCostume = document.querySelector('.btn-costume');
const popupCostume = document.getElementById('popup-costume');
const closePopup = document.getElementById('close-popup');

btnCostume.addEventListener('click', () => {
  popupCostume.style.display = 'flex';
});

closePopup.addEventListener('click', () => {
  popupCostume.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === popupCostume) {
    popupCostume.style.display = 'none';
  }
});

// Nouvelle version : utilise data-id pour la sauvegarde
const elements = document.querySelectorAll('.bonbon-cycle, .costume-toggle, .garniture-cycle, .ascension-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle');

elements.forEach(img => {
  const images = JSON.parse(img.dataset.images);
  const id = img.dataset.id; // Utilise directement data-id

  if (!id) return; // Sécurité : ignore les images sans data-id

  // Charger l'état sauvegardé
  const savedStep = localStorage.getItem(`etat-${id}`);
  if (savedStep !== null) {
    img.dataset.step = savedStep;
    img.src = images[savedStep];
  }

  // Gérer les clics
  img.addEventListener('click', () => {
    let currentStep = parseInt(img.dataset.step);
    currentStep = (currentStep + 1) % images.length;
    img.src = images[currentStep];
    img.dataset.step = currentStep;

    localStorage.setItem(`etat-${id}`, currentStep);
  });
});

// Bouton de sauvegarde (effet visuel uniquement)
document.getElementById('btn-save').addEventListener('click', () => {
  alert('Modifications sauvegardées 🍪');
});

document.addEventListener("DOMContentLoaded", () => {
  const mainIllustration = document.querySelector(".illustration-cookie img");
  const gallery = document.querySelector(".costume-gallery"); // parent des .costume-item/.costume-toggle
  if (!mainIllustration || !gallery) return;

  // --- 1) Génère une clé UNIQUE par cookie (page) ---
  // Option A: si tu as un identifiant sur la page, prends-le (recommandé)
  //   <main class="page-cookie" data-cookie-id="cookie-temeraire">
  const cookieIdAttr = document.querySelector(".page-cookie")?.getAttribute("data-cookie-id");

  // Option B: sinon, on fabrique une clé à partir du nom affiché
  const nameKey =
    (document.querySelector(".nom-cookie")?.textContent || location.pathname.split("/").pop() || "cookie")
      .trim().toLowerCase().replace(/\s+/g, "-");

  const pageKey = cookieIdAttr || nameKey;
  const LS_KEY = `cookie-illustration:${pageKey}`;

  // --- helpers ---
  const getColorSrc = (el) => {
    try {
      const arr = JSON.parse(el.getAttribute("data-images") || "[]");
      return arr.length ? arr[arr.length - 1] : null; // dernière = couleur
    } catch { return null; }
  };

  const getTargetIllustration = (el) =>
    el.getAttribute("data-illustration-replace") || getColorSrc(el);

  const isObtained = (el) => {
    const step = parseInt(el.getAttribute("data-step") || "0", 10);
    return step >= 1 || el.classList.contains("obtained");
  };

  const applyIllustration = (src) => {
    if (!src) return;
    mainIllustration.src = src;
    localStorage.setItem(LS_KEY, src); // <-- PERSISTENCE
  };

  // --- 2) Restaurer au chargement si on a déjà sauvé quelque chose ---
  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    mainIllustration.src = saved;
  }

  // --- 3) Au clic sur n’importe quel costume : si obtenu (couleur), on remplace + on SAUVE ---
  gallery.addEventListener("click", (e) => {
    const img = e.target.closest(".costume-toggle");
    if (!img) return;

    // on attend que ta logique interne ait mis à jour data-step / la vignette
    setTimeout(() => {
      if (isObtained(img)) {
        const newSrc = getTargetIllustration(img);
        applyIllustration(newSrc);
      }
    }, 0);
  });
});


