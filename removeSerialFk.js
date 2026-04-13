const { pool } = require("./src/config/database");

async function runMigration() {
  try {
    console.log(
      "Running migration: Remove foreign key constraint on serial_no...",
    );

    // Drop the foreign key constraint
    const dropFkSql =
      "ALTER TABLE complaints DROP FOREIGN KEY complaints_ibfk_2";

    await pool.execute(dropFkSql);

    console.log("✓ Migration completed successfully!");
    console.log("Foreign key constraint on serial_no has been removed.");
    console.log(
      "Complaints can now be created without a valid serial_no in serial_registry.",
    );
    process.exit(0);
  } catch (err) {
    console.error("✗ Migration failed:", err.message);
    process.exit(1);
  }
}

runMigration();
