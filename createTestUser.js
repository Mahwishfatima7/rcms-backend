const User = require("./src/models/User");
const { hashPassword } = require("./src/utils/password");
(async () => {
  const password = "test123";
  const passwordHash = await hashPassword(password);
  const existing = await User.findByEmail("test@example.com");
  if (existing) {
    console.log("User already exists");
    return;
  }
  const user = await User.create({
    name: "Test Admin",
    email: "test@example.com",
    passwordHash,
    role: "admin",
    phone: "+1234567890",
    department: "Testing",
  });
  console.log("Created user:", user.email, "password:", password);
})();
