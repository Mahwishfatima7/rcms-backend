const SerialEntry = require("../models/SerialEntry");

exports.validateSerial = async (req, res, next) => {
  try {
    const { serialNo } = req.params;
    const validation = await SerialEntry.validateWarranty(serialNo);

    res.json({
      success: true,
      data: {
        status: validation.status,
        serial: validation.entry,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getSerials = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const serials = await SerialEntry.getAll(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: { serials, total: serials.length },
    });
  } catch (err) {
    next(err);
  }
};

exports.getSerialByNo = async (req, res, next) => {
  try {
    const serial = await SerialEntry.findBySerialNo(req.params.serialNo);
    if (!serial) {
      return res
        .status(404)
        .json({ success: false, error: "Serial not found" });
    }

    res.json({
      success: true,
      data: { serial },
    });
  } catch (err) {
    next(err);
  }
};

exports.createSerial = async (req, res, next) => {
  try {
    const { serialNo, model, manufacturer, purchaseDate, warrantyExpiry } =
      req.body;

    const existing = await SerialEntry.findBySerialNo(serialNo);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "Serial already exists" });
    }

    const serial = await SerialEntry.create({
      serialNo,
      model,
      manufacturer,
      purchaseDate,
      warrantyExpiry,
    });

    res.status(201).json({
      success: true,
      message: "Serial created",
      data: { serial },
    });
  } catch (err) {
    next(err);
  }
};
