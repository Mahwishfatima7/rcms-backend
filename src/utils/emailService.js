const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "info@dxbtechnologies.net",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

// Send agent credentials email
exports.sendAgentCredentialsEmail = async (agentEmail, agentName, agentPassword) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "info@dxbtechnologies.net",
      to: agentEmail,
      subject: "RCMS Account Credentials - DXB Technologies",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Welcome to RCMS</h2>
            <p style="color: #666; margin: 10px 0 0 0;">Replacement Case Management System</p>
          </div>
          
          <p style="color: #333; font-size: 16px;">Dear ${agentName},</p>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Your agent account has been successfully created in the RCMS system. Please use the following credentials to log in:
          </p>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 8px 0; color: #333;"><strong>Email:</strong> ${agentEmail}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Password:</strong> ${agentPassword}</p>
          </div>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            You can log in to RCMS at: <a href="http://localhost:8080/" style="color: #2196F3; text-decoration: none;">RCMS Portal</a>
          </p>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            For security purposes, we recommend changing your password after your first login.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent from DXB Technologies RCMS System. Please do not share your credentials with anyone.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Agent credentials email sent to ${agentEmail}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("✗ Error sending email:", error.message);
    // Don't throw error - continue with agent creation even if email fails
    return { success: false, message: error.message };
  }
};
