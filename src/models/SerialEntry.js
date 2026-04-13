const { getOne, getAll, insertOne, updateOne } = require("../config/database");

class SerialEntry {
  static async findBySerialNo(serialNo) {
    return getOne("SELECT * FROM serial_registry WHERE serial_no = ?", [
      serialNo,
    ]);
  }

  static async getAll(limit = 50, offset = 0) {
    const safeLimit = Number(limit) || 50;
    const safeOffset = Number(offset) || 0;
    return getAll(
      `SELECT * FROM serial_registry ORDER BY warranty_expiry DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      [],
    );
  }

  static async create(data) {
    const result = await insertOne(
      `INSERT INTO serial_registry (
        serial_no, model, manufacturer, purchase_date, warranty_expiry, status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.serialNo,
        data.model,
        data.manufacturer,
        data.purchaseDate,
        data.warrantyExpiry,
        "active",
      ],
    );
    return this.findBySerialNo(data.serialNo);
  }

  static async update(serialNo, data) {
    const fields = Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(", ");
    const values = [...Object.values(data), serialNo];
    await updateOne(
      `UPDATE serial_registry SET ${fields} WHERE serial_no = ?`,
      values,
    );
    return this.findBySerialNo(serialNo);
  }

  static async delete(serialNo) {
    return updateOne("DELETE FROM serial_registry WHERE serial_no = ?", [
      serialNo,
    ]);
  }

  static async validateWarranty(serialNo) {
    const serial = await this.findBySerialNo(serialNo);
    if (!serial) return { status: "not-found", entry: null };

    const warrantyExpiry = new Date(serial.warranty_expiry);
    const today = new Date();
    const isExpired = warrantyExpiry < today;

    return {
      status: isExpired ? "expired" : "valid",
      entry: serial,
    };
  }
}

module.exports = SerialEntry;
