import nodemailer from 'nodemailer';
import config from './config';
import { LoggerService } from './logger';

class EmailService {
  private transporter: nodemailer.Transporter;
  private logger = new LoggerService('EmailService');

  constructor() {
    // In production, you would use real SMTP credentials
    // For development, we can use a test account or ethereal.email
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    });

    this.logger.info('Email service initialized');
  }

  /**
   * Send an activation email to the user
   * @param email Recipient email
   * @param name Recipient name
   * @param activationToken Token for account activation
   */
  public async sendActivationEmail(email: string, name: string, activationToken: string): Promise<void> {
    try {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const activationUrl = `${appUrl}/activate?token=${activationToken}`;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: email,
        subject: 'Activate Your Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for signing up. Please activate your account by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${activationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Activate Account
              </a>
            </div>
            <p>Or copy and paste this activation token:</p>
            <div style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; text-align: center; margin: 10px 0;">
              <code>${activationToken}</code>
            </div>
            <p>If you didn't sign up for this account, you can safely ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.info(`Activation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send activation email: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

export default new EmailService();
