const track = document.querySelector('.carousel-track');
const items = Array.from(track.children);
const nextButton = document.querySelector('.carousel-button.next');
const prevButton = document.querySelector('.carousel-button.prev');

let currentIndex = 0;

function updateCarousel() {
    const itemWidth = items[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
});

window.addEventListener('resize', updateCarousel);

// ---- Récupération dynamique depuis Google Sheet ----
const sheetID = "gid=0";
const sheetURL = `https://spreadsheets.google.com/feeds/cells/${sheetID}/1/public/full?alt=json`;

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    const entries = [];
    const cells = data.feed.entry;
    let currentRow = [];
    let rowNumber = 1;

    cells.forEach(cell => {
        const r = parseInt(cell.gs$cell.row);
        if (r !== rowNumber) {
            entries.push(currentRow);
            currentRow = [];
            rowNumber = r;
        }
        currentRow.push(cell.gs$cell.$t);
    });
    entries.push(currentRow);

    // Créer les carousel-items dynamiquement
    entries.forEach(row => {
        if (row.length === 0) return;
        const item = document.createElement('div');
        item.className = "carousel-item";

        // [0]=image, [1]=titre, [2]=texte, [3]=lien
        item.innerHTML = `
            <img src="${row[0]}" alt="image veille">
            <h3>${row[1]}</h3>
            <p>${row[2]}</p>
            <a href="${row[3]}" target="_blank">Lien pour en savoir plus</a>
        `;
        track.appendChild(item);
    });

    // Après création, mettre à jour le tableau des items et afficher
    items = Array.from(track.children);
    updateCarousel();
  });