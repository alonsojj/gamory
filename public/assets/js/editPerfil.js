document.addEventListener("DOMContentLoaded", async () => {
  const profileForm = document.getElementById("profile-form");
  const nicknameInput = document.getElementById("nickname");
  const emailInput = document.getElementById("email");
  const oldPasswordInput = document.getElementById("senha");
  const newPasswordInput = document.getElementById("newPassword");
  const profileImgUrlInput = document.getElementById("profileImgUrl");
  const biographyTextarea = document.getElementById("biography");

  async function fetchUserData() {
    try {
      const response = await axios.get("/api/user/me", {
        withCredentials: true,
      });
      const user = response.data;

      nicknameInput.value = user.nickname || "";
      emailInput.value = user.email || "";
      biographyTextarea.value = user.biography || "";
      profileImgUrlInput.value = user.profileImg || "";
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Erro ao carregar dados do usuário.");
    }
  }

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedFields = {};
    if (nicknameInput.value !== "") {
      updatedFields.nickname = nicknameInput.value;
    }
    if (emailInput.value !== "") {
      updatedFields.email = emailInput.value;
    }
    if (biographyTextarea.value !== "") {
      updatedFields.biography = biographyTextarea.value;
    }
    if (profileImgUrlInput.value !== "") {
      updatedFields.profileImg = profileImgUrlInput.value;
    }

    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;

    if (Object.keys(updatedFields).length > 0) {
      try {
        const response = await axios.put(
          "/api/user/me",
          updatedFields,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          alert("Perfil atualizado com sucesso!");

          fetchUserData();
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert(
          "Erro ao atualizar perfil: " +
            (error.response?.data?.error || error.message)
        );
      }
    }

    if (oldPassword && newPassword) {
      try {
        const response = await axios.put(
          "/api/user/me/password",
          { oldPassword, newPassword },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          alert("Senha atualizada com sucesso!");
          oldPasswordInput.value = "";
          newPasswordInput.value = "";
        }
      } catch (error) {
        console.error("Error updating password:", error);
        alert(
          "Erro ao atualizar senha: " +
            (error.response?.data?.error || error.message)
        );
      }
    } else if (oldPassword || newPassword) {
      alert(
        "Para alterar a senha, preencha ambos os campos: Senha Atual e Nova Senha."
      );
    }
  });

  fetchUserData();
});
