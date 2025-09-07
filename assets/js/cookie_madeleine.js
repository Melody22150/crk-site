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
const elements = document.querySelectorAll('.bonbon-cycle, .costume-toggle, .ascension-cycle, .biscuit-cycle, .tartelette-cycle, .promotion-cycle');

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

const garnitures = document.querySelectorAll('.garniture-cycle');

// Charger les états sauvegardés et gérer les clics
garnitures.forEach(img => {
  const id = img.dataset.id;
  const savedStep = localStorage.getItem(`etat-${id}`);

  const images = JSON.parse(img.dataset.images);
  const parent = img.closest('.garniture-item');
  const countBadge = parent.querySelector('.garniture-count');

  if (savedStep !== null) {
    img.dataset.step = savedStep;
    img.src = images[savedStep];
    countBadge.textContent = savedStep;
  } else {
    img.dataset.step = 0;
  }

  img.addEventListener('click', () => {
    let currentStep = parseInt(img.dataset.step);
    currentStep = (currentStep + 1) % images.length;

    img.src = images[currentStep];
    img.dataset.step = currentStep;
    countBadge.textContent = currentStep;

    // Sauvegarde de l'état dans localStorage
    localStorage.setItem(`etat-${id}`, currentStep);
  });
});