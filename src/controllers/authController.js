function loginHandler(req, res) {
  res.send("Rota de Login");
}
function registerHandler(req, res) {
  res.send("Rota de registro");
}

export { loginHandler, registerHandler };
