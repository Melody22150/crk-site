fetch("./includes/header_index.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    });

fetch("./assets/data/maj.json")
  .then(response => response.json())
  .then(data => {
    // On trie les cookies par date décroissante
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.querySelector(".cartes-cookies");
    data.forEach(cookie => {
      const link = document.createElement("a");
      link.href = cookie.link;

      const img = document.createElement("img");
      img.src = "./assets/images/" + cookie.image;
      img.alt = cookie.name;
      img.className = "carte-cookie";

      link.appendChild(img);
      container.appendChild(link);
    });
  });
