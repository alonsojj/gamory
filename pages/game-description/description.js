const stars = document.querySelectorAll('.star');
let currentRating = 0;

stars.forEach(star => {
  star.addEventListener('click', () => {
    currentRating = star.dataset.value;
    updateStars(currentRating);
  });
});

function updateStars(rating) {
  stars.forEach(star => {
    if (star.dataset.value <= rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

function toggleReviewBox() {
  const box = document.getElementById('reviewBox');
  box.style.display = box.style.display === 'none' ? 'flex' : 'none';
}

function createCommentElement(username, photoURL, content) {
  const comment = document.createElement('div');
  comment.classList.add('comment-box');

  comment.innerHTML = `
    <div class="comment-header">
      <img src="${photoURL}" alt="Foto de ${username}">
      <span class="comment-username">${username}</span>
    </div>
    <div class="comment-content">${content}</div>
    <div class="comment-actions">
      <span class="like-btn">❤️ Curtir</span>
      <span class="reply-btn">Responder</span>
    </div>
    <div class="reply-box" style="display: none;">
      <textarea placeholder="Escreva sua resposta..."></textarea>
      <button class="send-reply-btn">Responder</button>
    </div>
  `;

  comment.querySelector('.reply-btn').addEventListener('click', () => {
    const box = comment.querySelector('.reply-box');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  });

  comment.querySelector('.send-reply-btn').addEventListener('click', () => {
    const replyText = comment.querySelector('.reply-box textarea').value.trim();
    if (replyText !== '') {
      const reply = document.createElement('div');
      reply.classList.add('reply-comment');

      reply.innerHTML = `
        <div class="comment-header">
          <img src="${photoURL}" alt="Foto de ${username}">
          <span class="comment-username">${username}</span>
        </div>
        <div class="comment-content">${replyText}</div>
      `;

      comment.appendChild(reply);
      comment.querySelector('.reply-box').style.display = 'none';
      comment.querySelector('.reply-box textarea').value = '';
    }
  });

  return comment;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.submit-review-btn').addEventListener('click', () => {
    const textArea = document.querySelector('.review-text');
    const text = textArea.value.trim();

    if (text) {
      const username = 'Usuário'; // backend futuramente
      const photo = 'https://via.placeholder.com/40'; // backend futuramente

      const newComment = createCommentElement(username, photo, text);
      document.getElementById('commentsList').appendChild(newComment);
      textArea.value = '';
    }
  });
});
