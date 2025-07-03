document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8000/api/user/me", { credentials: "include" })
    .then((res) => {
      if (res.status === 200) {
        window.location.href = "/home";
      }
    })
    .catch(() => {});
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        window.location.href = "/home";
      } else {
        alert("Usuário ou senha inválidos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  });
});
