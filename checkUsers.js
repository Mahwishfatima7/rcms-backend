const { getAll } = require("./src/config/database");
(async () => {
  try {
    const users = await getAll("SELECT id, name, email, role FROM users");
    console.log("Users in database:");
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
