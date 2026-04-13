const User = require("../models/User");
const { comparePassword, hashPassword } = require("../utils/password");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login successful",
      data: { token, refreshToken, user: userWithoutPassword },
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "Email already registered" });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "agent",
      phone,
      department,
    });

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const { password_hash, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { token, refreshToken, user: userWithoutPassword },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.json({
    success: true,
    message: "Logout successful",
  });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, error: "Refresh token is required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: { token: newToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    next(err);
  }
};
