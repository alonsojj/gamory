import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { authFront } from "../middlewares/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(
  "/assets",
  express.static(path.join(__dirname, "../../public/assets"))
);
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/pages/login.html"));
});
router.get("/sobre", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/pages/sobre.html"));
});
router.get("/perfil", authFront, (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/pages/perfil.html"));
});
router.get("/perfil/edit", authFront, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/editPerfil.html")
  );
});
router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/pages/home.html"));
});
router.get("/cadastro", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/cadastro.html")
  );
});
router.get("/game", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/description.html")
  );
});
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});
router.get("/search", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/pages/search_results.html")
  );
});
export default router;
