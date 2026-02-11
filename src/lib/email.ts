// Email configuration
const EMAIL_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
};

// Create reusable transporter
const createTransporter = async () => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.warn('[Email] SMTP credentials not configured. Emails will be logged to console only.');
        return null;
    }

    const nodemailer = require('nodemailer');
    return nodemailer.createTransporter(EMAIL_CONFIG);
};

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
    to: string,
    name: string,
    resetUrl: string,
    expiresAt: Date
) {
    const transporter = await createTransporter();

    // If no transporter (no SMTP config), just log to console
    if (!transporter) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 PASSWORD RESET EMAIL (Console Only - No SMTP Config)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`To: ${to}`);
        console.log(`Name: ${name}`);
        console.log(`Reset Link: ${resetUrl}`);
        console.log(`Expires: ${expiresAt.toLocaleString()}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return;
    }

    const mailOptions = {
        from: `"EduBridge Portal" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Password Reset Request - EduBridge Portal',
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            
            <p>We received a request to reset your password for your EduBridge Portal account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                ${resetUrl}
            </p>
            
            <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                    <li>This link will expire in <strong>24 hours</strong> (${expiresAt.toLocaleString()})</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your password will not change until you create a new one</li>
                </ul>
            </div>
            
            <p>If you have any questions or concerns, please contact your school administrator.</p>
            
            <p>Best regards,<br><strong>EduBridge Portal Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2025 EduBridge Technologies. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Password reset email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[Email] Failed to send password reset email:', error);
        throw error;
    }
}

/**
 * Send password reset confirmation email
 */
export async function sendPasswordResetConfirmation(
    to: string,
    name: string
) {
    const transporter = await createTransporter();

    if (!transporter) {
        console.log(`📧 Password reset confirmation email (console only) sent to: ${to}`);
        return;
    }

    const mailOptions = {
        from: `"EduBridge Portal" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Password Reset Successful - EduBridge Portal',
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Password Reset Successful</h1>
        </div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            
            <div class="success">
                <p><strong>Your password has been successfully reset!</strong></p>
            </div>
            
            <p>You can now log in to your EduBridge Portal account using your new password.</p>
            
            <p>If you did not make this change, please contact your school administrator immediately.</p>
            
            <p>Best regards,<br><strong>EduBridge Portal Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2025 EduBridge Technologies. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Password reset confirmation sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[Email] Failed to send confirmation email:', error);
        throw error;
    }
}

/**
 * Generic email sending function
 */
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail(options: EmailOptions) {
    const transporter = await createTransporter();

    if (!transporter) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 EMAIL (Console Only - No SMTP Config)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text: ${options.text || 'See HTML content'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return;
    }

    const mailOptions = {
        from: `"E-Student Portal" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Email sent to ${options.to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[Email] Failed to send email:', error);
        throw error;
    }
}
