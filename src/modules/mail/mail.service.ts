import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly logger: Logger;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT + '') || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.logger = new Logger(MailService.name);
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    const message = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8" />
            <title>Code de validation</title>
            <style>
            body {
                margin: 0;
                padding: 0;
                font-family: "Arial", sans-serif;
                background-color: #f4f4f7;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            h1 {
                color: #333333;
                font-size: 24px;
            }
            p {
                color: #555555;
                font-size: 16px;
                line-height: 1.5;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #2f54eb;
                letter-spacing: 8px;
                text-align: center;
                margin: 30px 0;
            }
            .footer {
                text-align: center;
                color: #888888;
                font-size: 12px;
                margin-top: 40px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Votre code de vérification</h1>
            <p>Bonjour,</p>
            <p>
                Pour continuer, veuillez utiliser le code de vérification ci-dessous.
            </p>

            <div class="otp-code">${otp}</div>

            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail.</p>
            <p>Merci,<br />L'équipe Support</p>

            <div class="footer">© 2025 e-resaka. Tous droits réservés.</div>
            </div>
        </body>
        </html>`;

    const info = this.transporter.sendMail({
      from: { name: 'e-resaka', address: process.env.EMAIL_FROM + '' },
      to,
      subject: "Code de vérification d'identité",
      html: message,
    });
    info
      .then((res) => {
        this.logger.log(`Email sent to ${to}: ${res.messageId}`);
      })
      .catch((err) => {
        this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      });
  }
}
