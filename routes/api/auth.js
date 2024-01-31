const { Router, json } = require("express");
const AuthController = require("../../controllers/auth");

const router = Router();
const jsonParser = json();

const authMiddleware = require("../../middleware/authMiddleware");

router.post("/register", jsonParser, AuthController.register);

router.post("/login", jsonParser, AuthController.login);

router.post("/logout", jsonParser, authMiddleware, AuthController.logout);

router.get("/current", jsonParser, authMiddleware, AuthController.current);



module.exports = router;
