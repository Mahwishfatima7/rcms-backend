const Complaint = require("../models/Complaint");
const SerialEntry = require("../models/SerialEntry");
const { getAll } = require("../config/database");

// Generate unique ticket number
const generateTicketNo = async () => {
  const result = await getAll(
    "SELECT ticket_no FROM complaints ORDER BY id DESC LIMIT 1",
  );
  if (result.length === 0) return "RCMS-000001";

  const lastTicket = result[0].ticket_no;
  const num = parseInt(lastTicket.split("-")[1]) + 1;
  return `RCMS-${String(num).padStart(6, "0")}`;
};

exports.getComplaints = async (req, res, next) => {
  try {
    const { status, agentId, search } = req.query;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const filters = {};

    if (req.user.role === "agent") {
      filters.agentId = req.user.id;
    } else if (status) {
      filters.status = status;
    }

    if (search) filters.search = search;
    filters.limit = limit;
    filters.offset = offset;

    const complaints = await Complaint.getAll(filters);
    const total = await Complaint.getCount(filters);

    res.json({
      success: true,
      data: {
        complaints,
        total,
        limit,
        offset,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getComplaintsByAgent = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const agentId = Number(req.params.agentId);

    // Ensure agent can only access their own complaints
    if (req.user.role === "agent" && req.user.id != agentId) {
      return res.status(403).json({
        success: false,
        error: "Access denied. You can only view your own complaints.",
      });
    }

    const filters = {
      agentId,
      limit,
      offset,
    };

    const complaints = await Complaint.getAll(filters);
    const total = await Complaint.getCount(filters);

    res.json({
      success: true,
      data: {
        complaints,
        total,
        limit,
        offset,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, error: "Complaint not found" });
    }

    res.json({ success: true, data: { complaint } });
  } catch (err) {
    next(err);
  }
};

exports.createComplaint = async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      serialNo,
      issueDescription,
      deviceModel,
    } = req.body;

    // Check if serial number exists in database
    if (serialNo) {
      const serialExists = await SerialEntry.findBySerialNo(serialNo);
      if (!serialExists) {
        return res.status(400).json({
          success: false,
          error: "Camera serial number does not exist in database",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: "Serial number is required",
      });
    }

    // Check if a complaint already exists for this serial number (excluding Rejected/Replaced)
    const existingComplaint = await Complaint.findActiveComplaintBySerial(serialNo);
    if (existingComplaint) {
      return res.status(400).json({
        success: false,
        error: `Complaint is already registered for this camera. Ticket: ${existingComplaint.ticket_no}`,
        data: { existingTicket: existingComplaint.ticket_no },
      });
    }

    const ticketNo = await generateTicketNo();

    const complaint = await Complaint.create({
      ticketNo,
      agentId: req.user.id,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      serialNo: serialNo,
      deviceModel: deviceModel || "Not Specified",
      issueDescription,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: { complaint },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, error: "Complaint not found" });
    }

    const updated = await Complaint.update(req.params.id, req.body);

    res.json({
      success: true,
      message: "Complaint updated",
      data: { complaint: updated },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, error: "Complaint not found" });
    }

    const updated = await Complaint.updateStatus(req.params.id, status);

    res.json({
      success: true,
      message: "Status updated",
      data: { complaint: updated },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, error: "Complaint not found" });
    }

    await Complaint.delete(req.params.id);

    res.json({
      success: true,
      message: "Complaint deleted",
    });
  } catch (err) {
    next(err);
  }
};
