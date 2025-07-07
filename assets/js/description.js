import { hideAllLoader } from "./global/loader.js";

const stars = document.querySelectorAll(".star");
let currentRating = 0;

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

function createCommentElement(
  username,
  rate,
  profileImg,
  content,
  rateObj = {}
) {
  const comment = document.createElement("div");
  comment.classList.add("comment-box");
  const likeCount = rateObj.likes || 0;
  const liked = rateObj.likedByCurrentUser ? "liked" : "";
  const rateUserId = rateObj.userId || rateObj.rateUserId || "";
  const gameId = rateObj.gameId || "";
  const userId = rateObj.userId || rateObj.rateUserId || "";
  comment.innerHTML = `
  <div class="comment">
    <div class="comment-header">
      <img src="${profileImg}" alt="Foto de ${username}" class="comment-avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;margin-right:8px;vertical-align:middle;">
      <span class="comment-username" data-user-id="${userId}" style="cursor:pointer;text-decoration:underline;">${username}</span>
      <span class="comment-stars" style="margin-left:8px;">${getStarsHTML(
        rate
      )}</span>
    </div>
    <div class="comment-content">${content}</div>
    <div class="comment-actions">
    <span class="like-count">${likeCount} - </span>
      <button class="like-btn ${liked}" data-rate-user-id="${rateUserId}" data-game-id="${gameId}" title="Curtir comentário">${
    liked ? "❤️ Curtido" : "❤️ Curtir"
  }</button>
    </div>
    <div class="reply-box" style="display: none;">
      <textarea placeholder="Escreva sua resposta..."></textarea>
      <button class="send-reply-btn">Responder</button>
    </div>
  </div>
  `;
  const usernameSpan = comment.querySelector(".comment-username");
  if (usernameSpan && userId) {
    usernameSpan.addEventListener("click", function () {
      window.location.href = `/perfil?id=${userId}`;
    });
  }
  return comment;
}

function toggleReviewBox() {
  const box = document.getElementById("reviewBox");
  box.style.display = box.style.display === "none" ? "flex" : "none";
}

function initStarRating() {
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      currentRating = star.dataset.value;
      updateStars(currentRating);
    });
  });
}

function addLikeAndReplyListeners(commentEl) {
  const likeBtn = commentEl.querySelector(".like-btn");
  if (likeBtn) {
    likeBtn.addEventListener("click", async function () {
      const rateUserId = this.getAttribute("data-rate-user-id");
      const gameId = this.getAttribute("data-game-id");
      const actions = this.closest(".comment-actions");
      const likeCountSpan = actions
        ? actions.querySelector(".like-count")
        : null;
      const liked = this.classList.contains("liked");
      try {
        console.log(
          "Liking rate for gameId:",
          gameId,
          "and rateUserId:",
          rateUserId
        );
        const resp = await fetch(
          `http://localhost:8000/api/rate/${gameId}/like`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rateUserId }),
            credentials: "include",
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data.message === "Liked rate") {
            this.classList.add("liked");
            this.textContent = "❤️ Curtido";
            if (likeCountSpan) {
              likeCountSpan.textContent =
                parseInt(likeCountSpan.textContent) + 1 + " - ";
            }
          } else if (data.message === "Unliked rate") {
            this.classList.remove("liked");
            this.textContent = "❤️ Curtir";
            if (likeCountSpan) {
              likeCountSpan.textContent =
                Math.max(0, parseInt(likeCountSpan.textContent) - 1) + " - ";
            }
          }
        }
      } catch (e) {}
    });
  }
  const replyBtn = commentEl.querySelector(".reply-btn");
  if (replyBtn) {
    replyBtn.addEventListener("click", function () {
      const comment = replyBtn.closest(".comment");
      if (!comment) return;
      const replyBox = comment.querySelector(".reply-box");
      if (replyBox) {
        replyBox.style.display =
          replyBox.style.display === "none" ? "flex" : "none";
      }
    });
  }
}

function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.userId ? user.userId : null;
  } catch {
    return null;
  }
}

function initReviewButton() {
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
          const resp = await fetch(`http://localhost:8000/api/rate/${id}`, {
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
            let profileImg;
            const userId = getCurrentUserId();
            try {
              const response = await axios.get(
                `http://localhost:8000/api/user/${userId}?friendship=true`,
                {
                  withCredentials: true,
                }
              );
              profileImg = response.data.profileImg;
            } catch (err) {
              profileImg = "/assets/images/home/default-profile.jpg";
            }
            const rateObj = {
              userId,
              gameId: id,
              profileImg,
              likes: 0,
              likedByCurrentUser: false,
            };
            const commentEl = createCommentElement(
              username,
              currentRating,
              profileImg,
              text,
              rateObj
            );
            if (commentsList && text) {
              commentsList.prepend(commentEl);
              addLikeAndReplyListeners(commentEl);
            }
            textArea.value = "";
            currentRating = 0;
            updateStars(0);
          }
        } catch (e) {}
      }
    });
  }
}

async function loadGameAndComments() {
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
    gameImg.alt = `Capa de ${game.name}`;
    gameImg.src = game.coverUrl;
    if (game.bannerUrl) {
      document.body.style.background = `url('${game.bannerUrl}') no-repeat center center/cover`;
    }
    const rateRes = await fetch(`http://localhost:8000/api/rate?gameId=${id}`);
    if (rateRes.ok) {
      const ratings = await rateRes.json();
      const commentsList = document.getElementById("commentsList");
      commentsList.innerHTML = "";
      if (Array.isArray(ratings) && ratings.length > 0) {
        const avg = (
          ratings.reduce((a, b) => a + (b.rating || 0), 0) / ratings.length
        ).toFixed(1);
        if (game.averageRating !== undefined && game.averageRating !== null) {
          const ratingDiv = document.createElement("div");
          ratingDiv.textContent = `Média dos usuários: ${
            game.averageRating
          } / 5 (${game.totalRatings || 0} avaliações)`;
          ratingDiv.style.color = "#FFD700";
          ratingDiv.style.fontWeight = "bold";
          document.querySelector(".game-title").after(ratingDiv);
        }
        ratings.forEach((rate) => {
          const username = rate.user || "Usuário";
          const profileImg =
            rate.photo || "/assets/images/home/default-profile.jpg";
          const commentEl = createCommentElement(
            username,
            rate.rating,
            profileImg,
            rate.comment,
            rate
          );
          commentsList.appendChild(commentEl);
          addLikeAndReplyListeners(commentEl);
        });
      }
    }
    hideAllLoader();
  } catch (err) {
    document.querySelector(".game-title").textContent = "Jogo não encontrado";
    document.querySelector(".game-description").textContent = err.message;
    const img = document.querySelector(".game-image");
    if (img) img.src = "";
    const commentsList = document.getElementById("commentsList");
    if (commentsList) commentsList.innerHTML = "";
    hideAllLoader();
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  document
    .querySelector(".toggle-review-btn")
    .addEventListener("click", toggleReviewBox);
  initStarRating();
  initReviewButton();
  await loadGameAndComments();
});
