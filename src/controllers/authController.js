function loginHandler(req, res) {
  res.send("Rota de Login");
}
function resgisterHandler(req, res) {
  res.send("Rota de registro");
}

export default { loginHandler, registerHandler };
