const params = new URLSearchParams(window.location.search);
const pageUserId = params.get("id") || getLocalUserId();
const isOwnProfile = !params.get("id") || params.get("id") === getLocalUserId();

function getLocalUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.userId ? user.userId : null;
  } catch {
    return null;
  }
}
function renderDiv(amigo) {
  const amigoDiv = document.createElement("div");
  amigoDiv.className = "amigo-item";
  const img = document.createElement("img");
  img.src = amigo.profileImg || "/assets/images/profile/default_profile.jpg";
  img.alt = amigo.nickname;
  img.className = "amigo-avatar";
  const span = document.createElement("span");
  span.textContent = amigo.nickname;
  amigoDiv.appendChild(img);
  amigoDiv.appendChild(span);
  amigoDiv.onclick = () => (window.location.href = `/perfil?id=${amigo.id}`);

  return amigoDiv;
}
function renderAmigos(user) {
  const abaAmigos = document.querySelector(".aba-amigos");
  const abaPendReceb = document.querySelector(".aba-pendentes-recebidos");
  const abaPendEnv = document.querySelector(".aba-pendentes-enviados");
  const abaAmigosBnt = document.querySelector(".aba-amigos-bnt");
  const abaPendRecebBnt = document.querySelector(
    ".aba-pendentes-recebidos-bnt"
  );
  const abaPendEnvBnt = document.querySelector(".aba-pendentes-enviados-bnt");
  const lista = {
    accept: [],
    received: [],
    sent: [],
  };
  if (user.sentFriends && user.sentFriends.length > 0) {
    user.sentFriends.forEach((f) => {
      if (f.Friend.status === "accepted") lista.accept.push(f);
      else if (f.Friend.status === "pending") lista.sent.push(f);
    });
  }

  if (user.receivedFriends && user.receivedFriends.length > 0) {
    user.receivedFriends.forEach((f) => {
      if (f.Friend.status === "accepted") {
        lista.accept.push(f);
      } else if (f.Friend.status === "pending") {
        lista.received.push(f);
      }
    });
  }
  if (lista.accept.length === 0) {
    abaAmigos.textContent = "Nenhum encontrado.";
  }
  if (lista.received.length === 0) {
    abaPendReceb.textContent = "Nenhum encontrado.";
  }
  if (lista.sent.length === 0) {
    abaPendEnv.textContent = "Nenhum encontrado.";
  }

  lista.accept?.forEach((amigo) => {
    const amigoDiv = renderDiv(amigo);
    abaAmigos.appendChild(amigoDiv);
  });
  lista.received?.forEach((amigo) => {
    const amigoDiv = renderDiv(amigo);
    if (getLocalUserId() == user.id) {
      const aceitarBtn = document.createElement("button");
      aceitarBtn.textContent = "Aceitar";
      aceitarBtn.onclick = async (e) => {
        e.stopPropagation();
        await axios.put(
          "http://localhost:8000/api/user/me/friendships",
          { friendId: amigo.id, status: "accepted" },
          { withCredentials: true }
        );
        alert("Amizade aceita!");
        window.location.reload();
      };
      const rejeitarBtn = document.createElement("button");
      rejeitarBtn.textContent = "Rejeitar";
      rejeitarBtn.onclick = async (e) => {
        e.stopPropagation();
        await axios.put(
          "http://localhost:8000/api/user/me/friendships",
          { friendId: amigo.id, status: "rejected" },
          { withCredentials: true }
        );
        alert("Amizade rejeitada!");
        window.location.reload();
      };
      amigoDiv.appendChild(aceitarBtn);
      amigoDiv.appendChild(rejeitarBtn);
    }
    abaPendReceb.appendChild(amigoDiv);
  });
  lista.sent?.forEach((amigo) => {
    const amigoDiv = renderDiv(amigo);
    abaPendEnv.appendChild(amigoDiv);
  });

  abaAmigosBnt.onclick = () => {
    abaAmigos.classList.add("aba-ativa");
    abaPendReceb.classList.remove("aba-ativa");
    abaPendEnv.classList.remove("aba-ativa");
    abaAmigosBnt.classList.add("aba-ativa");
    abaPendRecebBnt.classList.remove("aba-ativa");
    abaPendEnvBnt.classList.remove("aba-ativa");
  };
  abaPendRecebBnt.onclick = () => {
    abaAmigos.classList.remove("aba-ativa");
    abaPendReceb.classList.add("aba-ativa");
    abaPendEnv.classList.remove("aba-ativa");
    abaAmigosBnt.classList.remove("aba-ativa");
    abaPendRecebBnt.classList.add("aba-ativa");
    abaPendEnvBnt.classList.remove("aba-ativa");
  };
  abaPendEnvBnt.onclick = () => {
    abaAmigos.classList.remove("aba-ativa");
    abaPendReceb.classList.remove("aba-ativa");
    abaPendEnv.classList.add("aba-ativa");
    abaAmigosBnt.classList.remove("aba-ativa");
    abaPendRecebBnt.classList.remove("aba-ativa");
    abaPendEnvBnt.classList.add("aba-ativa");
  };
}
async function fetchUser(userId) {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/user/${userId}?friendship=true`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    alert("Erro ao buscar dados do usuário.");
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

async function fetchUserRatedGames(userId) {
  try {
    if (!userId) return [];
    const response = await axios.get(
      `http://localhost:8000/api/rate?userId=${userId}&expand=game`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar jogos avaliados:", error);
    return [];
  }
}

async function addFriend(friendId) {
  try {
    await axios.post(
      "http://localhost:8000/api/user/me/friendships",
      { friendId },
      { withCredentials: true }
    );
    alert("Pedido de amizade enviado!");
    window.location.reload();
  } catch (error) {
    alert("Erro ao adicionar amigo.");
  }
}
function renderPerfil(user) {
  const name = document.querySelector(".nome");
  const img = document.querySelector(".profile img");
  const biographyElement = document.getElementById("user-biography");
  name.textContent = user.nickname;
  img.src = user.profileImg;
  biographyElement.textContent = user.biography || "Nenhuma biografia disponível.";
}
document.addEventListener("DOMContentLoaded", async function () {
  const user = await fetchUser(pageUserId);
  renderPerfil(user);
  const amigosBtn = document.querySelector(".amigos");
  const amigosMenu = document.getElementById("amigos-menu");
  if (amigosBtn && amigosMenu) {
    amigosBtn.addEventListener("click", async () => {
      if (amigosMenu.style.display === "flex") {
        return (amigosMenu.style.display = "none");
      } else return (amigosMenu.style.display = "flex");
    });
  }
  renderAmigos(user);
  const actionDiv = document.querySelector(".action");
  if (actionDiv) {
    const editBtn = actionDiv.querySelector('a[href="/perfil/edit"]');
    if (!isOwnProfile && editBtn) editBtn.remove();
    if (!isOwnProfile && !actionDiv.querySelector(".add-friend-btn")) {
      const addBtn = document.createElement("button");
      let text = "Adicionar amigo";
      console.log(user);
      console.log(user.relation);
      switch (user.relation) {
        case null:
          addBtn.onclick = () => addFriend(pageUserId);
          break;
        case "pending":
          text = "Pedido pendente";
          addBtn.disabled = true;
          break;
        case "accepted":
          text = "Amigos";
          addBtn.disabled = true;
          break;
        default:
          text = "Adicionar amigo";
          addBtn.onclick = () => addFriend(pageUserId);
          break;
      }
      addBtn.textContent = text;
      addBtn.className = "add-friend-btn";
      actionDiv.appendChild(addBtn);
    }
  }

  const jogosDiv = document.querySelector(".jogos");
  if (jogosDiv) {
    const ratedGames = await fetchUserRatedGames(pageUserId);
    jogosDiv.innerHTML = "";
    ratedGames.forEach((rate) => {
      if (rate.game && rate.game.coverUrl) {
        const img = document.createElement("img");
        img.src = rate.game.coverUrl;
        img.alt = rate.game.name;
        img.title = rate.game.name;
        img.addEventListener("click", () => {
          window.location.href = `/game?id=${rate.game.id}`;
        });
        jogosDiv.appendChild(img);
      }
    });
    if (jogosDiv.innerHTML === "") {
      jogosDiv.innerHTML =
        '<span style="color:#fff;">Nenhum jogo avaliado ainda.</span>';
    }
  }
});
