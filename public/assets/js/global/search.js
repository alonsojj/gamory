const searchInput = document.querySelector('input[name="busca"]');
const Menu = document.getElementById("menu");
const resultsList = document.getElementById("search-results");
let debounceTimeout;

searchInput.addEventListener("input", function () {
  clearTimeout(debounceTimeout);
  const query = this.value.trim();
  if (!query) {
    Menu.style.display = "none";
    resultsList.innerHTML = "";
    return;
  }
  debounceTimeout = setTimeout(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/games?name=${encodeURIComponent(query)}`
      );
      const games = res.data;
      if (Array.isArray(games) && games.length > 0) {
        resultsList.innerHTML = games
          .map(
            (game) =>
              `<li onclick="window.location.href='/game?id=${game.id}'">` +
              (game.coverUrl ? `<img src='${game.coverUrl}' alt='Capa'>` : "") +
              `<span>${game.name}</span></li>`
          )
          .join("");
        Menu.style.display = "block";
      } else {
        resultsList.innerHTML = "<li>Nenhum jogo encontrado</li>";
        Menu.style.display = "block";
      }
    } catch (err) {
      resultsList.innerHTML = "<li>Erro ao buscar jogos</li>";
      Menu.style.display = "block";
    }
  }, 400);
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = this.value.trim();
    if (query) {
      window.location.href = `/search?query=${encodeURIComponent(query)}`;
    }
  }
});

document.addEventListener("click", function (e) {
  if (!Menu.contains(e.target) && e.target !== searchInput) {
    Menu.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector(".logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          window.location.href = "/login";
        } else {
          const errorData = await response.json();
          console.error("Erro ao fazer logout:", errorData.error);
          alert("Erro ao fazer logout. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro de rede ao fazer logout:", error);
        alert("Erro de conexão. Verifique sua internet.");
      }
    });
  }
});
