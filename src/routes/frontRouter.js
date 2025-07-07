import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { authFront } from "../middlewares/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(
  "/assets",
  express.static(path.join(__dirname, "../../../gamory-site/assets"))
);
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../gamory-site/pages/login.html"));
});
router.get("/sobre", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../gamory-site/pages/sobre.html"));
});
router.get("/perfil", authFront, (req, res) => {
  res.sendFile(path.join(__dirname, "../../../gamory-site/pages/perfil.html"));
});
router.get("/perfil/edit", authFront, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../../gamory-site/pages/editPerfil.html")
  );
});
router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../gamory-site/pages/home.html"));
});
router.get("/cadastro", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../../gamory-site/pages/cadastro.html")
  );
});
router.get("/game", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../../gamory-site/pages/description.html")
  );
});
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../gamory-site/index.html"));
});
router.get("/search", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../../gamory-site/pages/search_results.html")
  );
});
export default router;
