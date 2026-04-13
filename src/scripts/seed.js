const fs = require("fs");
const path = require("path");
const { pool } = require("../config/database");

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database with sample data...");

    const seedPath = path.join(__dirname, "../../sql/seed.sql");
    const seedData = fs.readFileSync(seedPath, "utf8");

    const connection = await pool.getConnection();
    await connection.query(seedData);
    connection.release();

    console.log("✓ Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("✗ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDatabase();
