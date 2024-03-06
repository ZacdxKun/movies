const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filmsDiv = document.getElementById('film');
const favoritefilmsDiv = document.getElementById('favoriteFilms');

// Récup les favs
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

searchBtn.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        try {
            const response = await fetch(`http://www.omdbapi.com/?s=${searchTerm}&apikey=ab2e7799`);
            const data = await response.json();

            if (data.Search) {
                filmsDiv.innerHTML = data.Search.map(film => `
                    <div class="film">
                        <h2>${film.Title}</h2>
                        <img src="${film.Poster}" alt="${film.Title} Poster">
                        <br> 
                        <button class="favoriteBtn" data-imdbid="${film.imdbID}">Favoris</button></br>
                    </div>
                `).join('');
            } else {
                filmsDiv.innerHTML = '<p>pas de films trouvés</p>';
            }
        } catch (error) {
            console.error('Erreur', error);
        }
    }
});

filmsDiv.addEventListener('click', async (event) => {
    if (event.target.classList.contains('favoriteBtn')) {
        const imdbID = event.target.getAttribute('data-imdbid');
        toggleFavorite(imdbID);
    }
});

function toggleFavorite(imdbID) {
    const index = favorites.indexOf(imdbID);
    if (index === -1) {
        // Ajt fav
        favorites.push(imdbID);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
        // retirer fav
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    displayFavorites();
}

function displayFavorites() {
    favoriteFilmsDiv.innerHTML = favorites.map(imdbID => `
        <div class="favoriteFilm">
            <h2>${imdbID}</h2>
            <button class="enleverBtn" data-imdbid="${imdbID}">retirer des favoris</button>
        </div>
    `).join('');

    const enleverBtns = document.querySelectorAll('.enleverBtn');
    enleverBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const imdbID = btn.getAttribute('data-imdbid');
            toggleFavorite(imdbID);
        });
    });
}

// Afficher les favoris initiaux
displayFavorites();