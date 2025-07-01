document.addEventListener("DOMContentLoaded", function () {
  const cadastroLink = document.getElementById("cadastro-link");

  if (cadastroLink) {
    cadastroLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "cadastro.html";
    });
  }

  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        window.location.href = "../home/home.html";
      } else {
        alert("Usuário ou senha inválidos.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  });
});
