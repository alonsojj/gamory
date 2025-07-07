// Typing Effect
const texts = ["Explore", "Descubra", "Jogue", "Conquiste"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
  if (count === texts.length) {
    count = 0;
  }
  currentText = texts[count];
  letter = currentText.slice(0, ++index);

  document.querySelector(".typing").textContent = letter;
  if (letter.length === currentText.length) {
    count++;
    index = 0;
    setTimeout(type, 1000);
  } else {
    setTimeout(type, 150);
  }
})();

document.getElementById("loginBtn").addEventListener("click", function () {
  window.location.href = "login.html";
});

document.getElementById("cadastroBtn").addEventListener("click", function () {
  window.location.href = "cadastro.html";
});
