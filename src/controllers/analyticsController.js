const { getOne, getAll } = require("../config/database");

exports.getDashboard = async (req, res, next) => {
  try {
    // Total complaints
    const totalResult = await getOne(
      "SELECT COUNT(*) as total FROM complaints",
    );
    const totalComplaints = totalResult.total;

    // Status distribution
    const statusResult = await getAll(`
      SELECT status, COUNT(*) as count 
      FROM complaints 
      GROUP BY status
    `);

    // Monthly trends
    const monthlyResult = await getAll(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as submitted,
        SUM(CASE WHEN status IN ('Replaced', 'Rejected') THEN 1 ELSE 0 END) as resolved
      FROM complaints 
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC 
      LIMIT 12
    `);

    // Agent stats
    const agentResult = await getAll(`
      SELECT 
        u.id,
        u.name,
        COUNT(c.id) as tickets_created,
        SUM(CASE WHEN c.status IN ('Replaced', 'Rejected') THEN 1 ELSE 0 END) as resolved
      FROM users u
      LEFT JOIN complaints c ON u.id = c.agent_id
      WHERE u.role = 'agent'
      GROUP BY u.id, u.name
    `);

    res.json({
      success: true,
      data: {
        totalComplaints,
        statusDistribution: statusResult,
        monthlyTrends: monthlyResult,
        agentStats: agentResult,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, status } = req.query;

    let sql = "SELECT * FROM complaints WHERE 1=1";
    const values = [];

    if (dateFrom) {
      sql += " AND DATE(created_at) >= ?";
      values.push(dateFrom);
    }
    if (dateTo) {
      sql += " AND DATE(created_at) <= ?";
      values.push(dateTo);
    }
    if (status) {
      sql += " AND status = ?";
      values.push(status);
    }

    sql += " ORDER BY created_at DESC";

    const complaints = await getAll(sql, values);

    res.json({
      success: true,
      data: { complaints, total: complaints.length },
    });
  } catch (err) {
    next(err);
  }
};

exports.exportCSV = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, status } = req.query;

    let sql = "SELECT * FROM complaints WHERE 1=1";
    const values = [];

    if (dateFrom) {
      sql += " AND DATE(created_at) >= ?";
      values.push(dateFrom);
    }
    if (dateTo) {
      sql += " AND DATE(created_at) <= ?";
      values.push(dateTo);
    }
    if (status) {
      sql += " AND status = ?";
      values.push(status);
    }

    sql += " ORDER BY created_at DESC";

    const complaints = await getAll(sql, values);

    // CSV headers
    const headers = [
      "Ticket No",
      "Agent",
      "Customer",
      "Serial",
      "Model",
      "Status",
      "Created",
      "Warranty Valid",
    ];
    const rows = complaints.map((c) => [
      c.ticket_no,
      c.agent_id,
      c.customer_name,
      c.serial_no,
      c.device_model,
      c.status,
      c.created_at,
      c.warranty_valid ? "Yes" : "No",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="rcms-report-${new Date().toISOString().split("T")[0]}.csv"`,
    );
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
