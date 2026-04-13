const fs = require("fs");
const path = require("path");
const { pool } = require("./src/config/database");

async function runMigration() {
  try {
    console.log("Running migration: Make serial_no nullable...");

    const migrationSql =
      "ALTER TABLE complaints MODIFY COLUMN serial_no VARCHAR(50) NULL";

    await pool.execute(migrationSql);

    console.log("✓ Migration completed successfully!");
    console.log("serial_no column in complaints table is now nullable.");
    process.exit(0);
  } catch (err) {
    console.error("✗ Migration failed:", err.message);
    process.exit(1);
  }
}

runMigration();
