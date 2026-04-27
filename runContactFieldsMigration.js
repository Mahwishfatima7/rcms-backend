const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected to database...');

    // Add contact_no column
    try {
      await connection.execute(
        'ALTER TABLE users ADD COLUMN contact_no VARCHAR(20) AFTER phone'
      );
      console.log('✓ Added contact_no column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ contact_no column already exists');
      } else {
        throw err;
      }
    }

    // Add emergency_contact column
    try {
      await connection.execute(
        'ALTER TABLE users ADD COLUMN emergency_contact VARCHAR(20) AFTER contact_no'
      );
      console.log('✓ Added emergency_contact column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ emergency_contact column already exists');
      } else {
        throw err;
      }
    }

    // Create index
    try {
      await connection.execute('CREATE INDEX idx_contact_no ON users(contact_no)');
      console.log('✓ Created index on contact_no');
    } catch (err) {
      if (err.code === 'ER_DUP_KEY_NAME') {
        console.log('✓ Index on contact_no already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Migration completed successfully!');
    await connection.end();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
