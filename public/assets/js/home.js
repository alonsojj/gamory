import { hideLoader } from "./global/loader.js";

const carouselState = {
  "popular-container": {
    currentIndex: 0,
    itemsPerView: 0,
    games: [],
  },
  "upcoming-container": {
    currentIndex: 0,
    itemsPerView: 0,
    games: [],
  },
  "recently-rated-container": {
    currentIndex: 0,
    itemsPerView: 0,
    games: [],
  },
};

function calculateItemsPerView(carousel) {
  const carouselWidth = carousel.offsetWidth;
  const itemWidth = 264;
  const gap = 24;
  return Math.max(1, Math.floor((carouselWidth - 80) / (itemWidth + gap)));
}

function renderCarousel(carousel) {
  const state = carouselState[carousel.id];
  const games = state.games;
  const track = carousel.querySelector(".carousel-track");
  if (!track) {
    track = document.createElement("div");
    track.className = "carousel-track";
    carousel.appendChild(track);
  }
  track.innerHTML = "";
  if (games.length === 0) {
    track.innerHTML = '<div class="no-games">Nenhum jogo encontrado</div>';
    return;
  }

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const item = document.createElement("div");
    item.className = "carousel-item";
    item.onclick = () => {
      window.location.href = `/game?id=${game.id}`;
    };
    if (game.coverUrl) {
      const img = document.createElement("img");
      img.src = game.coverUrl;
      img.alt = game.name;
      item.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "placeholder";
      placeholder.style.backgroundColor = "#333";
      placeholder.style.height = "264px";
      placeholder.style.width = "100%";
      placeholder.style.borderRadius = "10px";
      placeholder.style.display = "flex";
      placeholder.style.alignItems = "center";
      placeholder.style.justifyContent = "center";
      placeholder.style.color = "#999";
      placeholder.textContent = "Imagem não disponível";
      item.appendChild(placeholder);
    }
    const title = document.createElement("div");
    title.className = "carousel-item-title";
    title.textContent = game.name;
    item.appendChild(title);
    if (game.averageRating !== undefined && game.averageRating !== null) {
      const avgRating = document.createElement("div");
      avgRating.className = "carousel-item-rating";
      avgRating.textContent = `★ ${game.averageRating} (${game.totalRatings || 0})`;
      item.appendChild(avgRating);
    }
    track.appendChild(item);
  }
  updateTrackPosition(carousel);
}

function updateTrackPosition(carousel) {
  const state = carouselState[carousel.id];
  const track = carousel.querySelector(".carousel-track");
  if (!track) return;

  const items = track.querySelectorAll(".carousel-item");
  if (items.length === 0) return;

  const itemWidth = items[0].offsetWidth;
  const gap = 24;
  const offset = (itemWidth + gap) * state.currentIndex;

  track.style.transform = `translateX(-${offset}px)`;
}

function updateItemsPerViewAndRender(carousel) {
  const state = carouselState[carousel.id];
  state.itemsPerView = calculateItemsPerView(carousel);
  state.currentIndex = Math.min(
    state.currentIndex,
    Math.max(0, state.games.length - state.itemsPerView)
  );
  renderCarousel(carousel);
}
async function initPopularGames() {
  const carousel = document.querySelector("#popular-container");
  try {
    let games = [];
    const res = await fetch(`/api/games/popular?limit=30`);
    if (!res.ok) throw new Error("Erro ao buscar jogos populares");
    games = await res.json();
    carouselState[carousel.id].games = games;
    updateItemsPerViewAndRender(carousel, games);
  } catch (err) {
    carousel.textContent = "Erro ao carregar jogos populares.";
    console.log(err);
  }
  hideLoader(carousel);
}
async function initUpcomingGames() {
  const carousel = document.querySelector("#upcoming-container");
  try {
    let games = [];
    const res = await fetch(
      `/api/games/upcoming?limit=30`
    );
    if (!res.ok) throw new Error("Erro ao buscar jogos populares");
    games = await res.json();
    carouselState[carousel.id].games = games;
    updateItemsPerViewAndRender(carousel, games);
  } catch (err) {
    carousel.textContent = "Erro ao carregar jogos populares.";
    console.log(err);
  }
  hideLoader(carousel);
}
async function initRecentlyRatedGames() {
  const carousel = document.querySelector("#recently-rated-container");
  try {
    let games = [];
    const res = await fetch(`/api/games/recently-rated`);
    if (!res.ok) throw new Error("Erro ao buscar jogos recentemente avaliados");
    games = await res.json();
    carouselState[carousel.id].games = games;
    updateItemsPerViewAndRender(carousel, games);
  } catch (err) {
    carousel.textContent = "Erro ao carregar jogos recentemente avaliados.";
    console.log(err);
  }
  hideLoader(carousel);
}

document.addEventListener("DOMContentLoaded", async () => {
  const carousels = document.querySelectorAll(".carousel-container");
  await initPopularGames();
  await initUpcomingGames();
  await initRecentlyRatedGames();
  document.querySelectorAll(".carousel-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const carousel = this.closest(".carousel-container");
      const state = carouselState[carousel.id];

      if (this.classList.contains("left")) {
        state.currentIndex = Math.max(
          0,
          state.currentIndex - state.itemsPerView
        );
      } else {
        const maxIndex = Math.max(0, state.games.length - state.itemsPerView);
        state.currentIndex = Math.min(
          state.currentIndex + state.itemsPerView,
          maxIndex
        );
      }

      updateTrackPosition(carousel);
    });
  });

  window.addEventListener("resize", () => {
    carousels.forEach((carousel) => {
      const state = carouselState[carousel.id];
      if (state.games.length > 0) {
        updateItemsPerViewAndRender(carousel, state.games);
      }
    });
  });
});
