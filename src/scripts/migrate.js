const fs = require("fs");
const path = require("path");
const { pool } = require("../config/database");

const runMigrations = async () => {
  try {
    console.log("🔄 Running database migrations...");

    const schemaPath = path.join(__dirname, "../../sql/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    const connection = await pool.getConnection();
    await connection.multiQuery(schema);
    connection.release();

    console.log("✓ Migrations completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("✗ Migration failed:", err.message);
    process.exit(1);
  }
};

runMigrations();
