const express = require("express");
const { signup, login } = require("../controller/authController");
const { authenticateToken } = require("../authJwt/jwtauth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
