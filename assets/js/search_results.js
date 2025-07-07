document.addEventListener("DOMContentLoaded", () => {
  const searchQuerySpan = document.getElementById("search-query");
  const gameResultsSection = document.getElementById("game-results");
  const userResultsSection = document.getElementById("user-results");
  const gameResultsGrid = gameResultsSection.querySelector(".results-grid");
  const userResultsList = userResultsSection.querySelector(".results-list");
  const showGamesButton = document.getElementById("show-games");
  const showUsersButton = document.getElementById("show-users");

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");

  if (query) {
    searchQuerySpan.textContent = query;
    fetchResults(query);
  }

  showGamesButton.addEventListener("click", () => {
    showGamesButton.classList.add("active");
    showUsersButton.classList.remove("active");
    gameResultsSection.classList.remove("hidden");
    userResultsSection.classList.add("hidden");
  });

  showUsersButton.addEventListener("click", () => {
    showUsersButton.classList.add("active");
    showGamesButton.classList.remove("active");
    userResultsSection.classList.remove("hidden");
    gameResultsSection.classList.add("hidden");
  });

  async function fetchResults(query) {
    try {
      const gamesRes = await axios.get(
        `http://localhost:8000/api/games?name=${encodeURIComponent(query)}`
      );
      const games = gamesRes.data;
      displayGames(games);

      const usersRes = await axios.get(
        `http://localhost:8000/api/user?nickname=${encodeURIComponent(query)}`
      );
      const users = usersRes.data;
      displayUsers(users);
    } catch (error) {
      console.error("Error fetching search results:", error);
      gameResultsGrid.innerHTML = "<p>Erro ao buscar jogos.</p>";
      userResultsList.innerHTML = "<p>Erro ao buscar usuários.</p>";
    }
  }

  function displayGames(games) {
    if (Array.isArray(games) && games.length > 0) {
      gameResultsGrid.innerHTML = games
        .map(
          (game) =>
            `<a class="game-card" href="games/"${game.id}>
              <img src="${
                game.coverUrl || "https://via.placeholder.com/150"
              }" alt="${game.name}">
              <h3>${game.name}</h3>
              ${game.averageRating !== undefined && game.averageRating !== null ? `<p>Avaliação Média: ${game.averageRating} (${game.totalRatings || 0} avaliações)</p>` : ''}
            </a>`
        )
        .join("");
    } else {
      gameResultsGrid.innerHTML = "<p>Nenhum jogo encontrado.</p>";
    }
  }

  function displayUsers(users) {
    if (Array.isArray(users) && users.length > 0) {
      userResultsList.innerHTML = users
        .map(
          (user) =>
            `<li>
              <a href="user/${user.id}">
              <img src="${
                user.profileImg || "https://via.placeholder.com/50"
              }" alt="${user.nickname}">
              <span>${user.nickname}</span>
              </a>
            </li>`
        )
        .join("");
    } else {
      userResultsList.innerHTML = "<p>Nenhum usuário encontrado.</p>";
    }
  }
});
