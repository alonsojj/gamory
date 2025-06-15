document.addEventListener('DOMContentLoaded', function () {
    const cadastroLink = document.getElementById('cadastro-link');

    if (cadastroLink) {
        cadastroLink.addEventListener('click', function (event) {
            event.preventDefault();  // Evita comportamento padrão
            window.location.href = 'cadastro.html'; // Redireciona para o cadastro
        });
    }
});
