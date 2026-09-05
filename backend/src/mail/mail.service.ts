import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  constructor() {
    console.log('SMTP ENV CHECK:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log(
      'SMTP_PASSWORD exists:',
      !!process.env.SMTP_PASSWORD,
    );
    console.log('SMTP_FROM:', process.env.SMTP_FROM);
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    const result = await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    return result;
  }
}