const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const {
  validate,
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} = require("../utils/validators");

// Public routes
router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken,
);

// Protected routes
router.get("/me", auth, authController.getMe);
router.post("/logout", auth, authController.logout);

module.exports = router;
