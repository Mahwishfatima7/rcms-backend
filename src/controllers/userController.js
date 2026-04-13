const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const users = await User.getAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: { users, total: users.length },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const { name, email, role, status, phone, department } = req.body;
    const updated = await User.update(req.params.id, {
      name,
      email,
      role,
      status,
      phone,
      department,
    });

    res.json({
      success: true,
      message: "User updated",
      data: { user: updated },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await User.delete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    next(err);
  }
};
