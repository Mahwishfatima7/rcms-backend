const User = require("./src/models/User");
const { hashPassword } = require("./src/utils/password");
(async () => {
  const password = "Test123!";
  const passwordHash = await hashPassword(password);
  const existing = await User.findByEmail("tempadmin@local.test");
  if (existing) {
    console.log(JSON.stringify({ message: 'already exists', email: existing.email }, null,2));
    return;
  }
  const user = await User.create({
    name: "Temp Admin",
    email: "tempadmin@local.test",
    passwordHash,
    role: "admin",
    phone: "+0000000000",
    department: "DevOps",
  });
  console.log(JSON.stringify({ user, password }, null, 2));
})();
