// Typing Effect
const texts = ["Explore", "Descubra", "Jogue", "Conquiste"];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type(){
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    document.querySelector('.typing').textContent = letter;
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 1000); // espera depois da palavra
    } else {
        setTimeout(type, 150); // velocidade da digitação
    }
}());

// Abrir telas de Login e Cadastro
document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = "login.html"; // Troca pelo seu arquivo real
});

document.getElementById('cadastroBtn').addEventListener('click', function() {
    window.location.href = "cadastro.html"; // Troca pelo seu arquivo real
});
