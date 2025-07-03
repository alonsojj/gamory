import { hideAllLoader } from "./global/loader.js";
const stars = document.querySelectorAll(".star");
let currentRating = 0;

stars.forEach((star) => {
  star.addEventListener("click", () => {
    currentRating = star.dataset.value;
    updateStars(currentRating);
  });
});

function updateStars(rating) {
  stars.forEach((star) => {
    if (star.dataset.value <= rating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

function getStarsHTML(rate) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star${i <= rate ? " selected" : ""}">&#9733;</span>`;
  }
  return html;
}

function createCommentElement(username, rate, profileImg, content) {
  const comment = document.createElement("div");
  comment.classList.add("comment-box");

  comment.innerHTML = `
    <div class="comment-header">
      <img src="${profileImg}" alt="Foto de ${username}" class="comment-avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;margin-right:8px;vertical-align:middle;">
      <span class="comment-username">${username}</span>
      <span class="comment-stars" style="margin-left:8px;">${getStarsHTML(
        rate
      )}</span>
    </div>
    <div class="comment-content">${content}</div>
  `;

  return comment;
}

document.addEventListener("DOMContentLoaded", () => {
  const reviewBtn = document.querySelector(".review-box .submit-review-btn");
  if (reviewBtn) {
    reviewBtn.addEventListener("click", async () => {
      const textArea = document.querySelector(".review-text");
      const text = textArea.value.trim();
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (!id) return;
      if (currentRating >= 0 && currentRating <= 5) {
        try {
          const resp = await fetch("http://localhost:8000/api/rate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameId: id,
              score: currentRating,
              commentary: text,
            }),
            credentials: "include",
          });
          if (resp.ok) {
            const commentsList = document.getElementById("commentsList");
            const username = "Você";
            const profileImg = "/assets/images/home/default-profile.jpg";
            const commentEl = createCommentElement(
              username,
              currentRating,
              profileImg,
              text
            );
            if (commentsList && text) commentsList.prepend(commentEl);
            textArea.value = "";
            currentRating = 0;
            updateStars(0);
          }
          console.log("Eu tentei");
        } catch (e) {}
      }
    });
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    hideAllLoader();
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/api/games?id=${id}`);
    if (!res.ok) throw new Error("Jogo não encontrado");
    const data = await res.json();
    const game = Array.isArray(data) ? data[0] : data;
    if (!game || !game.id) throw new Error("Jogo não encontrado");

    document.querySelector(".game-title").textContent = game.name || "Jogo";
    const descricao = game.summary || "Sem descrição.";
    document.querySelector(".game-description").textContent = descricao;
    let gameImg = document.querySelector(".game-image");
    console.log("coverUrl:", game.coverUrl);
    gameImg.alt = `Capa de ${game.name}`;
    gameImg.src = game.coverUrl;
    if (game.bannerUrl) {
      document.body.style.background = `url('${game.bannerUrl}') no-repeat center center/cover`;
    }
    console.log(game);

    const rateRes = await fetch(`http://localhost:8000/api/rate?gameId=${id}`);
    if (rateRes.ok) {
      const ratings = await rateRes.json();
      const commentsList = document.getElementById("commentsList");
      commentsList.innerHTML = "";
      if (Array.isArray(ratings) && ratings.length > 0) {
        const avg = (
          ratings.reduce((a, b) => a + (b.rating || 0), 0) / ratings.length
        ).toFixed(1);
        const ratingDiv = document.createElement("div");
        ratingDiv.textContent = `Média dos usuários: ${avg} / 5 (${ratings.length} avaliações)`;
        ratingDiv.style.color = "#FFD700";
        ratingDiv.style.fontWeight = "bold";
        document.querySelector(".game-title").after(ratingDiv);
        ratings.forEach((rate) => {
          const username = rate.user || "Usuário";
          const profileImg =
            rate.profileImg || "/assets/images/home/default-profile.jpg";
          const commentEl = createCommentElement(
            username,
            rate.rating,
            profileImg,
            rate.comment
          );
          commentsList.appendChild(commentEl);
        });
      }
    }
    hideAllLoader();
  } catch (err) {
    console.log(err);
    document.querySelector(".game-title").textContent = "Jogo não encontrado";
    document.querySelector(".game-description").textContent = err.message;
    const img = document.querySelector(".game-image");
    if (img) img.src = "";
    const commentsList = document.getElementById("commentsList");
    if (commentsList) commentsList.innerHTML = "";
    hideAllLoader();
  }
});

function toggleReviewBox() {
  const box = document.getElementById("reviewBox");
  box.style.display = box.style.display === "none" ? "flex" : "none";
}
document
  .querySelector(".toggle-review-btn")
  .addEventListener("click", toggleReviewBox);
