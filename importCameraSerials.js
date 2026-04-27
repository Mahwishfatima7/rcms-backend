const XLSX = require("xlsx");
const { query } = require("./src/config/database");

const importCameraSerials = async () => {
  try {
    console.log("Starting camera serials import...");

    // Read Excel file
    const excelPath = "C:\\Users\\mahwi\\Downloads\\DXB.xlsx";
    const workbook = XLSX.readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Found ${data.length} records to import`);

    // Insert data into database
    let successCount = 0;
    let errorCount = 0;

    for (const record of data) {
      try {
        const serial = record["Serial Number"];
        const itemNo = record["Item No."];
        const itemDescription = record["Item Description"];

        if (!serial || !itemNo || !itemDescription) {
          console.warn(`Skipping incomplete record:`, record);
          errorCount++;
          continue;
        }

        // Insert or update
        const sql = `
          INSERT INTO camera_serials (serial_number, item_no, item_description)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE item_no = ?, item_description = ?
        `;

        await query(sql, [serial, itemNo, itemDescription, itemNo, itemDescription]);

        successCount++;
        if (successCount % 100 === 0) {
          console.log(`Imported ${successCount} records...`);
        }
      } catch (err) {
        console.error(`Error importing record:`, record, err.message);
        errorCount++;
      }
    }

    console.log(`\nImport completed!`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

    // Verify
    const [results] = await query("SELECT COUNT(*) as total FROM camera_serials");
    console.log(`Total records in camera_serials table: ${results[0].total}`);
    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err);
    process.exit(1);
  }
};

importCameraSerials();
