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
        if (response.data && response.data.userId) {
          localStorage.setItem(
            "user",
            JSON.stringify({ userId: response.data.userId })
          );
        } else {
          try {
            const me = await axios.get("http://localhost:8000/api/user/me", {
              withCredentials: true,
            });
            if (me.data && me.data.userId) {
              localStorage.setItem(
                "user",
                JSON.stringify({ userId: me.data.userId })
              );
            }
          } catch {}
        }
        window.location.href = "/home";
      } else {
        alert("Usuário ou senha inválidos.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Usuário ou senha inválidos.");
      } else {
        alert("Erro ao conectar com o servidor.");
      }
    }
  });
});
