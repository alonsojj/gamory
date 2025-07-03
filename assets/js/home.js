import { hideAllLoader } from "./global/loader.js";

let currentIndex = 0;
let games = [];
let itemsPerView = 6;

function calculateItemsPerView() {
  const carousel = document.querySelector(".carousel");
  const gap = 20;
  if (!carousel) return 6;
  const minItemWidth = 231;
  const containerWidth = carousel.clientWidth || 1200;
  let count = Math.floor(containerWidth / (minItemWidth + gap));
  if (count < 1) count = 1;
  if (count > 8) count = 8;
  return count;
}

function renderCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  let track = carousel.querySelector(".carousel-track");
  if (!track) {
    track = document.createElement("div");
    track.className = "carousel-track";
    carousel.appendChild(track);
  }
  track.innerHTML = "";
  if (games.length === 0) return;

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
    }
    const title = document.createElement("div");
    title.className = "carousel-item-title";
    title.textContent = game.name;
    item.appendChild(title);
    track.appendChild(item);
  }
  updateTrackPosition();
}

function updateTrackPosition() {
  const track = document.querySelector(".carousel-track");
  if (!track) return;
  const itemWidth = track.querySelector(".carousel-item")?.offsetWidth || 264;
  const gap = 24;
  const offset = (itemWidth + gap) * currentIndex;
  track.style.transform = `translateX(-${offset}px)`;
}

function updateItemsPerViewAndRender() {
  itemsPerView = calculateItemsPerView();
  currentIndex = Math.floor(currentIndex / itemsPerView) * itemsPerView;
  renderCarousel();
}

document.addEventListener("DOMContentLoaded", async () => {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  function getMaxIndex() {
    return Math.max(0, games.length - itemsPerView);
  }

  try {
    const res = await fetch(`http://localhost:8000/api/games/popular?limit=30`);
    if (!res.ok) throw new Error("Erro ao buscar jogos populares");
    games = await res.json();
    updateItemsPerViewAndRender();
    hideAllLoader();
  } catch (err) {
    carousel.textContent = "Erro ao carregar jogos populares.";
  }

  document.querySelector(".carousel-btn.left").onclick = () => {
    if (games.length === 0) return;
    currentIndex = Math.max(0, currentIndex - itemsPerView);
    updateTrackPosition();
  };
  document.querySelector(".carousel-btn.right").onclick = () => {
    if (games.length === 0) return;
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex + itemsPerView, maxIndex);
    updateTrackPosition();
  };

  window.addEventListener("resize", () => {
    updateItemsPerViewAndRender();
  });
});
