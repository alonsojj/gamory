document
  .getElementById("cadastro-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const birthdate = document.getElementById("birthdate").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const nickname = document.getElementById("nickname").value.trim();
    const gender = document.querySelector(
      'input[name="gender"]:checked'
    )?.value;

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/register", {
        firstName,
        lastName,
        birthdate,
        email,
        password,
        nickname,
        gender,
      });
      alert("Cadastro realizado com sucesso!");
      window.location.href = "login";
    } catch (err) {
      alert("Erro ao cadastrar: " + (err.response?.data?.error || err.message));
    }
  });
